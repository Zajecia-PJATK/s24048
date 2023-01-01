import { BoldItalicStrikethroughCodeParser } from './markdown/bold-italic-strikethrough-code-parser';

export class MarkdownMapper {
    private static readonly rules = new RegExp([
        /(^\|(?<tableSeparator>[\s\-|]+)\|\n)/,
        /(^\|\s*(?<tableTopFirst>[^|]+)(?=.*\n\|\s*-))/,
        /((?<!^)\|(?<tableTopMiddle>[^|\n]+)(?=\|.*\|\n\| -))/,
        /(\|(?<tableTopLast>[^|]+)\|\n(?=\|\s*-))/,
        /(^\|\s*(?<tableBottomFirst>[^|]+)(?=.*\n^[^|]))/,
        /((?<!^)\|(?<tableBottomMiddle>[^|\n]+)(?=\|.*\|\n[^|]))/,
        /(\|\s*(?<tableBottomLast>[^|]+)\|\n(?!\|))/,
        /(^\|\s*(?<tableMiddleFirst>[^|]+)(?=\|))/,
        /(\|\s*(?<tableMiddleLast>[^|]+)\|\n)/,
        /(\|\s*(?<tableMiddleMiddle>[^|]+))/,
    ].map(r => r.source).join('|'), 'gm');

    public static md2html(md: string): string {
        console.log(this.rules)

        // return
            // new BoldItalicStrikethroughCodeParser(md)
            // .parseBoldItalicStrikethroughCode()
            // .parseQuotesLists()
            // .parseLinksImages()
            // .parseHeadersHorizontalLine()
            // .replaceAll('\n\n', '<br>');

        return md.replace(MarkdownMapper.rules, this.replacer);
    }

    private static readonly mappers: Record<string, (text: string) => string> = {
        tableSeparator: _ => '',
        tableTopFirst: s => `<table>\n\t<tr>\n\t\t<th>${s}</th>\n`,
        tableTopMiddle: s => `\t\t<th>${s}</th>\n`,
        tableTopLast: s => `\t\t<th>${s}</th>\n\t</tr>\n`,
        tableMiddleFirst: s => `\t<tr>\n\t\t<td>${s}</td>\n`,
        tableMiddleMiddle: s => `\t\t<td>${s}</td>\n`,
        tableMiddleLast: s => `\t\t<td>${s}</td>\n\t</tr>\n`,
        tableBottomFirst: s => `\t<tr>\n\t\t<td>${s}</td>\n`,
        tableBottomMiddle: s => `\t\t<td>${s}</td>\n`,
        tableBottomLast: s => `\t\t<td>${s}</td>\n\t</tr>\n</table>`,
    };

     private static replacer(match: string, ...args: Record<string, string>[]): string {
        const groups: Record<string, string> = args.at(-1)!; // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#making_a_generic_replacer

        const [ mapped ] = Object
            .entries(groups)
            .map(([group, value]) => value && MarkdownMapper.mappers[group]?.(value.trim()))
            .filter(x => typeof x === 'string');

         return mapped ?? match; // If we do not have rule for some part we leave it as it is
    }
}
