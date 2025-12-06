import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    // Extract ID from Scribd URL
    const match = url.match(/scribd\.com\/document\/(\d+)/);
    if (!match) {
        return res.status(400).json({ message: 'Invalid Scribd URL' });
    }
    const id = match[1];

    try {
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'tmp', `scribd-${id}-${Date.now()}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        // Path to the script
        const scriptPath = path.join(process.cwd(), 'scripts', 'scribd-dl', 'run.js');

        // Spawn the Node.js process
        const child = spawn('node', [scriptPath, url, `--output=${tempDir}`], {
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
            console.log('Scribd script exit code:', code);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            if (code !== 0) {
                console.error('Scribd download failed:', stderr);
                // Cleanup temp dir
                await fs.promises.rm(tempDir, { recursive: true, force: true });
                return res.status(500).json({ message: 'Failed to download document', error: stderr });
            }

            try {
                // List all files in temp dir
                const files = await fs.promises.readdir(tempDir, { recursive: true });
                console.log('Files in temp dir:', files);

                const pdfFile = files.find(file => file.endsWith('.pdf'));

                if (!pdfFile) {
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
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
                console.error('Error reading PDF file:', error);
                await fs.promises.rm(tempDir, { recursive: true, force: true });
                res.status(500).json({ message: 'Error reading downloaded file', error: error.message });
            }
        }); child.on('error', async (error) => {
            console.error('Error spawning Scribd download process:', error);
            await fs.promises.rm(tempDir, { recursive: true, force: true });
            res.status(500).json({ message: 'Internal server error', error: error.message });
        });

    } catch (error) {
        console.error('Error in Scribd download API:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}