import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import got from 'got';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

// Rate limiting helper
function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Filter out old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true;
}

// Helper function to call tikwm API with retry logic
async function callTikwmAPI(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tikwm API attempt ${attempt}/${maxRetries} for: ${url}`);

      // Add delay between requests (1 second minimum)
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
      const response = await got.get(apiUrl, {
        timeout: { request: 10000 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const data = JSON.parse(response.body);

      if (data.code === 0 && data.data) {
        return { success: true, data: data.data };
      } else {
        throw new Error(data.msg || 'API returned error');
      }
    } catch (error) {
      console.error(`Tikwm API attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
}

// Download media
async function downloadMedia(url, quality, res) {
  try {
    console.log('Downloading media:', url, 'quality:', quality);

    // Extract media ID from URL
    const mediaId = url.split('/').pop().split('?')[0] || 'media';

    // Check if it's a photo URL
    const isPhoto = url.includes('/photo/');

    if (isPhoto) {
      // Use tikwm.com API for photos
      const apiResponse = await callTikwmAPI(url);
      const { data } = apiResponse;

      if (data.images && data.images.length > 0) {
        // For photos, download the first image (or specific index if provided)
        const imageIndex = quality.startsWith('photo_') ? parseInt(quality.split('_')[1]) - 1 : 0;
        const imageUrl = data.images[imageIndex] || data.images[0];

        console.log('Streaming photo from:', imageUrl);

        const filename = `ukaydev_${mediaId}${imageIndex > 0 ? `_${imageIndex + 1}` : ''}.jpg`;
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Cache-Control', 'no-cache');

        const imageStream = got.stream(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.tiktok.com/',
          },
        });

        imageStream.pipe(res);

        return new Promise((resolve) => {
          imageStream.on('end', () => {
            console.log('Photo streamed successfully');
            resolve();
          });
          imageStream.on('error', (error) => {
            console.error('Error streaming photo:', error);
            if (!res.headersSent) {
              res.status(500).json({
                success: false,
                message: 'Failed to stream photo',
                error: error.message,
              });
            }
            resolve();
          });
        });
      } else {
        throw new Error('No images found in response');
      }
    } else {
      // For videos, use Python script
      const baseFilename = `ukaydev_${mediaId}`;
      const filename = quality === 'hd' ? `${baseFilename}_hd.mp4` : `${baseFilename}.mp4`;
      const contentType = 'video/mp4';

      // Path to the Python script
      const scriptPath = path.join(process.cwd(), 'scripts', 'download_tiktok.py');

      // Execute Python script to stream media
      const pythonProcess = spawn('python3', [scriptPath, url, quality], {
        cwd: path.join(process.cwd(), 'scripts'),
        env: {
          ...process.env,
          PATH: `${path.join(process.cwd(), 'scripts', 'venv', 'bin')}:${process.env.PATH}`,
          VIRTUAL_ENV: path.join(process.cwd(), 'scripts', 'venv'),
        },
      });

      // Set headers for media streaming
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');

      let hasError = false;
      let errorMessage = '';

      // Handle stderr for error logging
      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error('Python stderr:', error);

        if (!hasError && !error.includes('Video streamed successfully') && !error.includes('Streaming')) {
          hasError = true;
          errorMessage = error;
        }
      });

      // Pipe stdout (media data) directly to response
      pythonProcess.stdout.pipe(res);

      return new Promise((resolve) => {
        pythonProcess.on('close', (code) => {
          if (code === 0 && !hasError) {
            console.log(`Video streamed successfully (${quality})`);
            resolve();
          } else {
            if (!res.headersSent) {
              res.status(500).json({
                success: false,
                message: 'Failed to stream video',
                error: errorMessage || 'Unknown error',
              });
            }
            resolve();
          }
        });

        pythonProcess.on('error', (error) => {
          console.error('Failed to start Python process:', error);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: 'Failed to execute streaming script',
              error: error.message,
            });
          }
          resolve();
        });
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      let errorMessage = 'Internal server error';
      if (error.message.includes('Api Limit')) {
        errorMessage = 'Server is busy. Please try again in a few seconds.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  }
}

export default async function handler(req, res) {
  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

  if (req.method === 'POST') {
    // Handle POST request for download with URL in body
    const { url, quality } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a minute before trying again.'
      });
    }

    try {
      await downloadMedia(url, quality || 'regular', res);
    } catch (error) {
      console.error('Download error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Download failed',
          error: error.message
        });
      }
    }
  } else if (req.method === 'GET') {
    // Keep GET for backward compatibility
    const { url, action, quality } = req.query;

    if (!url || action !== 'download') {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a minute before trying again.'
      });
    }

    try {
      await downloadMedia(url, quality || 'regular', res);
    } catch (error) {
      console.error('Download error:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Download failed',
          error: error.message
        });
      }
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};