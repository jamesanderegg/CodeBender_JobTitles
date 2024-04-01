import OpenAI from 'openai';

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
  
  // Ask OpenAI for a chat completion given the prompt, waiting for the complete response
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
    temperature: 0.5,
    // Note: The 'stream' parameter is omitted to get the complete response at once
  });

  // Respond with the complete response
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
