export class BaseAIProvider {
  /**
   * Abstract method for generating AI responses.
   * @param {string} systemPrompt - Global system prompt
   * @param {string} prompt - User/Task specific prompt with context
   * @param {boolean} jsonFormat - Whether to enforce JSON response
   */
  async generate(systemPrompt, prompt, jsonFormat = false) {
    throw new Error('BaseAIProvider.generate() must be implemented by concrete provider');
  }
}
