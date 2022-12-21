import { QuoteParser } from './quote-parser';

export class BoldItalicStrikethroughParser {
    public constructor(private readonly md: string) {}

    public parseBoldItalicStrikethrough(): QuoteParser {
        let regexParsedOutput = this.md.slice();

        const regex = /(\*\*(?<bold>[^*]*)\*\*)|(\*(?<italic>[^*]*)\*)|(~~(?<strikethrough>[^~]*)~~)/gm;
        for (let i = 0; i < 3; i++) {
            let m: RegExpExecArray | null;
            while ((m = regex.exec(regexParsedOutput)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const {bold, italic, strikethrough} = m.groups!;

                const replaceGroup = (htmlTag: string, content: string, prefixLength: number) => {
                    const start = m!.index + prefixLength;
                    const end = start + content.length;
                    regexParsedOutput = regexParsedOutput.substring(0, start - prefixLength) + `<${htmlTag}>` + content + `</${htmlTag}>` + regexParsedOutput.substring(end + prefixLength);
                };

                !!bold && replaceGroup('strong', bold, 2);
                !!italic && replaceGroup('em', italic, 1);
                !!strikethrough && replaceGroup('del', strikethrough, 2);
            }
        }

        return new QuoteParser(regexParsedOutput);
    }
}
