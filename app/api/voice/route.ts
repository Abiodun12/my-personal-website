import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This route will provide information about the voice API setup
export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: "AB's Uncle VoiceMode API",
    status: "online",
    endpoints: {
      websocket: "/api/voice/ws",
      stt: "/api/voice/transcribe",
      tts: "/api/voice/speak"
    },
    instructions: "Connect to the websocket endpoint for real-time audio processing"
  });
} 