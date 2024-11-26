import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' }, 
        { status: 400 }
      );
    }

    const response = await axios.post('http://localhost:5000/api/chat', { message });
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);

    // More detailed error handling
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: 'Failed to send message', 
          details: error.response?.data || error.message 
        }, 
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET handler to prevent CORS issues or provide API info
export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API is running', 
    method: 'POST /api/chat' 
  });
}