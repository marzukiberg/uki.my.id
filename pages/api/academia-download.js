import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    // SECURITY: simple validation - require either a valid session cookie or a secret key
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;
    const providedSecret = req.body?.secret || req.headers['x-secret'];
    const authHeader = req.headers['authorization'];
    const cookieAuth = req.cookies?.auth;
    if (AUTH_SECRET_KEY) {
        if (cookieAuth !== 'true' && providedSecret !== AUTH_SECRET_KEY && !(authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === AUTH_SECRET_KEY)) {
            return res.status(401).json({ message: 'Unauthorized: invalid session or secret' });
        }
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    // Extract base filename from Academia URL
    const uri = new URL(url);
    const baseFilename = uri.pathname.split('/').pop().slice(0, 250);

    try {
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'tmp', `academia-${baseFilename}-${Date.now()}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        // Path to the script
        const scriptPath = path.join(process.cwd(), 'scripts', 'academia-dl', 'academia-dl.rb');

        // Spawn the Ruby process
        const child = spawn('ruby', [scriptPath, `--output=${tempDir}`, url], {
            cwd: path.dirname(scriptPath),
            stdio: ['pipe', 'pipe', 'pipe']
        }); let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', async (code) => {
            console.log('Academia script exit code:', code);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            if (code !== 0) {
                console.error('Academia download failed:', stderr);
                // Cleanup temp dir
                await fs.promises.rm(tempDir, { recursive: true, force: true });
                return res.status(500).json({ message: 'Failed to download paper', error: stderr });
            }

            try {
                // Find the downloaded file in temp dir
                const files = await fs.promises.readdir(tempDir);
                console.log('Files in temp dir:', files);

                const downloadedFile = files.find(file =>
                    file.endsWith('.pdf') || file.endsWith('.doc') || file.endsWith('.docx')
                );

                if (!downloadedFile) {
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                    return res.status(500).json({ message: 'Downloaded file not found', stdout, stderr });
                }

                const filePath = path.join(tempDir, downloadedFile);
                const stat = await fs.promises.stat(filePath);

                // Determine content type
                let contentType = 'application/pdf';
                if (downloadedFile.endsWith('.doc')) {
                    contentType = 'application/msword';
                } else if (downloadedFile.endsWith('.docx')) {
                    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                }

                // Set headers for file download
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `attachment; filename="${downloadedFile}"`);
                res.setHeader('Content-Length', stat.size);

                // Stream the file
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);

                fileStream.on('end', async () => {
                    // Cleanup temp dir after sending
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                });

                fileStream.on('error', async (error) => {
                    console.error('Error streaming file:', error);
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                    res.status(500).json({ message: 'Error streaming file' });
                });

            } catch (error) {
                console.error('Error reading downloaded file:', error);
                await fs.promises.rm(tempDir, { recursive: true, force: true });
                res.status(500).json({ message: 'Error reading downloaded file', error: error.message });
            }
        }); child.on('error', async (error) => {
            console.error('Error spawning Academia download process:', error);
            await fs.promises.rm(tempDir, { recursive: true, force: true });
            res.status(500).json({ message: 'Internal server error', error: error.message });
        });

    } catch (error) {
        console.error('Error in Academia download API:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}