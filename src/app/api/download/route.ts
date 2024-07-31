import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');

        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        if (contentDisposition) {
            res.setHeader('Content-Disposition', contentDisposition);
        }

        if (response.body) {
            response.body.pipe(res);
        } else {
            throw new Error('Response body is null');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Error downloading file' });
    }
}