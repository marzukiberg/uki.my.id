import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

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
    console.log('Getting YouTube video info for:', url);

    // Use yt-dlp to get video information in JSON format
    const ytDlpPath = path.join(process.cwd(), 'scripts', 'venv', 'bin', 'yt-dlp');
    const ytDlpProcess = spawn(ytDlpPath, [
      '--no-warnings',
      '--no-check-certificate',
      '--print-json',
      '--skip-download',
      url
    ], {
      cwd: process.cwd(),
    });

    let stdout = '';
    let stderr = '';

    ytDlpProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ytDlpProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve) => {
      ytDlpProcess.on('close', (code) => {
        if (code === 0 && stdout) {
          try {
            const videoInfo = JSON.parse(stdout.trim());

            // Extract and format available formats from video info
            const formats = (videoInfo.formats || []).map(format => ({
              format_id: format.format_id,
              ext: format.ext,
              resolution: format.resolution || `${format.width}x${format.height}`,
              filesize: format.filesize || format.filesize_approx || null,
              format_note: format.format_note,
              vcodec: format.vcodec,
              acodec: format.acodec,
              height: format.height,
              width: format.width,
              tbr: format.tbr,
            }));

            res.status(200).json({
              success: true,
              title: videoInfo.title,
              duration: videoInfo.duration,
              thumbnail: videoInfo.thumbnail,
              uploader: videoInfo.uploader,
              view_count: videoInfo.view_count,
              upload_date: videoInfo.upload_date,
              formats: formats,
            });
            resolve();

          } catch (parseError) {
            console.error('Error parsing video info JSON:', parseError);
            res.status(500).json({
              success: false,
              message: 'Failed to parse video information',
              error: parseError.message,
            });
            resolve();
          }
        } else {
          console.error('yt-dlp error:', stderr);
          res.status(500).json({
            success: false,
            message: 'Failed to get video info',
            error: stderr || 'Unknown error',
          });
          resolve();
        }
      });

      ytDlpProcess.on('error', (error) => {
        console.error('Error executing yt-dlp:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to execute yt-dlp',
          error: error.message,
        });
        resolve();
      });
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}