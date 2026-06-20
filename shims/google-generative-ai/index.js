class GoogleGenerativeAI {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  getGenerativeModel({ model }) {
    return {
      async generateContent(prompt, config) {
        // In development shim, fail loudly without exposing prompts
        throw new Error('AI service shim in use: service unavailable')
      }
    }
  }

  model(modelName) {
    return this.getGenerativeModel({ model: modelName })
  }
}

module.exports = { GoogleGenerativeAI }
