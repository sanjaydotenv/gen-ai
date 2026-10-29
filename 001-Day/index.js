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

while (true) {
  const userInp = await rl.question("Enter your Input: ");

  const response = await model.invoke(userInp);

  console.log(response.content);
}
