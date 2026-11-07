/**
 * Cloudflare Pages Functions - AI Chat Assistant
 * Route: /api/chat
 * Groq API: https://api.groq.com/openai/v1/chat/completions
 * Environment Variables:
 *   - GROQ_API_KEY (Cloudflare Pages Secret)
 *   - GROQ_MODEL (Cloudflare Pages Text variable, e.g. llama-3.3-70b-versatile or llama-3.1-8b-instant)
 */

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_PAYLOAD_SIZE = 120 * 1024; // 120 KB limit to prevent oversized payloads
const MAX_MESSAGES_COUNT = 50;
const MAX_MESSAGE_CONTENT_LENGTH = 16000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const SYSTEM_PROMPT = `You are Vyopic AI, an intelligent, helpful, polite, and versatile AI assistant created for Vyopic (https://vyopic.com) - the premier smart online photo maker and creative productivity platform.

Key Guidelines:
1. Language: You are fully fluent in both Bengali (বাংলা) and English. Respond naturally in whichever language the user addresses you in. If the user speaks in Bengali, reply warmly and fluently in Bengali. If they speak in English, reply in English. You can also handle code, technical queries, translations, and multi-lingual conversations.
2. Expertise: You are an expert in photography, image editing, graphic design, branding, content creation, copywriting, programming, mathematics, general knowledge, and problem solving. You know all of Vyopic's tools (e.g., AI Cartoon Avatar Maker, Name Brand Logo Maker, AI Profile Picture Maker, Photo to Sketch, Background Remover, Image Compressor, Upscaler, PDF converter, etc.) and can guide users on how to use them effectively.
3. Tone: Friendly, professional, concise, and structured. Use Markdown formatting (headings, lists, bold text, code blocks) to make your responses visually clear and pleasant to read.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Content-Type Validation
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid content type. Expected application/json.'
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 2. Read and enforce payload size limit
    const rawBody = await request.text();
    if (rawBody.length > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({
          error: 'Request payload is too large. Max size is 120KB.'
        }),
        { status: 413, headers: CORS_HEADERS }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({
          error: 'Malformed JSON in request body.'
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { messages, stream = false, temperature = 0.7 } = parsedBody;

    // 3. Input Validation: Messages Array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Missing or invalid "messages" parameter. Must be a non-empty array.'
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (messages.length > MAX_MESSAGES_COUNT) {
      return new Response(
        JSON.stringify({
          error: `Too many messages in history. Maximum allowed is ${MAX_MESSAGES_COUNT}.`
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Sanitize and validate each message
    const sanitizedMessages = [];
    const allowedRoles = ['system', 'user', 'assistant'];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg || typeof msg !== 'object') {
        return new Response(
          JSON.stringify({ error: `Message at index ${i} is invalid.` }),
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const role = String(msg.role || '').toLowerCase();
      if (!allowedRoles.includes(role)) {
        return new Response(
          JSON.stringify({
            error: `Invalid role "${msg.role}" at index ${i}. Allowed: system, user, assistant.`
          }),
          { status: 400, headers: CORS_HEADERS }
        );
      }

      let content = typeof msg.content === 'string' ? msg.content : '';
      if (!content.trim() && role === 'user') {
        return new Response(
          JSON.stringify({ error: `User message at index ${i} cannot be empty.` }),
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (content.length > MAX_MESSAGE_CONTENT_LENGTH) {
        content = content.slice(0, MAX_MESSAGE_CONTENT_LENGTH);
      }

      sanitizedMessages.push({ role, content });
    }

    // Ensure System prompt is present at beginning if not already supplied
    const hasSystem = sanitizedMessages.some((m) => m.role === 'system');
    const finalMessages = hasSystem
      ? sanitizedMessages
      : [{ role: 'system', content: SYSTEM_PROMPT }, ...sanitizedMessages];

    // 4. Retrieve Groq API Key and Model from Cloudflare Pages env
    const apiKey = env?.GROQ_API_KEY || (typeof process !== 'undefined' && process.env?.GROQ_API_KEY);
    const model = (env?.GROQ_MODEL || (typeof process !== 'undefined' && process.env?.GROQ_MODEL) || DEFAULT_MODEL).trim();

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'GROQ_API_KEY is not configured in Cloudflare Pages Environment Variables.',
          details: 'Please set GROQ_API_KEY in Cloudflare Pages dashboard -> Settings -> Environment variables.'
        }),
        { status: 503, headers: CORS_HEADERS }
      );
    }

    // 5. Send Request to Groq API
    const groqPayload = {
      model,
      messages: finalMessages,
      temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
      stream: Boolean(stream)
    };

    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqPayload)
    });

    // 6. Handle Groq API Error Statuses
    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = { error: errorText };
      }

      console.error('Groq API Error:', groqResponse.status, errorText);

      return new Response(
        JSON.stringify({
          error: parsedError?.error?.message || 'Error occurred while contacting Groq AI service.',
          status: groqResponse.status,
          type: parsedError?.error?.type || 'groq_api_error'
        }),
        { status: groqResponse.status, headers: CORS_HEADERS }
      );
    }

    // 7. Handle Streaming vs Non-Streaming Response
    if (stream) {
      // Stream directly back using Server-Sent Events (SSE)
      const streamHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      };

      return new Response(groqResponse.body, {
        status: 200,
        headers: streamHeaders
      });
    }

    // Non-streaming JSON response
    const data = await groqResponse.json();
    const assistantMessage = data?.choices?.[0]?.message?.content || '';

    return new Response(
      JSON.stringify({
        success: true,
        message: {
          role: 'assistant',
          content: assistantMessage
        },
        usage: data?.usage || null,
        model: data?.model || model
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Unhandled server error in /api/chat:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An internal error occurred while processing your request.',
        details: String(error)
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
