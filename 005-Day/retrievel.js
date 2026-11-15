import "dotenv/config";
import { CohereEmbeddings, ChatCohere } from "@langchain/cohere";
import { Pinecone } from "@pinecone-database/pinecone";
import { HumanMessage, AIMessage, ToolMessage } from "langchain";

const userInput = "How was the Arav's first job experience ?";

const embedding = new CohereEmbeddings({
  model: "embed-v5.0-fast",
  apiKey: process.env.COHERE_API_KEY,
});

const vector = await embedding.embedQuery(userInput);

const pc = new Pinecone({ apiKey: process.env.PINECON_API_KEY });

const index = pc.Index({
  name: "vector-1",
});

const results = await index.documents.search({
  topK: 5,
  scoreBy: [
    {
      type: "dense_vector",
      fields: ["embedding"],
      values: vector,
    },
  ],
  includeFields: ["content"],
});

const model = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: process.env.COHERE_API_KEY,
});

const messages = [];

messages.push(new HumanMessage(userInput));

messages.push(
  new ToolMessage({
    content: JSON.stringify(results),
  }),
);

const aiResponse = await model.stream(messages);

for await (const chunk of aiResponse) {
  process.stdout.write(chunk.text);
}
