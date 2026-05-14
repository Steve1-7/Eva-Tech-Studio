export class GoogleGenerativeAI {
  constructor(apiKey: string)
  getGenerativeModel(opts: { model: string }): { generateContent: (prompt: string, config?: any) => Promise<any> }
  model(modelName: string): { generateContent: (prompt: string, config?: any) => Promise<any> }
}
