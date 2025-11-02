import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url, format = 'best' } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'YouTube URL is required' });
  }

  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  try {
    console.log('Downloading YouTube video:', url, 'format:', format);

    // Create temporary directory
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop() || 'video';
    
    // Determine if audio or video format
    const isAudioFormat = format.includes('audio') || format.includes('bestaudio');
    
    // Determine format selector
    let formatSelector;
    if (isAudioFormat) {
      formatSelector = 'bestaudio/best';
    } else if (format.includes('+')) {
      formatSelector = format;
    } else {
      formatSelector = `${format}+bestaudio/best`;
    }

    // Build output template - for audio, let yt-dlp handle the extension
    const outputTemplate = `${timestamp}_${videoId}`;
    const outputPath = isAudioFormat 
      ? path.join(tempDir, `${outputTemplate}.%(ext)s`)
      : path.join(tempDir, `${outputTemplate}.mp4`);

    // Download with yt-dlp
    const ytDlpPath = path.join(process.cwd(), 'scripts', 'venv', 'bin', 'yt-dlp');
    const ytDlpArgs = [
      '--no-warnings',
      '--no-check-certificate',
      '--format', formatSelector,
      '--output', outputPath,
      url
    ];

    // Add format-specific flags
    if (isAudioFormat) {
      ytDlpArgs.splice(4, 0, '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '192K');
    } else {
      ytDlpArgs.splice(4, 0, '--merge-output-format', 'mp4');
    }

    console.log('yt-dlp command:', ytDlpArgs.join(' '));

    // Execute yt-dlp
    await new Promise((resolve, reject) => {
      const ytDlpProcess = spawn(ytDlpPath, ytDlpArgs, {
        cwd: process.cwd(),
      });

      let stderr = '';
      
      ytDlpProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('yt-dlp:', data.toString());
      });

      ytDlpProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error('yt-dlp error:', stderr);
          reject(new Error(stderr || 'Failed to download video'));
        }
      });

      ytDlpProcess.on('error', (error) => {
        reject(error);
      });
    });

    // Check if file exists and get the actual filename
    const files = fs.readdirSync(tempDir);
    const downloadedFile = files.find(file => file.startsWith(`${timestamp}_${videoId}`));
    
    if (!downloadedFile) {
      throw new Error('Downloaded file not found');
    }

    const filePath = path.join(tempDir, downloadedFile);
    const stats = fs.statSync(filePath);
    const fileExt = path.extname(downloadedFile).slice(1);

    // Set headers
    const filename = `ukaydev_youtube_${videoId}.${fileExt}`;
    res.setHeader('Content-Type', fileExt === 'mp3' ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Cleanup after streaming
    fileStream.on('end', async () => {
      try {
        await unlinkAsync(filePath);
        console.log('Cleaned up temp file:', filePath);
      } catch (err) {
        console.error('Error cleaning up:', err);
      }
    });

    fileStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to stream video' });
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to download video',
        error: error.message,
      });
    }
  }
}
