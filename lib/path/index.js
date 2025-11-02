import os from 'os';
import LogService from '../log';

export default class Path {
    #currentPath = os.homedir();
    showLog = new LogService()

    setDirectory(dir) {
        this.#currentPath = dir;
    }

    get currentDirectory() {
        return this.#currentPath;
    }

}