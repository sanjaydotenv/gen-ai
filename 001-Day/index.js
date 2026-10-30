import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

const messages = [];

while (true) {
  const userInp = await rl.question("Enter your Input: ");

  messages.push({
    role: "user",
    content: userInp,
  });

  const stream = await model.stream(messages);

  let assistantMessage = "";
  for await (const chunk of stream) {
    assistantMessage += chunk.content;
    process.stdout.write(chunk.content);
  }

  messages.push({
    role: "assistant",
    content: assistantMessage
  })

  process.stdout.write("\n");
}
