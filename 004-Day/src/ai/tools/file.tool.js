import { tool } from "langchain";
import * as z from "zod";
import fs from "fs/promises";

export const upsertFileTool = tool(
  async function ({ files }) {
    await Promise.all(
      files.map(async (file) => {
        return await fs.writeFile(file.path, file.content);
      }),
    );

    return "File Created Successfully";
  },
  {
    name: "upsert_file",
    description:
      "create/update multiple file at once (create one if not existed",
    schema: z.object({
      files: z.array(
        z.object({
          path: z
            .string()
            .describe("absoulute path of the file to create/update"),
          content: z.string().describe("content of the file to create/update"),
        }),
      ),
    }),
  },
);
