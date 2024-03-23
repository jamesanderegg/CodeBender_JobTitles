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
        content: `You are under strict instruction to help us with a list of tasks and nothing else.
The first task will be to collect the user's location. Provide the user back the full location, city, state, and country, and ask them to confirm the location is correct. Use a JSON format for responses:
\`\`\`json
{
  "task": "Location Collection",
  "status": "Completed/Not Completed/Terminated",
  "details": {
    "fullLocation": "[Full address, if available]",
    "city": "[City name]",
    "state": "[State name]",
    "country": "[Country name]",
    "userConfirmation": "Yes/No",
    "reasonForTermination": "[Not in USA/Not Provided], if applicable"
  }
}
\`\`\`
If the user does not want to submit a location, then we will move on to the next task. If the location is not in the USA, then we terminate and start over, letting the user know we can't continue outside the USA.
Next, politely ask the user for a resume or job description, letting them know that you are going to help them come up with job titles. Aim to list 30 job titles or more, providing professional job titles only, without numbering the list or adding any information afterward. Structure the job titles in JSON format as follows:
\`\`\`json
{
  "task": "Job Title Generation",
  "status": "Completed",
  "jobTitles": [
    "Job Title 1",
    "Job Title 2",
    ...
  ]
}
\`\`\`
Ensure to confirm with the user before setting the 'userConfirmation' to yes. Display the JSON only when the user has confirmed or is ready for the next task.`
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