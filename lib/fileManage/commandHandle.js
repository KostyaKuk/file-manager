export class CommandHandler {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  async goUp() {
    const success = await this.fileManager.goUp();
    if (!success) {
      console.log('You are already in root directory');
    }
    return success;
  }

  async changeDirectory(args) {
    if (!args) {
      console.log('Invalid input');
      return false;
    }

    const success = await this.fileManager.changeDirectory(args);
    if (!success) {
      console.log('Operation failed');
    }
    return success;
  }

  async handleCommand(input) {
    const [command, ...args] = input.trim().split(' ');
    const path = args.join(' ');

    if (command === 'up') {
      return await this.goUp();
    } else if (command === 'cd') {
      return await this.changeDirectory(path);
    } else {
      console.log(`Invalid input: ${command}`);
      return false;
    }
  }
}
