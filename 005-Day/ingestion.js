import "dotenv/config";
import { PDFParse } from "pdf-parse";
import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
import { Pinecone } from "@pinecone-database/pinecone";

const parser = new PDFParse({
  data: await fs.readFile("./story.pdf"),
});

const text = (await parser.getText()).text;

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

const chunks = await textSplitter.splitText(text);

const embedding = new CohereEmbeddings({
  model: "embed-v5.0-fast",
  apiKey: process.env.COHERE_API_KEY,
});

const vectors = await embedding.embedDocuments(chunks);

const pc = new Pinecone({ apiKey: process.env.PINECON_API_KEY });

const index = pc.Index("vector-1");

await index.documents.upsert({
  documents: vectors.map((vector, index) => {
    return { _id: `chunk-${index}`, embedding: vector, content: chunks[index] };
  }),
});
