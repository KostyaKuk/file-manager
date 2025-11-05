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

  async handleCommand(input) {
    const [command] = input.trim().split(' ');
    
    if (command === 'up') {
      return await this.goUp();
    } else {
      console.log(`Invalid input: ${command}`);
      return false;
    }
  }
}