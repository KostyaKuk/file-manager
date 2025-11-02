import { BLUECOLOR, GREEN, RESET } from "./constants/colors.js"

export default class LogService {
    pathName(message){
        console.log(`${BLUECOLOR}${message}${RESET}`)
    }
    hello(message){
        console.log(`Welcome to the File Manager,${GREEN}${message}${RESET}!`)
    }
    close(message){
        console.log(`Thank you for using File Manager, ${BLUECOLOR}${message}${RESET}, goodbye!`);
    }
}