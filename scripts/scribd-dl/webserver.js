import express from 'express';
import { app } from './src/App.js';
import fs from 'fs';

const server = express();
const PORT = process.env.PORT || 3001;

// Serve static files from output directory
server.use('/output', express.static('output'));

server.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        await app.execute(url);
        
        // Find the latest PDF file in output directory
        const files = fs.readdirSync('output');
        const pdfFiles = files.filter(f => f.endsWith('.pdf'));
        if (pdfFiles.length === 0) {
            return res.status(500).json({ error: 'No PDF file found after download' });
        }
        const latestFile = pdfFiles.sort((a, b) => 
            fs.statSync(`output/${b}`).mtime - fs.statSync(`output/${a}`).mtime
        )[0];
        
        res.json({ 
            message: 'Download completed successfully', 
            downloadLink: `${req.protocol}://${req.get('host')}/output/${latestFile}` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Download failed', details: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});