import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function askOpenRouter(messages, model = "openai/gpt-3.5-turbo"){
    try{
        const res = await axios.post(
            OPENROUTER_API_URL,
            {
                model,
                messages,
            },
            {
                headers: {
                    "Authorization" : `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type" : 'application/json',
                }
            }
        );

        return res.data.choices[0].message.content;
    }catch(error){
        console.error("OpenRouter API error", error.response?.data || error.message);
        throw new Error("AI service unavailable");
    }
}