import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});
  
export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();
   
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      // A precise prompt is important for the AI to reply with the correct tokens
      messages: [
        {
          role: 'user',
          content: `CONTEXT: You are an expert at predicting the dollar worth of resumes and identifying suitable job opportunities.
          -------
          TASK: 
          - You will receive a resume from a user as a test input.
          - Analyze the resume and provide an output in JSON format containing:
             1. An estimated worth in US dollars with a brief explanation, including 4 positive aspects and 4 areas for improvement.
             2. A list of 20 job titles that match the resume's skills and experience.
             3. The location mentioned in the resume.
          - The explanation should distinctly list 4 key factors contributing positively to the assessment and 4 critiques or areas where the resume could be improved.
          -------
          OUTPUT FORMAT (JSON Object): 
          {
            "estimatedWorth": {
              "value": "$low - $high",
              "explanation": {
                "positives": [
                  "...",
                  "...",
                  "...",
                  "..."
                ],
                "critiques": [
                  "...",
                  "...",
                  "...",
                  "..."
                ],
                "explanation": "A humorous and positive outlook explanation highlighting the unique aspects of the resume and the potential value the candidate can bring to the job market. This should be an engaging narrative that playfully navigates through the strengths and areas for improvement, making the assessment enjoyable and informative."
              }
            },
            "jobTitles": [
              "...",
              "...",
              "...",
            ],
            "location": "City, State, Country"
          }
          ${prompt}
          
          Output:`,
        },
      ],
    });
   
    const stream = OpenAIStream(response);
   
    return new StreamingTextResponse(stream);
}
