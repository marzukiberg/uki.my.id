import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { mirror } = req.body;

    if (!mirror || typeof mirror !== 'string') {
        return res.status(400).json({ message: 'Mirror URL is required' });
    }

    try {
        // Fetch the mirror page
        const response = await axios.get(mirror, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Find the download link
        const downloadLink = $('a[href*="get.php"]').first().attr('href');

        if (!downloadLink) {
            return res.status(404).json({ message: 'Download link not found' });
        }

        // Construct full URL
        const fullUrl = downloadLink.startsWith('http') ? downloadLink : new URL(downloadLink, mirror).href;

        res.status(200).json({ downloadUrl: fullUrl });
    } catch (error) {
        console.error('Book download error:', error);
        res.status(500).json({ message: 'Failed to get download link' });
    }
}