import { EOL, cpus, homedir, userInfo, arch } from 'os';

export class OSService {
  getInfo(parameter) {
    switch (parameter) {
      case '--EOL':
        return JSON.stringify(EOL);
      case '--cpus':
        return this.getCPUInfo();
      case '--homedir':
        return homedir();
      case '--username':
        return userInfo().username;
      case '--architecture':
        return arch();
      default:
        return null;
    }
  }

  getCPUInfo() {
    const cpuInfo = cpus();
    const result = {
      total: cpuInfo.length,
      models: cpuInfo.map((cpu, index) => ({
        core: index + 1,
        model: cpu.model,
        speed: `${(cpu.speed / 1000).toFixed(2)} GHz`
      }))
    };
    return result;
  }
}