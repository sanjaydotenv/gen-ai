import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../utils/files.utils.js";
import { AIMessage } from "langchain";

export const LLMNode = async (state) => {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const stream = await model.stream(state.messages);

  process.stdout.write("[AI]: ");

  let aiMessage = "";

  for await (const chunk of stream) {
    aiMessage += chunk.text;
    process.stdout.write(chunk.text);
  }

  process.stdout.write("\n")

  return {
    messages: [...state.messages, new AIMessage(aiMessage)],
  };
};
