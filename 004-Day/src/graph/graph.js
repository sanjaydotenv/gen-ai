import { START, StateGraph, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode } from "./node.js";
import { rl } from "../utils/rl.js";
import { HumanMessage } from "langchain";

const stateFormate = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(stateFormate)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

export const initGraph = async () => {
  while (true) {
    const userInput = await rl.question("[USER]: ");

    const response = await graph.invoke({
      messages: [new HumanMessage(userInput)],
    });


    console.log("[AI]: ", response)
  }
};
