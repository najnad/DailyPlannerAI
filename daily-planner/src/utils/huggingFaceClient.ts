import { InferenceClient } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY!
const client = new InferenceClient(HUGGINGFACE_API_KEY);

export async function getSuggestedTasks(latestTask: string) {
  const prompt = `
  You are a helpful productivity coach.
  A user just completed the task: "${latestTask}".
  Suggest exactly 3 concise follow‑up tasks the user could do next.
  Return them as a plain numbered list.
  `

  const chatCompletion = await client.chatCompletion({
    provider: "novita",
    model: "Qwen/Qwen3-Next-80B-A3B-Instruct",
    messages: [
        {
            role: "assistant",
            content: prompt,
        },
    ],
  });

  const text = chatCompletion.choices[0]?.message?.content ?? '';
  
  // Split by newlines and remove empty lines
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  const suggestions = lines.slice(-3)
  
  // Optional: Strip out "1. ", "2. ", etc.
  const cleanSuggestions = suggestions.map(line => line.replace(/^\d+\.\s*/, ''));

  return cleanSuggestions;

  
  // ➜ split into an array, trim bullets/numbers
  // return text
  //   .split('\n')
  //   .map(s => s.replace(/^\d+\.?\s*/, '').trim())
  //   .filter(Boolean)
  //   .slice(0, 3)

}
