import axios from 'axios'

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-base'
const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY!

export async function queryHuggingFace(prompt: string) {
  const response = await axios.post(
    HUGGINGFACE_API_URL,
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}
