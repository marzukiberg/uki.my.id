import axios from 'axios';
import * as cheerio from 'cheerio';
import { spawn } from 'child_process';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        // Run Python script
        const pythonProcess = spawn('python3', [
            '-c',
            `
import sys
sys.path.insert(0, './scripts/libgen-api-enhanced')
from libgen_api_enhanced import LibgenSearch
import json

s = LibgenSearch()
results = s.search_default('${query.replace(/'/g, "\\'")}')

books = []
for book in results:
    books.append({
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'publisher': book.publisher,
        'year': book.year,
        'language': book.language,
        'pages': book.pages,
        'size': book.size,
        'extension': book.extension,
        'mirrors': book.mirrors,
    })

print(json.dumps(books))
            `
        ], { cwd: process.cwd() });

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorOutput);
                return res.status(500).json({ message: 'Failed to search books' });
            }

            try {
                const books = JSON.parse(output.trim());
                res.status(200).json({ items: books });
            } catch (parseError) {
                console.error('JSON parse error:', parseError, 'Output:', output);
                res.status(500).json({ message: 'Failed to parse search results' });
            }
        });

    } catch (error) {
        console.error('Book search error:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
}