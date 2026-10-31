import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";
config();
import readline from "readline/promises";
import { createAgent, tool } from "langchain";
import * as z from "zod";
import { START, StateGraph, END } from "@langchain/langgraph";

const toolCalling = [];

const sendEmailToll = tool(
  async function ({ from, to, title, description }) {
    console.log("Email send ", { from, to, title, description });

    toolCalling.push({
      to,
      from,
      title,
      description,
    });

    return "Task Completed";
  },
  {
    name: "Send_Email",
    description: "Send a email with title and description",
    schema: z.object({
      from: z.string(),
      to: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  },
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});


async function LLMNode(state){
    console.log("LLMNode state : ", state)

    return {
        messages: [
            ...state.messages,
            {
                role: "assistant",
                content: "hello , user!"
            }
        ]
    }
}

const graph = new StateGraph(
  z.object({
    messages: z.array(z.any()),
  }),
).addNode("LLMNode" , LLMNode)
.addEdge(START , "LLMNode")
.addEdge("LLMNode" , END)
.compile()

const graphResponse = await graph.invoke({
    messages: [
        {
            role: "user",
            content: "hello, graph"
        }
    ]
})

console.log(graphResponse)