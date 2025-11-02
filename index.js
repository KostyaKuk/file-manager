import { argv } from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import LogService from './lib/log/index.js';


const logService = new LogService();

const startArgs = process.argv.slice(2)
let userName = 'Username' 

argv.forEach((val) => {
  if(val.startsWith('--username=')){
    userName = val.split('=')[1]
  }
});

logService.hello(userName)

const rl = readline.createInterface({ input, output });

rl.on('line', async (input) => {
    const exit = input.trim() === '.exit';
    if (exit) {
        rl.close();
    return;
     }})

rl.on('close', () => {
  logService.close(userName)
});