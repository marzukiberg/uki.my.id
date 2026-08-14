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

    const { url, mode, format } = req.body;

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
    const validModes = ['default', 'image', 'docx'];
    const downloadMode = mode && validModes.includes(mode) ? mode : 'default';

    // Format parameter for output type (pdf or txt/docx)
    const validFormats = ['pdf', 'docx', 'both'];
    const outputFormat = format && validFormats.includes(format) ? format : 'pdf';

    // Generate unique ID from URL for temp directory
    const id = url.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50) + '-' + Date.now();

    try {
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'tmp', `scribd-${id}-${Date.now()}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        // Path to the script
        const scriptPath = path.join(process.cwd(), 'scripts', 'scribd-dl', 'run.js');

        // For 'both' format, we need to run twice - first PDF, then DOCX
        const needsBothFormats = outputFormat === 'both';

        // Build arguments: add flag based on mode
        // For DOCX format output, we download PDF first then convert it
        const scriptArgs = [];
        if (downloadMode === 'image') {
            scriptArgs.push('/i');
        } else if (downloadMode === 'docx' && outputFormat !== 'docx') {
            // Only use /docx flag if explicitly requested via mode and NOT for conversion
            scriptArgs.push('/docx');
        }
        // For 'docx' format output or 'both', we download PDF (default mode)
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

            // If 'both' format, run second script for DOCX
            if (needsBothFormats) {
                console.log('Running second pass for DOCX...');
                const docxArgs = [scriptPath, '/docx', url, `--output=${tempDir}`];
                const docxChild = spawn('node', docxArgs, {
                    cwd: path.dirname(scriptPath),
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: {
                        ...process.env,
                        PATH: `${process.env.PATH || ''}:/usr/local/bin:/usr/bin`,
                        NODE_PATH: path.join(process.cwd(), 'node_modules')
                    }
                });

                let docxStdout = '';
                let docxStderr = '';

                docxChild.stdout.on('data', (data) => {
                    docxStdout += data.toString();
                });

                docxChild.stderr.on('data', (data) => {
                    docxStderr += data.toString();
                });

                docxChild.on('close', async (docxCode) => {
                    if (responseSent) return;
                    console.log('DOCX script exit code:', docxCode);
                    if (docxCode !== 0) {
                        console.error('DOCX generation failed, but PDF succeeded. Continuing with PDF only.');
                    }
                    // Continue to file processing regardless of DOCX success
                    await processDownloadedFiles();
                });

                return; // Wait for DOCX process
            }

            // If not 'both', process files immediately
            await processDownloadedFiles();
        });

        // Function to process downloaded files
        const processDownloadedFiles = async () => {
            if (responseSent) return;

            try {
                // List all files in temp dir
                const files = await fs.promises.readdir(tempDir, { recursive: true });
                console.log('Files in temp dir:', files);

                const pdfFile = files.find(file => file.endsWith('.pdf'));
                const txtFile = files.find(file => file.endsWith('.txt'));

                // If requesting DOCX format, convert PDF to DOCX using Pandoc
                if (outputFormat === 'docx' || downloadMode === 'docx') {
                    if (!pdfFile) {
                        await fs.promises.rm(tempDir, { recursive: true, force: true });
                        responseSent = true;
                        return res.status(500).json({ message: 'PDF file not found for conversion' });
                    }

                    const pdfPath = path.join(tempDir, pdfFile);
                    const docxPath = pdfPath.replace('.pdf', '.docx');

                    // Helper to stream DOCX file and return (defined first so it's available in all converters)
                    const streamDocx = async (filePath) => {
                        try {
                            const stat = await fs.promises.stat(filePath);
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                            res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
                            res.setHeader('Content-Length', stat.size);

                            const fileStream = fs.createReadStream(filePath);

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
                                await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                            });

                            fileStream.pipe(res);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    };

                    // Use Adobe Acrobat (PDF Services) for conversion
                    try {
                        const acrobat = require('../../lib/acrobatService');
                        console.log('Attempting Adobe Acrobat (PDF Services) conversion...');
                        await acrobat.convertPdfToDocxWithAdobe(pdfPath, docxPath);
                        if (await fs.promises.access(docxPath).then(() => true).catch(() => false)) {
                            console.log('Adobe Acrobat conversion succeeded');
                            return streamDocx(docxPath);
                        }
                    } catch (e) {
                        // Adobe conversion failed
                        console.error('Adobe Acrobat conversion failed:', e?.message || e);
                        await fs.promises.rm(tempDir, { recursive: true, force: true });
                        responseSent = true;
                        return res.status(500).json({
                            message: 'Failed to convert PDF to DOCX using Adobe Acrobat',
                            error: e?.message || String(e)
                        });
                    }

                    // If we reach here, conversion succeeded but file not found
                    await fs.promises.rm(tempDir, { recursive: true, force: true });
                    responseSent = true;
                    return res.status(500).json({
                        message: 'Conversion completed but output file not found'
                    });
                } else if (outputFormat === 'both') {
                    // Return JSON with both file paths/info
                    const result = {
                        success: true,
                        files: []
                    };

                    if (pdfFile) {
                        const pdfPath = path.join(tempDir, pdfFile);
                        const pdfStat = await fs.promises.stat(pdfPath);
                        result.files.push({
                            type: 'pdf',
                            filename: path.basename(pdfFile),
                            size: pdfStat.size,
                            path: pdfPath
                        });
                    }

                    if (txtFile) {
                        const txtPath = path.join(tempDir, txtFile);
                        const txtStat = await fs.promises.stat(txtPath);
                        result.files.push({
                            type: 'docx',
                            filename: path.basename(txtFile).replace('.txt', '.docx'),
                            size: txtStat.size,
                            path: txtPath
                        });
                    }

                    responseSent = true;
                    res.status(200).json(result);

                    // Cleanup after response
                    setTimeout(async () => {
                        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                    }, 5000);
                } else {
                    // Default: return PDF
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
                }

            } catch (error) {
                if (responseSent) return;
                console.error('Error reading downloaded file:', error);
                await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
                responseSent = true;
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error reading downloaded file', error: error.message });
                }
            }
        };

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