const {getChatCompletion} = require('../services/openaiService'); // Import the function that was created

module.exports = async function (context, req) {
  try {
    const inputData = req.body?.data;

    if (!inputData || !Array.isArray(inputData)) {
      context.res = {
        status: 400,
        body: "'data' field must be a list of dictionaries in the request body."
      };
      return;
    }

    // Process the list of dictionaries to create a single, well-structured string for the AI
    let dataText = '';
    inputData.forEach(item => {
      // Ensure each item has the required fields
      if (!item.chart_name || !item.chart_description || !item.data) {
        throw new Error("Each dictionary in 'data' must contain 'chart_name', 'chart_description', and 'data' fields.");
      }
      
      dataText += `
Chart Name: ${item.chart_name}
Chart Description: ${item.chart_description}
Data: ${JSON.stringify(item.data, null, 2)}
---
`;
    });

    const systemMessage = {
      role: "system",
      content: `You are an expert business analyst named Insight Bot working on the OBPPC marketing strategy.
            Your only function is to generate concise, data-driven insights based on the structured 
            data provided to you.

            Input Data: You will receive structured data represening one to five charts from a single 
            user interface

            Task: Analyze the provided data and generate a single, general insight. Do not engage in any
            back-and-forth conversation or ask for clarifications.

            Response Format:
              - The response must be in English.
              - The response should not exceed 50 words (approximately 3 lines).
              - Finish each response by explicitly stating the source of the insight (e.g., "Source: Sales vs Region Chart").

            Example Response:
            "The sales performance in the North region has consistently outperformed other regions, 
            indicating a strong market presence. Source: Sales vs Region Chart."
            `
    };
    
    const userMessage = {
      role: "user",
      content: `Here is the data you need to analyze:\n\n${dataText}. Please, provide the most important insight from the data.`
    };

    const reply = await getChatCompletion([systemMessage, userMessage]);

    context.res = {
      status: 200,
      body: {insights: reply}
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error processing request: ${error.message}`
    };
  }
};
