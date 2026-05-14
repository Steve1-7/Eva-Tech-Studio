class GoogleGenerativeAI {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  getGenerativeModel({ model }) {
    return {
      async generateContent(prompt, config) {
        return {
          response: {
            text: () => `Fallback shim: AI service unavailable. Prompt preview: ${String(prompt).slice(0,200)}`
          }
        }
      }
    }
  }

  model(modelName) {
    return this.getGenerativeModel({ model: modelName })
  }
}

module.exports = { GoogleGenerativeAI }
