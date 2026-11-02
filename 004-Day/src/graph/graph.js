import { START, StateGraph, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode } from "./node.js";

const stateFormate = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(stateFormate)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();
