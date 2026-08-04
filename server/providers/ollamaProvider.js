import { BaseAIProvider } from './baseProvider.js';
import { config } from '../config.js';

export class OllamaProvider extends BaseAIProvider {
  constructor() {
    super();
    this.baseUrl = config.ollamaBaseUrl;
    this.model = config.ollamaModel || 'llama3';
    this.detectedModels = [];
    this.activeModel = null;
  }

  /**
   * Dynamically fetch installed models from user's local Ollama instance (GET /api/tags)
   */
  async fetchInstalledModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      const data = await response.json();
      const models = (data.models || []).map(m => m.name);
      this.detectedModels = models;
      
      if (models.length > 0) {
        // Match configured model or automatically select first installed model on user's machine
        const matched = models.find(m => m.toLowerCase().includes(this.model.toLowerCase()));
        this.activeModel = matched || models[0];
      }
      return models;
    } catch (err) {
      console.warn('[Ollama Local Model Auto-Discovery Warning]:', err.message);
      return [];
    }
  }

  /**
   * Get current active model detected on the system
   */
  async getActiveModel() {
    if (!this.activeModel) {
      await this.fetchInstalledModels();
    }
    return this.activeModel || this.model;
  }

  async generate(systemPrompt, prompt, jsonFormat = true) {
    const targetModel = await this.getActiveModel();
    const url = `${this.baseUrl}/api/generate`;

    const bodyData = {
      model: targetModel,
      system: systemPrompt,
      prompt: prompt,
      stream: false,
      format: jsonFormat ? 'json' : undefined,
      options: {
        temperature: 0.2,
        top_p: 0.9,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP error ${response.status} using model ${targetModel}`);
      }

      const data = await response.json();
      const rawText = data.response || '';

      if (jsonFormat) {
        try {
          // Strip markdown code block fences if present (e.g. ```json ... ```)
          let cleanText = rawText.trim();
          if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
          }
          return JSON.parse(cleanText);
        } catch (e) {
          console.warn('[OllamaProvider JSON Parse Fallback]:', e.message);
          return { text: rawText };
        }
      }

      return { text: rawText };
    } catch (error) {
      console.error(`[OllamaProvider Error - Model "${targetModel}"]:`, error.message);
      throw error;
    }
  }
}
