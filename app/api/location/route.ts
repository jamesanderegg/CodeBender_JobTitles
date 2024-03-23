import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log('messages:', messages);
  
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Instructions: 
        - A user will give you a location or opt out of providing a location.
        - Validate the location and supplement it if necessary.
        - Present the full location or the choice to opt out for confirmation.
        - Process the user's confirmation.
        - Thank the user and set a confirmation flag upon completion.
  
        Return Format:
        {
          "step": "Provide instruction based on the step in the process.",
          "userInput": "Original user input for location.",
          "validatedLocation": "Validated and potentially supplemented location information.",
          "userConfirmation": "User's response to the confirmation prompt.",
          "message": "Dynamic message to be communicated to the user.",
          "confirmationFlag": false // Initially set to false, to be updated based on the process completion.
        }`
      },
      ...messages,
    ],
    stream: true,
    temperature: 0.5,
  });
  
  
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}