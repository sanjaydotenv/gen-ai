import { ChatGroq } from "@langchain/groq";
import { AIMessage } from "langchain";
import { getApiKey } from "../../utils/files.utils.js";
import { upsertFileTool , readFiles, listFiles } from "../tools/file.tool.js";

const fileTools = {
  upsert_file: upsertFileTool,
  read_files: readFiles,
  list_files: listFiles,
};

export const LLMNode = async (state) => {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTool = model.bindTools([upsertFileTool,readFiles,listFiles]);

  const stream = await modelWithTool.stream(state.messages);

  process.stdout.write("[AI]: ");

  let aiMessage;

  for await (const chunk of stream) {
    aiMessage = aiMessage ? aiMessage.concat(chunk) : chunk;

    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }

  process.stdout.write("\n");

  return {
    messages: [...state.messages, aiMessage],
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

