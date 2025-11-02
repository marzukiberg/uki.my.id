import { spawn } from 'child_process';
import path from 'path';
import got from 'got';

// TikWM API rate limiting - 1 request per second
let lastTikwmRequest = 0;
const TIKWM_RATE_LIMIT = 1000; // 1 second between requests

// Helper function to call TikWM API with rate limiting and retry
async function callTikwmAPI(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Enforce rate limit
      const now = Date.now();
      const timeSinceLastRequest = now - lastTikwmRequest;
      if (timeSinceLastRequest < TIKWM_RATE_LIMIT) {
        const delay = TIKWM_RATE_LIMIT - timeSinceLastRequest;
        console.log(`Rate limit: waiting ${delay}ms before request`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      lastTikwmRequest = Date.now();

      console.log(`Calling TikWM API (attempt ${attempt + 1}/${maxRetries}):`, url);
      
      const apiResponse = await got.post('https://www.tikwm.com/api/', {
        json: {
          url: url,
          hd: 1
        },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: {
          request: 10000 // 10 second timeout
        }
      }).json();

      if (apiResponse.code === 0 && apiResponse.data) {
        return apiResponse;
      } else if (apiResponse.msg && apiResponse.msg.includes('Api Limit')) {
        // Rate limit hit, wait longer and retry
        console.log('Rate limit hit, waiting 2 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      } else {
        throw new Error(apiResponse.msg || 'API request failed');
      }
    } catch (error) {
      console.error(`TikWM API error (attempt ${attempt + 1}):`, error.message);
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.log(`Retrying in ${backoffDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Simple in-memory rate limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    if (validRequests.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, validRequests);
    }
  }
}, RATE_LIMIT_WINDOW); // Clean up every minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Clean up old requests outside the window
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Add current request
  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);

  return true; // Request allowed
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.headers['x-real-ip'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   'unknown';

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }

  const { url, quality = 'best', getInfo = false } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'TikTok URL is required' });
  }

  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('tiktok.com')) {
      return res.status(400).json({ message: 'Invalid TikTok URL' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  // If getInfo is true, return video information instead of downloading
  if (getInfo) {
    return getVideoInfo(url, res);
  }

  // Validate quality parameter for download
  if (!['best', 'worst'].includes(quality)) {
    return res.status(400).json({ message: 'Invalid quality parameter. Use "best" or "worst"' });
  }

  // Otherwise, proceed with download
  return downloadVideo(url, quality, res);
}

async function getVideoInfo(url, res) {
  try {
    console.log('Getting media info for:', url);
    
    // Check if it's a photo URL - use tikwm for photos
    const isPhoto = url.includes('/photo/');
    
    if (isPhoto) {
      // Use tikwm.com API for photos
      try {
        const apiResponse = await callTikwmAPI(url);
        const { data } = apiResponse;
        
        if (data.images && data.images.length > 0) {
          // Photo post
          res.status(200).json({
            success: true,
            isPhoto: true,
            imageCount: data.images.length,
            imageUrls: data.images, // Return all image URLs
            bestSize: null,  // Not applicable for photos
            worstSize: null, // Not applicable for photos
          });
          return;
        }
      } catch (error) {
        console.error('Error getting photo info:', error);
        
        let errorMessage = 'Failed to get photo info';
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
        return;
      }
    }
    
    // For videos, use Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'download_tiktok.py');

    const pythonProcess = spawn('python3', [scriptPath, url, 'info'], {
      cwd: path.join(process.cwd(), 'scripts'),
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), 'scripts', 'venv', 'bin')}:${process.env.PATH}`,
        VIRTUAL_ENV: path.join(process.cwd(), 'scripts', 'venv'),
      },
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          // Parse size information from stderr
          const bestMatch = stderr.match(/BEST_SIZE:(\d+)/);
          const worstMatch = stderr.match(/WORST_SIZE:(\d+)/);

          const bestSize = bestMatch ? parseInt(bestMatch[1]) : null;
          const worstSize = worstMatch ? parseInt(worstMatch[1]) : null;

          res.status(200).json({
            success: true,
            isPhoto: false,
            bestSize,
            worstSize,
          });
          resolve();
        } else {
          res.status(500).json({
            success: false,
            message: 'Failed to get video info',
            error: stderr || 'Unknown error',
          });
          resolve();
        }
      });

      pythonProcess.on('error', (error) => {
        res.status(500).json({
          success: false,
          message: 'Failed to execute info script',
          error: error.message,
        });
        resolve();
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

async function downloadVideo(url, quality, res) {
  try {
    console.log('Downloading media:', url, 'quality:', quality);
    
    // Extract media ID from URL
    const mediaId = url.split('/').pop().split('?')[0] || 'media';

    // Check if it's a photo URL - use tikwm for photos
    const isPhoto = url.includes('/photo/');

    if (isPhoto) {
      // Use tikwm.com API for photos
      const apiResponse = await callTikwmAPI(url);
      const { data } = apiResponse;

      if (data.images && data.images.length > 0) {
        // For photos, get the first image
        const imageUrl = data.images[0];
        console.log('Streaming photo from:', imageUrl);

        const filename = `ukaydev_${mediaId}.jpg`;
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
    }

    // For videos, use Python script
    const baseFilename = `ukaydev_${mediaId}`;
    const filename = quality === 'best' ? `${baseFilename}_hd.mp4` : `${baseFilename}.mp4`;
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
  } catch (error) {
    console.error('API error:', error);
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