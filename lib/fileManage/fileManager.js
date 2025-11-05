import { dirname } from 'path';
import os from 'os';

export class FileManager {
    constructor() {
        this.currentDir = os.homedir();
    }

    getCurrentDirectory() {
        return this.currentDir;
    }
    
    async goUp() { 
        const parentDir = dirname(this.currentDir);
        
        if (parentDir !== this.currentDir) {
            this.currentDir = parentDir;
            return true;
        }
        return false;
    }
}