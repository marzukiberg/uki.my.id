import { spawn } from 'child_process';
import path from 'path';
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

      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
}

// Get media info using Python script
async function getPythonMediaInfo(url) {
  return new Promise((resolve, reject) => {
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

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(stdout.trim());
          resolve(info);
        } catch (parseError) {
          console.error('Failed to parse Python output:', parseError);
          reject(new Error('Failed to parse video info'));
        }
      } else {
        console.error('Python script error:', stderr);
        reject(new Error(stderr || 'Failed to get video info'));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(new Error('Failed to execute info script'));
    });
  });
}

export default async function handler(req, res) {
  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { url } = req.body;

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
    console.log('Server-side processing URL:', url);

    // Check if it's a photo URL
    const isPhoto = url.includes('/photo/');

    if (isPhoto) {
      // Use tikwm.com API for photos
      const apiResponse = await callTikwmAPI(url);
      const { data } = apiResponse;

      if (data.images && data.images.length > 0) {
        const images = data.images.map((imageUrl, index) => ({
          url: imageUrl,
          index: index + 1,
          size: null // Size will be determined during download
        }));

        return res.status(200).json({
          success: true,
          isPhoto: true,
          images: images,
          title: data.title || 'TikTok Photo',
          author: data.author?.nickname || 'Unknown',
          originalUrl: url
        });
      } else {
        throw new Error('No images found in response');
      }
    } else {
      // Use Python script for videos to get size info
      const info = await getPythonMediaInfo(url);
      
      return res.status(200).json({
        success: true,
        isPhoto: false,
        title: info.title || 'TikTok Video',
        author: info.author || 'Unknown',
        bestSize: info.best_size || null,
        worstSize: info.worst_size || null,
        regularUrl: url, // Store original URL
        hdUrl: url,
        originalUrl: url
      });
    }
  } catch (error) {
    console.error('Server-side error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process URL'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};