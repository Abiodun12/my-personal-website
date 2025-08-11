import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import DeepgramProcessor from '../../../lib/voice/deepgramProcessor';
import LLMProcessor from '../../../lib/voice/llmProcessor';
import TtsProcessor from '../../../lib/voice/ttsProcessor';

// This function will be called when the Edge Runtime is invoked
export async function GET(request: NextRequest) {
  // Next.js Edge runtime doesn't support WebSockets directly
  // Return instructions to use the standalone WebSocket server
  return new Response(JSON.stringify({
    error: "WebSocket connections should be made to the standalone WebSocket server",
    wsEndpoint: process.env.WEBSOCKET_SERVER_URL || "ws://localhost:8080"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 