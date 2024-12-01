
let debugMode = false;
export const enableDebug = () => debugMode = true;
export const debug = (...params: any[]) => debugMode && console.log(...params);
export const log = (...params: any[]) => console.log(...params);