const {getChatCompletion} = require('../services/openaiService'); // Import the function that was created

module.exports = async function (context, req) {
  try {
    const inputData = req.body?.data;

    if (!inputData){
      context.res = {
        status: 400,
        body: "'data' field is required in the request body."
      };
      return;
    }

    // Convert the input data to a string if it's not already
    const dataText = JSON.stringify(inputData, null, 2);

    const systemMessage = {
      role: "system",
      content: "You are a data analyst. You will be provided with a dataset and you will provide insights about it."
    };
    
    const userMessage = {
      role: "user",
      content: `Here is the dataset you need to analyze:\n\n${dataText}. Please, provide the most important insights about the dataset in one line`
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
