import path from "path";
import { HOME_DIR, CONFIG_DIR } from "../utils/constants.js";
import fs from "fs/promises";
import axios from "axios";

export const getSettingsFile = async () => {
  try {
    await fs.access(CONFIG_DIR);
  } catch (error) {
    fs.mkdir(CONFIG_DIR, { recursive: true });
  }

  const filePath = path.join(CONFIG_DIR, "settings.json");

  try {
    await fs.access(filePath);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify({}));
    return {};
  }
};

export const saveApiKey = async (apiKey) => {
  const settingsFilePath = path.join(CONFIG_DIR, "settings.json");
  const settingsFileContent = await getSettingsFile();

  await fs.writeFile(
    settingsFilePath,
    JSON.stringify({
      ...settingsFileContent,
      apiKey,
    }),
  );
};

export const getApiKey = async () => {
  const settings = await getSettingsFile();
  const apiKey = settings.apiKey || null;

  if (!apiKey) {
    return {
      error: "API Key is not found in settings file",
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
  } catch (error) {
    return {
      error: "Invalid API key",
    };
  }

  return apiKey || null;
};
