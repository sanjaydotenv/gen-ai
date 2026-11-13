import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../utils/files.utils.js";
import { AIMessage } from "langchain";
import { upsertFileTool } from "../tools/file.tool.js";

export const LLMNode = async (state) => {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTool = model.bindTools([upsertFileTool]);

  const stream = await modelWithTool.stream(state.messages);

  process.stdout.write("[AI]: ");

  let aiMessage = "";

  for await (const chunk of stream) {
    console.log(chunk);
    process.stdout.write(chunk.text);
    if (!aiMessage) aiMessage = chunk;
    else aiMessage = aiMessage.concat(chunk);
  }

  process.stdout.write("\n");

  return {
    messages: [...state.messages, new AIMessage(aiMessage)],
  };
};

export const ToolNode = async (state) => {
  const messages = state.messages;
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls;

  const toolResults = await Promise.all(
    toolCalls.map(async (toolCall) => {
      return await fileTools[toolCall.name].invoke(toolCall);
    }),
  );

  return {
    messages: [...state.messages, ...toolResults],
  };
};
