import { getApiKey, getSettingsFile, saveApiKey } from "./utils/files.utils.js";
import { rl } from "./utils/rl.js";

const main = async () => {
  const settingsFile = await getSettingsFile();

  if (!settingsFile.apiKey) {
    const apiKey = await rl.question("Please Enter Your API Key: ");
    await saveApiKey(apiKey);
  }

  const response = await getApiKey();

  if (response.error) {
    console.log("Invalid OR Expired API Key");
    const apiKey = await rl.question("Please Enter Your API Key: ");
    await saveApiKey(apiKey);
    return main();
  }

  console.log(response)

  rl.close();
};

export default main;
