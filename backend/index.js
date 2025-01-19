import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

  
  // Create a Bedrock Runtime client in the AWS Region you want to use.
  const client = new BedrockRuntimeClient({ region: "ap-south-1" });
  
  // Set the model ID, e.g., Claude 3 Haiku.
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  
  // Start a conversation with the user message.
  const userMessage =
    "what is the use of docker and how to deploy a simple MERN Stack application locally or on server.";
  const conversation = [
    {
      role: "user",
      content: [{ text: userMessage }],
    },
  ];
  
  // Create a command with the model ID, the message, and a basic configuration.
  const command = new ConverseCommand({
    modelId,
    messages: conversation,
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
  });
  
  try {
    // Send the command to the model and wait for the response
    const response = await client.send(command);
  
    // Extract and print the response text.
    const responseText = response.output.message.content[0].text;
    console.log(responseText);
  } catch (err) {
    console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    process.exit(1);
  }
  
  