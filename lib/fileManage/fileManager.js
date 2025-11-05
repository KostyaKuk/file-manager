import { resolve } from 'path';

export class FileManager {
  constructor() {
    this.currentDir = process.cwd();
  }

  getCurrentDirectory() {
    return this.currentDir;
  }

  async goUp() {
    const parentDir = resolve(this.currentDir, '..');

    if (parentDir !== this.currentDir) {
      this.currentDir = parentDir;
      return true;
    }
    return false;
  }

  async changeDirectory(path) {
    try {
      const targetPath = resolve(this.currentDir, path);
      process.chdir(targetPath);
      this.currentDir = targetPath;
      return true;
    } catch (error) {
      return false;
    }
  }
}
