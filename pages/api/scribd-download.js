import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Disable Next.js API timeout for long-running downloads
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

    // Prevent Next.js timeout warning
    let responseSent = false;

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

    const { url, mode } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    // Validate URL is from supported platforms
    const supportedDomains = ['scribd.com', 'slideshare.net', 'everand.com'];
    const isSupported = supportedDomains.some(domain => url.includes(domain));

    if (!isSupported) {
        return res.status(400).json({
            message: 'Unsupported URL. Please provide a Scribd, SlideShare, or Everand link.'
        });
    }

    // Validate mode parameter (optional, defaults to 'default')
    const validModes = ['default', 'image'];
    const downloadMode = mode && validModes.includes(mode) ? mode : 'default';

    // Generate unique ID from URL for temp directory
    const id = url.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50) + '-' + Date.now();

    try {
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'tmp', `scribd-${id}-${Date.now()}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        // Path to the script
        const scriptPath = path.join(process.cwd(), 'scripts', 'scribd-dl', 'run.js');

        // Build arguments: add /i flag if mode is 'image'
        const scriptArgs = [];
        if (downloadMode === 'image') {
            scriptArgs.push('/i');
        }
        scriptArgs.push(url, `--output=${tempDir}`);

        // Spawn the Node.js process
        // Use 'node' command with explicit PATH to ensure it finds the correct binary
        const child = spawn('node', [scriptPath, ...scriptArgs], {
            cwd: path.dirname(scriptPath),
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
                ...process.env,
                PATH: `${process.env.PATH || ''}:/usr/local/bin:/usr/bin`,
                NODE_PATH: path.join(process.cwd(), 'node_modules')
            }
        }); let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', async (code) => {
            if (responseSent) return;

            console.log('Scribd script exit code:', code);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            if (code !== 0) {
                console.error('Scribd download failed:', stderr);
                // Cleanup temp dir
                await fs.promises.rm(tempDir, { recursive: true, force: true });
                responseSent = true;
                return res.status(500).json({ message: 'Failed to download document', error: stderr });
            }

            try {
                // List all files in temp dir
                const files = await fs.promises.readdir(tempDir, { recursive: true });
                console.log('Files in temp dir:', files);

                const pdfFile = files.find(file => file.endsWith('.pdf'));

                if (!pdfFile) {
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                    responseSent = true;
                    return res.status(500).json({ message: 'PDF file not found' });
                }

                const pdfPath = path.join(tempDir, pdfFile);
                const stat = await fs.promises.stat(pdfPath);

                // Set headers for file download
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(pdfFile)}"`);
                res.setHeader('Content-Length', stat.size);

                // Stream the file
                const fileStream = fs.createReadStream(pdfPath);

                fileStream.on('error', async (error) => {
                    if (responseSent) return;
                    console.error('Error streaming file:', error);
                    await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                    responseSent = true;
                    if (!res.headersSent) {
                        res.status(500).json({ message: 'Error streaming file' });
                    }
                });

                fileStream.on('end', async () => {
                    responseSent = true;
                    // Cleanup temp dir after sending
                    await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                });

                fileStream.pipe(res);

            } catch (error) {
                if (responseSent) return;
                console.error('Error reading PDF file:', error);
                await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                responseSent = true;
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error reading downloaded file', error: error.message });
                }
            }
        });

        child.on('error', async (error) => {
            if (responseSent) return;
            console.error('Error spawning Scribd download process:', error);
            await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
            responseSent = true;
            if (!res.headersSent) {
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });

    } catch (error) {
        if (responseSent) return;
        console.error('Error in Scribd download API:', error);
        responseSent = true;
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}