import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

class LLMProcessor {
  private client: OpenAI;
  private systemPrompt: string;
  private messages: Array<{ role: string, content: string }>;
  private modelName: string;

  constructor(apiKey: string) {
    // Set up OpenAI client with DashScope compatible mode
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    });

    this.modelName = process.env.DASHSCOPE_MODEL_NAME || "qwen-plus";
    
    // Load the system prompt
    try {
      const promptPath = path.join(process.cwd(), 'system_prompt.txt');
      this.systemPrompt = fs.existsSync(promptPath) 
        ? fs.readFileSync(promptPath, 'utf-8').trim() 
        : "You are Remi—AKA 'AB Uncle'—a fun, quick‑witted African‑American uncle who speaks in AAVE. Greet with 'Hi, how you doin', dawg?' then respond in at most 120 characters, always finish your sentence completely, use max 3 short sentences, one joke max, and add a wink 😉 if it fits.";
    } catch (error) {
      console.warn("Could not load system prompt, using default", error);
      this.systemPrompt = "You are Remi—AKA 'AB Uncle'—a fun, quick‑witted African‑American uncle who speaks in AAVE. Greet with 'Hi, how you doin', dawg?' then respond in at most 120 characters, always finish your sentence completely, use max 3 short sentences, one joke max, and add a wink 😉 if it fits.";
    }
    
    // Initialize conversation history
    this.messages = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: "Tell me a joke about pizza." },
      { role: "assistant", content: "Hi, how you doin', dawg? Why'd the pizza apply for a job? Cause it was on a roll! 😉" }
    ];
  }

  public async generateResponse(text: string): Promise<string> {
    console.log(`LLM processing: ${text}`);
    
    // Add user message to history
    this.messages.push({ role: "user", content: text });
    
    try {
      // Call OpenAI-compatible API
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages: this.messages,
        max_tokens: 60  // ~120 characters of output
      });
      
      // Extract the response text
      const responseText = completion.choices[0].message.content;
      
      // Add assistant response to history
      this.messages.push({ role: "assistant", content: responseText });
      
      console.log(`LLM response: ${responseText}`);
      return responseText;
    } catch (error) {
      console.error(`Error from LLM API: ${error}`);
      return "I'm sorry, I encountered an issue connecting to my language model. Please try again later.";
    }
  }
}

export default LLMProcessor; 