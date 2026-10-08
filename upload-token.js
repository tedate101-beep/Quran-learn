import { handleUpload } from '@vercel/blob/client';

export default async function handler(request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const body = await request.json();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: [
          'audio/*', 'image/*', 'application/pdf', 'video/*', 'text/plain'
        ],
        maximumSizeInBytes: 512 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ pathname })
      }),
      onUploadCompleted: async () => {}
    });
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 400 });
  }
}
