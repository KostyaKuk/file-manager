import { resolve, basename } from 'path';
import { readdir} from 'fs/promises';
import { stdout } from 'process';
import { PINK, RESET } from '../log/constants/colors.js';
import { writeFile, mkdir as createDir, unlink, rename } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

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

  async createFile(fileName) {
    try {
      const filePath = resolve(this.currentDir, fileName);
      await writeFile(filePath, '');
      return true;
    } catch (error) {
      return false;
    }
  }

  async createDirectory(dirName) {
    try {
      const pathToAdd = resolve(this.currentDir, dirName);
      await createDir(pathToAdd);
      return true;
    } catch (error) {
      return false;
    }
  }

  async renameFile(oldName, newName) {
    try {
      const oldPath = resolve(this.currentDir, oldName);
      const newPath = resolve(this.currentDir, newName);

      await rename(oldPath, newPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async copyFile(sourceFile, targetPath) {
  try {
    const source = resolve(this.currentDir, sourceFile);
    let target = resolve(this.currentDir, targetPath);

    const fileName = basename(sourceFile);
    target = resolve(target, fileName);

    const readStream = createReadStream(source);
    const writeStream = createWriteStream(target);

    await pipeline(readStream, writeStream);
    return true;
  } catch {
    return false;
  }
}

async moveFile(sourceFile, targetPath) {
  try {
    const source = resolve(this.currentDir, sourceFile);
    let target = resolve(this.currentDir, targetPath);

    const fileName = basename(sourceFile);
    target = resolve(target, fileName);

    const readStream = createReadStream(source);
    const writeStream = createWriteStream(target);

    await pipeline(readStream, writeStream);
    return await this.deleteFile(sourceFile);
  } catch {
    return false;
  }
}

  async deleteFile(fileName) {
    try {
      const filePath = resolve(this.currentDir, fileName);
      await unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
