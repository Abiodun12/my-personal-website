import axios from 'axios';

class TtsProcessor {
  private apiKey: string;
  private apiBase: string;
  private speaker: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiBase = process.env.RIME_API_BASE || "https://users.rime.ai/v1/rime-tts";
    this.speaker = process.env.RIME_SPEAKER || "orion";
  }

  /**
   * Generates audio from text using Rime's TTS API
   * @param text The text to convert to speech
   * @returns A ReadableStream of the audio data
   */
  public async generateAudio(text: string): Promise<ReadableStream<Uint8Array>> {
    if (!text) {
      throw new Error("No text provided for TTS");
    }

    console.log(`Converting to speech: ${text}`);

    try {
      const headers = {
        "Accept": "audio/mp3",
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const payload = {
        speaker: this.speaker,
        text: text,
        modelId: "arcana",
        audioFormat: "mp3",
        reduceLatency: true,
        samplingRate: 22050,
        repetition_penalty: 1.2,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1200,
      };

      // Make request to Rime API with streaming enabled
      const response = await axios({
        method: 'POST',
        url: this.apiBase,
        headers,
        data: payload,
        responseType: 'stream'
      });

      // Convert Node.js stream to Web API ReadableStream
      const stream = response.data;
      
      return new ReadableStream({
        start(controller) {
          stream.on('data', (chunk: Buffer) => {
            controller.enqueue(new Uint8Array(chunk));
          });
          
          stream.on('end', () => {
            controller.close();
          });
          
          stream.on('error', (err: Error) => {
            console.error('Stream error:', err);
            controller.error(err);
          });
        },
        cancel() {
          // Handle cancellation - close the source stream if possible
          if (typeof stream.destroy === 'function') {
            stream.destroy();
          }
        }
      });
    } catch (error) {
      console.error(`TTS error: ${error}`);
      throw error;
    }
  }

  /**
   * Fallback method to use Deepgram TTS if Rime fails
   */
  public async generateAudioWithDeepgram(text: string, apiKey: string): Promise<ReadableStream<Uint8Array>> {
    if (!text) {
      throw new Error("No text provided for TTS");
    }

    console.log(`Falling back to Deepgram TTS: ${text}`);
    
    try {
      const DEEPGRAM_URL = `https://api.deepgram.com/v1/speak?model=aura-asteria-en`;
      
      const headers = {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
      };
      
      const payload = {
        text: text
      };

      const response = await axios({
        method: 'POST',
        url: DEEPGRAM_URL,
        headers,
        data: payload,
        responseType: 'stream'
      });

      // Convert Node.js stream to Web API ReadableStream
      const stream = response.data;
      
      return new ReadableStream({
        start(controller) {
          stream.on('data', (chunk: Buffer) => {
            controller.enqueue(new Uint8Array(chunk));
          });
          
          stream.on('end', () => {
            controller.close();
          });
          
          stream.on('error', (err: Error) => {
            console.error('Stream error:', err);
            controller.error(err);
          });
        },
        cancel() {
          // Handle cancellation
          if (typeof stream.destroy === 'function') {
            stream.destroy();
          }
        }
      });
    } catch (error) {
      console.error(`Deepgram TTS error: ${error}`);
      throw error;
    }
  }
}

export default TtsProcessor; 