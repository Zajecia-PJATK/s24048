import { QuoteListParser } from './quote-list-parser';
import { substituteString } from '../common/substitute-string';

export class BoldItalicStrikethroughCodeParser {
    public constructor(private readonly md: string) {}

    public parseBoldItalicStrikethroughCode(): QuoteListParser {
        let regexParsedOutput = this.md.slice();

        const regex = /(\*\*\*(?<boldAndItalic>[^*]*)\*\*\*)|(\*\*(?<bold>[^*]*)\*\*)|(\*(?<italic>[^*]*)\*)|(~~(?<strikethrough>[^~]*)~~)|(`(?<code>[^`]*)`)/gm;
        for (let i = 0; i < 4; i++) {
            let m: RegExpExecArray | null;
            while ((m = regex.exec(regexParsedOutput)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const {bold, italic, strikethrough, code} = m.groups!;

                const replaceGroup = (htmlTag: string, content: string, prefixLength: number) => {
                    const start = m!.index;
                    const end = start + content.length;
                    regexParsedOutput = substituteString(regexParsedOutput, start, end + 2 * prefixLength, `<${htmlTag}>` + content + `</${htmlTag}>`);
                };

                !!bold && replaceGroup('strong', bold, 2);
                !!italic && replaceGroup('em', italic, 1);
                !!strikethrough && replaceGroup('del', strikethrough, 2);
                !!code && replaceGroup('code', code, 1);
            }
        }

        return new QuoteListParser(regexParsedOutput);
    }
}
