import WebSocket from 'ws';

class DeepgramProcessor {
  private apiKey: string;
  private socket: WebSocket | null = null;
  private onTranscriptCallback: (transcript: string, isFinal: boolean) => void;
  private onUtteranceEndCallback: () => void;
  private onSpeechStartedCallback: () => void;
  private isProcessing: boolean = true;

  constructor(
    apiKey: string,
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onUtteranceEnd: () => void = () => {},
    onSpeechStarted: () => void = () => {}
  ) {
    this.apiKey = apiKey;
    this.onTranscriptCallback = onTranscript;
    this.onUtteranceEndCallback = onUtteranceEnd;
    this.onSpeechStartedCallback = onSpeechStarted;
  }

  public connect(): void {
    // Create a WebSocket connection to Deepgram
    const options = {
      language: 'en-US',
      smart_format: true,
      model: 'nova-2',
      diarize: false,
      interim_results: true,
      endpointing: 500,
      utterance_end_ms: 1500,
      vad_events: true
    };

    const queryParams = new URLSearchParams(options as Record<string, string>).toString();
    const url = `wss://api.deepgram.com/v1/listen?${queryParams}`;

    this.socket = new WebSocket(url, {
      headers: {
        Authorization: `Token ${this.apiKey}`
      }
    });

    this.socket.on('open', () => {
      console.log('Connected to Deepgram WebSocket');
    });

    this.socket.on('message', (data: WebSocket.Data) => {
      if (!this.isProcessing) return;

      try {
        // Parse the incoming data
        const response = JSON.parse(data.toString());

        // Handle speech detection
        if (response.type === 'SpeechStarted') {
          console.log('Speech detected');
          this.onSpeechStartedCallback();
          return;
        }

        // Handle utterance end
        if (response.type === 'UtteranceEnd') {
          console.log('Utterance end detected');
          this.onUtteranceEndCallback();
          return;
        }

        // Handle transcript
        if (response.channel?.alternatives?.[0]?.transcript) {
          const transcript = response.channel.alternatives[0].transcript;
          const isFinal = response.is_final;
          
          if (transcript.trim()) {
            console.log(`Transcript: ${transcript} (${isFinal ? 'final' : 'interim'})`);
            this.onTranscriptCallback(transcript, isFinal);
          }
        }
      } catch (error) {
        console.error('Error processing Deepgram response:', error);
      }
    });

    this.socket.on('error', (error) => {
      console.error('Deepgram WebSocket error:', error);
    });

    this.socket.on('close', (code, reason) => {
      console.log(`Deepgram WebSocket closed: ${code} - ${reason}`);
    });
  }

  public send(audioData: Buffer | ArrayBuffer): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(audioData);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public setProcessing(value: boolean): void {
    this.isProcessing = value;
  }
}

export default DeepgramProcessor; 