import os from "os"
import path from "path"

export const HOME_DIR = os.homedir() // C:\Users\acer
export const CONFIG_DIR = path.join(HOME_DIR , ".run-cli") // // C:\Users\acer\.run-cli

