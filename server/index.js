import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import './config/firebaseAdmin.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', system: 'MindForge AI Core', provider: 'Ollama', model: config.ollamaModel, firebase: 'mindforgeos' });
});

// Domain-Specific AI Routes
app.use('/api/ai', aiRoutes);

app.listen(config.port, () => {
  console.log(`[MindForge Backend] Server running on http://localhost:${config.port}`);
  console.log(`[Ollama Target] ${config.ollamaBaseUrl} (Model: ${config.ollamaModel})`);
});
