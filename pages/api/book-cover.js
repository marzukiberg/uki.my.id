import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
        const detailUrl = `https://libgen.li/edition.php?id=${id}`;
        const response = await axios.get(detailUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const imgSrc = $('img.img-fluid').first().attr('src');
        if (imgSrc) {
            const cover = imgSrc.startsWith('http') ? imgSrc : `https://libgen.li${imgSrc}`;
            res.status(200).json({ cover });
        } else {
            res.status(404).json({ message: 'Cover not found' });
        }
    } catch (error) {
        console.error('Cover fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch cover' });
    }
}