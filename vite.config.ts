import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function devApiChatPlugin(): Plugin {
  return {
    name: 'dev-api-chat',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/chat')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
                const model = (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile').trim();

                if (!apiKey) {
                  res.statusCode = 503;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      error: 'GROQ_API_KEY is not configured in environment variables.',
                      details:
                        'Please configure GROQ_API_KEY in Cloudflare Pages dashboard (Settings -> Environment variables) or in your local .env file.'
                    })
                  );
                  return;
                }

                const { messages, stream = false, temperature = 0.7 } = parsed;

                const groqPayload = {
                  model,
                  messages,
                  temperature,
                  stream: Boolean(stream)
                };

                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(groqPayload)
                });

                if (!groqRes.ok) {
                  const errText = await groqRes.text();
                  res.statusCode = groqRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(errText);
                  return;
                }

                if (stream && groqRes.body) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
                  res.setHeader('Cache-Control', 'no-cache, no-transform');
                  res.setHeader('Connection', 'keep-alive');

                  // @ts-ignore
                  for await (const chunk of groqRes.body) {
                    res.write(chunk);
                  }
                  res.end();
                  return;
                }

                const data = await groqRes.json();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    message: {
                      role: 'assistant',
                      content: data?.choices?.[0]?.message?.content || ''
                    },
                    usage: data?.usage || null,
                    model: data?.model || model
                  })
                );
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiChatPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

