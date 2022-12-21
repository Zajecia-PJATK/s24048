export const substituteString = (str: string, start: number, stop: number, substitution: string): string =>
    str.substring(0, start) + substitution + str.substring(stop);
