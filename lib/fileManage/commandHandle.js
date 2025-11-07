import { OSService } from './osService.js';

export class CommandHandler {
  constructor(fileManager) {
    this.fileManager = fileManager;
    this.osService = new OSService();
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

  async listDirectory() {
    try {
      const tableData = await this.fileManager.listDirectory();
      console.table(tableData);
      return true;
    } catch (error) {
      console.log('Operation failed');
      return false;
    }
  }

  async readFile(args) {
    if (!args) {
      console.log('Invalid input');
      return false;
    }
    try {
      await this.fileManager.readFile(args);
      return true;
    } catch (error) {
      console.log('Operation failed');
      return false;
    }
  }

  async createFile(args) {
    if (!args) {
      console.log('Invalid input');
      return false;
    }

    const success = await this.fileManager.createFile(args);
    if (success) {
      console.log(`File '${args}' created successfully`);
    } else {
      console.log('Operation failed');
    }
    return success;
  }

  async createDir(args) {
    if (!args) {
      console.log('Invalid input');
      return false;
    }

    const success = await this.fileManager.createDirectory(args);
    if (success) {
      console.log(`Dir '${args}' created successfully`);
    } else {
      console.log('Operation failed');
    }
    return success;
  }

  async renameFile(args) {
    const [oldName, newName] = args.split(' ');

    if (!oldName || !newName) {
      console.log('Invalid input');
      return false;
    }

    const success = await this.fileManager.renameFile(oldName, newName);
    if (!success) {
      console.log('Operation failed');
    }
    return success;
  }

  async copyFile(args) {
    const [source, target] = args.trim().split(' ').filter(Boolean);

    if (!source || !target) {
      console.log('Invalid input: expected source and target paths');
      return false;
    }

    const success = await this.fileManager.copyFile(source, target);
    if (success) {
      console.log(`File '${source}' copied to '${target}' successfully`);
    } else {
      console.log('Operation failed');
    }
    return success;
  }

  async moveFile(args) {
    const [source, target] = args.trim().split(' ').filter(Boolean);

    if (!source || !target) {
      console.log('Invalid input: expected source and target paths');
      return false;
    }

    const success = await this.fileManager.moveFile(source, target);
    if (success) {
      console.log(`File '${source}' moved to '${target}' successfully`);
    } else {
      console.log('Operation failed');
    }
    return success;
  }

  async deleteFile(args) {
    if (!args.trim()) {
      console.log('Invalid input: expected file path');
      return false;
    }

    const success = await this.fileManager.deleteFile(args.trim());
    if (success) {
      console.log(`File '${args}' deleted successfully`);
    } else {
      console.log('Operation failed');
    }
    return success;
  }

  async getOSInfo(args) {
    const [parameter] = args.trim().split(' ').filter(Boolean);

    if (!parameter) {
      console.log(
        'Invalid input: expected parameter (--EOL, --cpus, --homedir, --username, --architecture)'
      );
      return false;
    }

    const result = this.osService.getInfo(parameter);
    if (result) {
      if (parameter === '--cpus') {
        console.log(`Total CPUs: ${result.total}`);
        console.log('CPU information:');
        result.models.forEach((cpu) => {
          console.log(`  Core ${cpu.core}: ${cpu.model} @ ${cpu.speed}`);
        });
      } else {
        console.log(result);
      }
      return true;
    } else {
      console.log('Invalid parameter');
      return false;
    }
  }

  async calculateHash(args) {
    if (!args) {
      console.log('Invalid input: expected file path');
      return false;
    }

    try {
      const hash = await this.fileManager.calculateFileHash(args);
      console.log(`File hash (SHA-256): ${hash}`);
      return true;
    } catch (error) {
      console.log('Operation failed');
      return false;
    }
  }

  async handleCommand(input) {
    const [command, ...args] = input.trim().split(' ');
    const path = args.join(' ');

    if (command === 'up') {
      return await this.goUp();
    } else if (command === 'cd') {
      return await this.changeDirectory(path);
    } else if (command === 'ls') {
      return await this.listDirectory();
    } else if (command === 'cat') {
      return await this.readFile(path);
    } else if (command === 'add') {
      return await this.createFile(path);
    } else if (command === 'mkdir') {
      return await this.createDir(path);
    } else if (command === 'rn') {
      return await this.renameFile(path);
    } else if (command === 'cp') {
      return await this.copyFile(path);
    } else if (command === 'mv') {
      return await this.moveFile(path);
    } else if (command === 'rm') {
      return await this.deleteFile(path);
    } else if (command === 'os') {
      return await this.getOSInfo(path);
    } else if (command === 'hash') {
      return await this.calculateHash(path);
    } else {
      console.log(`Invalid input: ${command}`);
      return false;
    }
  }
}
