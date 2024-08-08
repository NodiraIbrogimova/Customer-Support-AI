import { NextResponse } from 'next/server'; 
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.API_KEY;
const systemPrompt = "You are a friendly and knowledgeable customer support representative. Respond to the user's questions about software development and gaming software.";

// POST request to the API
export async function POST(req) {
  const data = await req.json(); 
  const userInput = data[0]['content']; 

  // Create a request to the TextCortex API
  const response = await fetch('https://api.textcortex.com/v1/texts/expansions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // authentication
    },
    body: JSON.stringify({ // specifying the req body
      formality: 'default', 
      max_tokens: 2048, 
      model: 'claude-3-haiku', 
      n: 1,
      source_lang: 'en', 
      target_lang: 'en',
      temperature: 1,
      text: `${systemPrompt}\n\n${userInput}`
    }),
  });

  if (!response.ok) {
    // error handling
    console.error('Error:', response.statusText);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }

  const jsonResponse = await response.json(); 
  console.log(jsonResponse)
  const content = jsonResponse.data.outputs[0].text; 

  return NextResponse.json({ content }); 
}
