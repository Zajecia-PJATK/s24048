export const replaceInRange = (start: number, stop: number, str: string, find: string, replacement: string): string =>
    str.substring(0, start) + str.substring(start, stop).replace(find, replacement) + str.substring(stop);
