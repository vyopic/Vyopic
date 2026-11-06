/**
 * Cloudflare Pages Functions - AI Cartoon Avatar Maker
 * Route: /api/cartoon
 * Model: @cf/black-forest-labs/flux-2-klein-4b
 * Documentation: https://developers.cloudflare.com/changelog/post/2026-01-15-flux-2-klein-4b-workers-ai/
 */

const STYLE_PROMPTS = {
  'hand-drawn':
    'masterpiece hand drawn cartoon avatar portrait of the person, expressive pencil and ink line art, vibrant watercolor shading, stylized caricature features, artistic storybook illustration style, high quality',
  'cute-cartoon':
    'adorable cute 3D cartoon avatar of the person, big friendly sparkling eyes, smooth Pixar Disney inspired 3D animation style, warm soft lighting, charming smile, pastel colorful background, 4k render',
  'cool-sunglasses':
    'stylish trendy cartoon avatar portrait of the person wearing modern dark cool sunglasses, vibrant streetwear fashion, neon aesthetic reflections, confident cinematic pose, detailed vector pop-art style',
  'glasses-avatar':
    'charming intellectual cartoon avatar portrait of the person wearing elegant stylish eyeglasses, warm friendly expression, refined graphic novel illustration, clean detailed outlines, soft cinematic ambient lighting',
  'anime-illustration':
    'stunning modern Japanese anime key visual portrait of the person, Makoto Shinkai and Studio Ghibli inspired art style, beautiful luminous anime eyes, flowing hair highlights, vibrant detailed coloring, aesthetic anime portrait',
  'minimalist-portrait':
    'chic modern minimalist flat line vector avatar of the person, clean geometric shapes, elegant pastel color palette, contemporary silhouette art, aesthetic Scandinavian design, studio portrait illustration'
};

export async function onRequestPost(context) {
  const { request, env } = context;

  // Response headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Expected multipart/form-data.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');
    const styleKey = (formData.get('style') || 'cute-cartoon').toString();
    const customPrompt = formData.get('prompt') ? formData.get('prompt').toString() : '';

    // 1. Validate Image presence
    if (!imageFile || typeof imageFile === 'string') {
      return new Response(
        JSON.stringify({ error: 'No image uploaded. Please upload a photo.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Validate MIME Type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(imageFile.type?.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: 'Invalid file format. Please upload JPG, PNG, or WebP image.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Validate Max 5 MB File Size
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (imageFile.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit. Please upload a smaller photo.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Select Style Prompt
    const basePrompt = STYLE_PROMPTS[styleKey] || STYLE_PROMPTS['cute-cartoon'];
    const finalPrompt = customPrompt ? `${basePrompt}, ${customPrompt}` : basePrompt;

    // 5. Verify Workers AI binding
    if (!env || !env.AI) {
      return new Response(
        JSON.stringify({
          error: 'Cloudflare Workers AI binding "AI" is not configured in this environment.',
          fallbackRequired: true
        }),
        { status: 503, headers: corsHeaders }
      );
    }

    // 6. Build multipart/form-data for FLUX.2 Klein 4B
    const form = new FormData();
    form.append('prompt', finalPrompt);
    form.append('width', '512');
    form.append('height', '512');
    form.append('input_image_0', imageFile, imageFile.name || 'avatar_source.jpg');

    // Serialize FormData using a Response wrapper to generate multipart boundary
    const formResponse = new Response(form);
    const formStream = formResponse.body;
    const formContentType = formResponse.headers.get('content-type');

    let result;
    try {
      result = await env.AI.run('@cf/black-forest-labs/flux-2-klein-4b', {
        multipart: {
          body: formStream,
          headers: {
            'content-type': formContentType
          }
        }
      });
    } catch (runErr) {
      // Direct Response retry in case Workers runtime prefers direct Response object
      const retryFormResponse = new Response(form);
      result = await env.AI.run('@cf/black-forest-labs/flux-2-klein-4b', retryFormResponse);
    }

    // 7. Parse response and convert to Base64
    let imageBuffer;
    if (result instanceof ReadableStream) {
      imageBuffer = await new Response(result).arrayBuffer();
    } else if (result instanceof Response) {
      imageBuffer = await result.arrayBuffer();
    } else if (result instanceof ArrayBuffer) {
      imageBuffer = result;
    } else if (result?.buffer) {
      imageBuffer = result.buffer;
    } else if (typeof result === 'string') {
      const dataUri = result.startsWith('data:') ? result : `data:image/jpeg;base64,${result}`;
      return new Response(
        JSON.stringify({ success: true, image: dataUri, style: styleKey }),
        { headers: corsHeaders }
      );
    } else if (result?.image) {
      const dataUri = result.image.startsWith('data:') ? result.image : `data:image/jpeg;base64,${result.image}`;
      return new Response(
        JSON.stringify({ success: true, image: dataUri, style: styleKey }),
        { headers: corsHeaders }
      );
    }

    if (!imageBuffer) {
      throw new Error('Failed to parse generated image buffer from Workers AI.');
    }

    // Convert ArrayBuffer to Base64
    const bytes = new Uint8Array(imageBuffer);
    let binary = '';
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);
    const outputDataUrl = `data:image/jpeg;base64,${base64}`;

    return new Response(
      JSON.stringify({
        success: true,
        image: outputDataUrl,
        style: styleKey,
        model: '@cf/black-forest-labs/flux-2-klein-4b'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('AI Cartoon Avatar generation error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Avatar generation failed. Please try again.',
        details: String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
