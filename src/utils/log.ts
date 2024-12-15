/* eslint-disable @typescript-eslint/no-explicit-any */

let debugMode = false;
export const enableDebug = () => debugMode = true;
export const isDebug = () => debugMode;
export const debug = (...params: any[]) => debugMode && console.log(...params);
export const log = (...params: any[]) => console.log(...params);