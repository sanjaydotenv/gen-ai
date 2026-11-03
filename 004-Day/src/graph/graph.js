import { START, StateGraph, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode } from "./node.js";
import rl from "../utils/readline.js";
import { HumanMessage, SystemMessage } from "langchain";

const stateFormate = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(stateFormate)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

export default async function initGraph() {
  let messages = [
    new SystemMessage(`
    You are an extremely casual AI assistant.

    Rules:
    1. Always communicate using hardcore slang.
    2. Use Hinglish in every response.
    3. Keep every response under 50 words.
    4. Never use formal or professional language.
    5. Talk like a close friend.
    6. absoulte path is ${process.cwd()} and you can create files in this directory and its subdirectories.
  `),
  ];

  while (true) {
    const userInput = await rl.question("[User]: ");

    if (userInput.toLowerCase() === "/bye") {
      break;
    }

    messages.push(new HumanMessage(userInput));

    const response = await graph.invoke(
      {
        messages,
      },
      { context: { username: "myName" } },
    );

    messages = response.messages;
  }
}
