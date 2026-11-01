import { CONFIG_DIR } from "./constants.js";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

export async function getSettingsFile() {
  try {
    await fs.access(CONFIG_DIR);
  } catch (error) {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  }

  const settingsFile = path.join(CONFIG_DIR, "settings.js");

  try {
    await fs.access(settingsFile);
    const content = await fs.readFile(settingsFile, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    await fs.writeFile(settingsFile, JSON.stringify({}));
    return {};
  }
}

export async function saveApiKey(apiKey) {
  const settingsFilePath = path.join(CONFIG_DIR, "settings.json");

  const settingsContent = await getSettingsFile();

  await fs.writeFile(
    settingsFilePath,
    JSON.stringify({
      ...settingsContent,
      apiKey,
    }),
  );
}

export async function getApiKey() {
  const settings = await getSettingsFile();
  const apiKey = settings.apiKey || null;

  if (!apiKey) {
    return {
      error: "API key not found in settings file",
    };
  }

  try {
    const response = await axios.get("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return {
      apiKey,
    };
  } catch (err) {
    return {
      error: "Invalid API key",
    };
  }
}
