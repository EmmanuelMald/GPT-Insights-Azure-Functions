// Load the variables from the .env file
require('dotenv').config(); // similar to import in python

// Importing the official OpenAI client
// equivalent to from openai import OpenAI in python
// you can also import it using const OpenAI = openaiModule.OpenAI;
const { OpenAI } = require('openai'); 

// Creating an instance of the client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Main function that makes the call to ChatGPT
async function main() {

const data = [
  { date: "2024-01-01", sales: 1200 },
  { date: "2024-01-02", sales: 800 },
  { date: "2024-01-03", sales: 1450 }
];
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [
            {
            role: "system",
            content: "You are a data analyst. The user will provide a dataset in JSON format. Your job is to extract insights, trends, and give recommendations."
            },
            {
            role: "user",
            content: `Here is the data:\n${JSON.stringify(data, null, 2)}`
            },
            {
            role: "user",
            content: "Please summarize trends and suggest improvements."
            }
        ],
    });

    // Print the response to the console
    console.log("\n🧠 ChatGPT responded:\n");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error.message);
  }
}

// Execute the function
main();