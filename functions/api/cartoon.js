/**
 * Cloudflare Pages Functions - AI Cartoon Avatar Maker
 * Route: /api/cartoon
 * Model: @cf/black-forest-labs/flux-2-klein-4b
 * Documentation: https://developers.cloudflare.com/changelog/post/2026-01-15-flux-2-klein-4b-workers-ai/
 */

const STYLE_PROMPTS = {
  'cute-cartoon':
    'adorable cute 3D cartoon avatar portrait of the person, big expressive sparkling Disney Pixar 3D animation eyes, charming warm smile, smooth animated skin, stylized 3D caricature, colorful pastel studio lighting, 4k render',
  'hand-drawn':
    'masterpiece hand drawn cartoon avatar portrait of the person, expressive black ink line art, stylized pencil caricature, vibrant storybook watercolor shading, artistic paper texture, high quality illustration',
  'cool-sunglasses':
    'trendy cool cartoon avatar portrait of the person wearing stylish dark sunglasses, vibrant streetwear fashion, neon aesthetic reflections, confident cinematic pose, detailed vector pop-art style',
  'glasses-avatar':
    'charming intellectual cartoon avatar portrait of the person wearing modern round eyeglasses, clear glass reflection, graphic novel illustration, clean comic line art, soft ambient studio lighting',
  'anime-illustration':
    'stunning modern Japanese anime key visual portrait of the person, Makoto Shinkai and Studio Ghibli inspired art style, beautiful luminous anime eyes, luminous hair highlights, vibrant detailed cel-shading coloring',
  'minimalist-portrait':
    'chic modern minimalist flat line vector avatar of the person, clean geometric shapes, elegant pastel color palette, contemporary Scandinavian silhouette portrait illustration'
};

export async function onRequestPost(context) {
  const { request, env } = context;

  // Response headers for CORS & JSON
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
        JSON.stringify({
          success: false,
          error: 'Invalid content type. Expected multipart/form-data.'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');
    const styleKey = (formData.get('style') || 'cute-cartoon').toString();
    const customPrompt = formData.get('prompt') ? formData.get('prompt').toString().trim() : '';

    // 1. Validate Image presence
    if (!imageFile || typeof imageFile === 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No image uploaded. Please upload a clear photo.'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Validate MIME Type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const fileType = imageFile.type ? imageFile.type.toLowerCase() : '';
    if (fileType && !validMimes.includes(fileType)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid file format. Please upload JPG, PNG, or WebP image.'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Validate Max 5 MB File Size
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (imageFile.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File size exceeds 5MB limit. Please upload a smaller photo.'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Style Prompt Selection
    const basePrompt = STYLE_PROMPTS[styleKey] || STYLE_PROMPTS['cute-cartoon'];
    const finalPrompt = customPrompt ? `${basePrompt}, ${customPrompt}` : basePrompt;

    // 5. Verify Workers AI binding env.AI
    if (!env || !env.AI) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cloudflare Workers AI binding env.AI is not configured in this environment.',
          fallbackAllowed: true
        }),
        { status: 503, headers: corsHeaders }
      );
    }

    // 6. Build multipart/form-data for FLUX.2 Klein 4B
    const aiForm = new FormData();
    aiForm.append('prompt', finalPrompt);
    aiForm.append('width', '512');
    aiForm.append('height', '512');
    aiForm.append('input_image_0', imageFile, imageFile.name || 'avatar_source.jpg');

    // Create stream and headers according to Cloudflare Workers AI specification
    const formResponse = new Response(aiForm);
    const formStream = formResponse.body;
    const formContentType = formResponse.headers.get('content-type');

    let result;
    try {
      // Official Cloudflare Workers AI FLUX.2 Klein 4B signature
      result = await env.AI.run('@cf/black-forest-labs/flux-2-klein-4b', {
        body: formStream,
        headers: {
          'Content-Type': formContentType
        }
      });
    } catch (runErr) {
      console.warn('First invocation attempt failed, retrying with raw response wrapper:', runErr);
      const retryResponse = new Response(aiForm);
      result = await env.AI.run('@cf/black-forest-labs/flux-2-klein-4b', {
        multipart: {
          body: retryResponse.body,
          headers: {
            'content-type': retryResponse.headers.get('content-type')
          }
        }
      });
    }

    // 7. Extract binary image from response
    let imageBuffer;
    if (result instanceof ReadableStream) {
      imageBuffer = await new Response(result).arrayBuffer();
    } else if (result instanceof Response) {
      imageBuffer = await result.arrayBuffer();
    } else if (result instanceof ArrayBuffer) {
      imageBuffer = result;
    } else if (result?.buffer instanceof ArrayBuffer) {
      imageBuffer = result.buffer;
    } else if (typeof result === 'string') {
      const dataUri = result.startsWith('data:') ? result : `data:image/jpeg;base64,${result}`;
      return new Response(
        JSON.stringify({
          success: true,
          image: dataUri,
          style: styleKey,
          model: '@cf/black-forest-labs/flux-2-klein-4b'
        }),
        { headers: corsHeaders }
      );
    } else if (result?.image) {
      const dataUri = result.image.startsWith('data:') ? result.image : `data:image/jpeg;base64,${result.image}`;
      return new Response(
        JSON.stringify({
          success: true,
          image: dataUri,
          style: styleKey,
          model: '@cf/black-forest-labs/flux-2-klein-4b'
        }),
        { headers: corsHeaders }
      );
    }

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      throw new Error('No image data returned from Workers AI FLUX.2 Klein 4B model.');
    }

    // 8. Convert ArrayBuffer to Base64 Data URL
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
        success: false,
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
