import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { createReadStream } from 'fs';
import { stdout } from 'process';
import { PINK, RESET } from '../log/constants/colors.js';

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

  async listDirectory() {
    try {
      const files = await readdir(this.currentDir, { withFileTypes: true });
      
      return files
        .map((files) => ({
          name: files.name,
          type: files.isDirectory() ? 'directory' : 'file',
        }))
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
    } catch (error) {
      throw new Error('Operation failed');
    }
  }

  async readFile(fileName) {
    const pathToRead = resolve(this.currentDir, fileName);
    const rs = createReadStream(pathToRead);
    
    rs.on('data', (chunk) => {
      stdout.write(PINK + chunk + RESET);
    });
    
    return new Promise((resolve, reject) => {
      rs.on('end', resolve);
      rs.on('error', reject);
    });
  }
}
