import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import LogService from './lib/log/index.js';
import { FileManager } from './lib/fileManage/fileManager.js';
import { CommandHandler } from './lib/fileManage/commandHandle.js';

const logService = new LogService();

const startArgs = process.argv.slice(2);
let userName = 'Username';

startArgs.forEach((val) => {
  if (val.startsWith('--username=')) {
    userName = val.split('=')[1];
  }
});

logService.hello(userName);

const fileManager = new FileManager();
const commandHandler = new CommandHandler(fileManager);

logService.pathName(fileManager.getCurrentDirectory());

const rl = readline.createInterface({ input, output });

rl.on('line', async (inputLine) => {
  const command = inputLine.trim();

  if (command === '.exit') {
    rl.close();
    return;
  }

  if (command !== '') {
    await commandHandler.handleCommand(command);
    logService.pathName(fileManager.getCurrentDirectory());
  }
});

rl.on('close', () => {
  logService.close(userName);
});
