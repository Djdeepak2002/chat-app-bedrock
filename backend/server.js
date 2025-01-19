import express from "express";
import bodyParser from "body-parser";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

// Enable CORS for requests from the frontend
app.use(cors());

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Create a Bedrock Runtime client
const client = new BedrockRuntimeClient({ region:process.env.AWS_REGION });

// Model ID
// const modelId = process.env ;
const modelId = process.env.BEDROCK_MODEL_ID;

// POST endpoint for Bedrock conversation
app.post("/conversation", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);  
  console.log("Received prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required in the request body." });
  }

  // Construct conversation object
  const conversation = [
    {
      role: "user",
      content: [{ text: prompt }],
    },
  ];

  // Command configuration
  const command = new ConverseCommand({
    modelId,
    messages: conversation,
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
  });

  try {
    // Send the command and get the response
    const response = await client.send(command);

    // Extract the response text
    const responseText = response.output.message.content[0].text;

    // Send response back to the client
    res.json({ response: responseText });
  } catch (err) {
    console.error("Error invoking Bedrock model:", err);
    res.status(500).json({ error: "Failed to get response from Bedrock model.", details: err.message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
