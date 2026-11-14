import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "fs/promises";

export const upsertFileTool = tool(
  async function ({ files }) {
    await Promise.all(
      files.map(async (file) => {
        return await fs.writeFile(file.path, file.content);
      }),
    );

    return "Files created successfully";
  },
  {
    name: "upsert_file",
    description: "Create or update multiple files at once.",
    schema: z.object({
      files: z.array(
        z.object({
          path: z.string().describe("Absolute path of the file"),
          content: z.string().describe("Content of the file"),
        }),
      ),
    }),
  },
);

export const listFiles = tool(
  async function ({ folder }) {
    const results = [];

    async function traverse(currentFolder) {
      const entries = await fs.readdir(currentFolder, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = `${currentFolder}/${entry.name}`;

        if (entry.isDirectory()) {
          if (entry.name === "node_modules") continue;

          await traverse(fullPath);
        } else {
          results.push(fullPath);
        }
      }
    }

    await traverse(folder);

    return JSON.stringify(results);
  },
  {
    name: "list_files",
    description:
      "List all folders and files recursively, ignoring node_modules.",
    schema: z.object({
      folder: z.string().describe("Absolute path of the folder to list"),
    }),
  },
);

export const readFiles = tool(
  async function ({ files }) {
    const result = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file.path, "utf-8");

        return {
          path: file.path,
          content,
        };
      }),
    );

    return JSON.stringify(result);
  },
  {
    name: "read_files",
    description: "Read the content of multiple files at once.",
    schema: z.object({
      files: z.array(
        z.object({
          path: z.string().describe("Absolute path of the file to read"),
        }),
      ),
    }),
  },
);
