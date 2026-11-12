import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = '/tmp/telegram_requests.log';

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(line.trim());
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {
    //
  }
}

async function startServer() {
  const app = express();
  // AI Studio environment constraint: dev server must ALWAYS listen on port 3000
  // (process.env.PORT is 8080 used by the container proxy)
  const PORT = 3000;

  // CORS middleware to support preview and iframe environments
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json());

  // Backend API route for Telegram leads (bypasses browser CORS, ISP throttling, and ad blockers)
  app.post('/api/telegram/send', async (req, res) => {
    log(`POST /api/telegram/send body: ${JSON.stringify(req.body)}`);
    try {
      const { token, chatId, text, parseMode } = req.body;
      const targetToken = (token || process.env.VITE_TELEGRAM_BOT_TOKEN || '9219696978:AAFrxBDTEYCOBZPKAJcvR9__PxGHG3gm-lk').trim();
      const targetChatId = (chatId || process.env.VITE_TELEGRAM_CHAT_ID || '785696987').trim();

      if (!text) {
        log('Error: text is required');
        return res.status(400).json({ ok: false, error: 'Text is required' });
      }

      log(`Sending to Telegram Bot: targetChatId=${targetChatId}`);
      const tgRes = await fetch(`https://api.telegram.org/bot${targetToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: text,
          parse_mode: parseMode || 'HTML',
        }),
      });

      const data = await tgRes.json();
      log(`Telegram API response status=${tgRes.status} ok=${data.ok} description=${data.description || ''}`);
      return res.status(tgRes.status).json(data);
    } catch (err: any) {
      log(`Server Telegram forward error: ${err?.message || err}`);
      return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
    }
  });

  // Diagnostic route
  app.get('/api/telegram/status', (_req, res) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      botConfigured: true,
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    log(`Server listening on port ${PORT}`);
  });
}

startServer();
