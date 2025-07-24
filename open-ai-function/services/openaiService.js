require("dotenv").config(); // to load environment variables from .env file
const {OpenAI} = require("openai"); // Import OpenAI SDK

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); // Initialize OpenAI with API key

async function getChatCompletion(messages){
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Specify the model to use
            messages,
        });
        return response.choices[0].message.content; // Return the content of the first choice
    } catch (error) {
        throw new Error(`OpenAI error: ${error.message}`);
    }
}

module.exports = { getChatCompletion }; // Export the function for use in other modules