import { getApiKey, getSettingsFile, saveApiKey } from "./utils/files.utils.js";
import { rl } from "./utils/rl.js";

const main = async () => {
  const settingsFile = await getSettingsFile();

  if (!settingsFile.apiKey) {
    const apiKey = await rl.question("Please Enter Your API Key: ");
    await saveApiKey(apiKey);
  }

  const apiKey = await getApiKey();

  console.log(apiKey);

  rl.close();
};

export default main;
