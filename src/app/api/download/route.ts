import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');

        // Create a new Response object
        const newResponse = new NextResponse(await response.text());

        // Set headers
        newResponse.headers.set('Content-Type', contentType || 'application/octet-stream');
        if (contentDisposition) {
            newResponse.headers.set('Content-Disposition', contentDisposition);
        }

        return newResponse;
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Error downloading file' }, { status: 500 });
    }
}