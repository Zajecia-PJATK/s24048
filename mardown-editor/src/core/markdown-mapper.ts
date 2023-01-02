export class MarkdownMapper {
    /** Order of these rules matters! */
    private static readonly rules = new RegExp([
        /** Tables */
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

        /** Links and images */
        /!?(\[(?<text>[^(]+)]\((?<url>[^")]+))("(?<title>[^"]+)"|.*)\)/,

        /** Unordered list */
        /((?<!-.+\n)- (?<unorderedListFirstItem>.+)\n)/,
        /((?<=-.+\n)- (?<unorderedListMiddleItem>.+)\n(?=-))/,
        /(- (?<unorderedListLastItem>.+)\n(?!-))/,

        /** Ordered list */
        /((?<!\d+\..+\n)\d+\. (?<orderedListFirstItem>.+)\n)/,
        /((?<=\d+\..+\n)\d+\. (?<orderedListMiddleItem>.+)\n(?=\d+\.))/,
        /(\d+\. (?<orderedListLastItem>.+)\n(?!\d+\.))/,

        /** Text decorations */
        /(\*\*\*(?<boldAndItalic>[^*]*)\*\*\*)/,
        /(\*\*(?<bold>[^*]*)\*\*)/,
        /(\*(?<italic>[^*]*)\*)/,
        /(~~(?<strikethrough>[^~]*)~~)/,
        /(`{3}\n(?<multilineCode>[^`]+)`{3}\n)/,
        /(`(?<inlineCode>[^`\n]*)`)/,

        /** Headers */
        /(^#{6} (?<h6>.+))/,
        /(^#{5} (?<h5>.+))/,
        /(^#{4} (?<h4>.+))/,
        /(^#{3} (?<h3>.+))/,
        /(^#{2} (?<h2>.+))/,
        /(^# (?<h1>.+))/,

        /** Horizontal line */
        /(?<horizontalLine>^-{3}\n)/,

        /** Quotes */
        /(?<=^\n)> (?<singleLineQuote>.+)\n(?!^>)/,
        /((?<!> .+\n)> (?<quoteFirst>.+))/,
        /(> (?<quoteLast>.+)(?!.*\n> .+))/,
        /(> (?<quoteMiddle>.+))/,

        /** Line breaks */
        /(?<lineBreak>\n{2})/,

    ].map(r => r.source).join('|'), 'gm');

    public static md2html(md: string): string {
        let html = md;

        console.time('md2html');
        for (let i = 0; i < 5; i++) {
            html = html.replace(MarkdownMapper.rules, this.replacer);
        }
        console.timeEnd('md2html');

        return html;
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
        tableBottomLast: s => `\t\t<td>${s}</td>\n\t</tr>\n</table>\n`,
        unorderedListFirstItem: s => `<ul>\n\t<li>${s}</li>\n`,
        unorderedListMiddleItem: s => `\t<li>${s}</li>\n`,
        unorderedListLastItem: s => `\t<li>${s}</li>\n</ul>\n`,
        orderedListFirstItem: s => `<ol>\n\t<li>${s}</li>\n`,
        orderedListMiddleItem: s => `\t<li>${s}</li>\n`,
        orderedListLastItem: s => `\t<li>${s}</li>\n</ol>\n`,
        boldAndItalic: s => `<em><strong>${s}</strong></em>`,
        bold: s => `<strong>${s}</strong>`,
        italic: s => `<em>${s}</em>`,
        strikethrough: s => `<del>${s}</del>`,
        multilineCode: s => `<pre><code>${s}</code></pre>\n`,
        inlineCode: s => `<code>${s}</code>`,
        h6: s => `<h6>${s}</h6>\n`,
        h5: s => `<h5>${s}</h5>\n`,
        h4: s => `<h4>${s}</h4>\n`,
        h3: s => `<h3>${s}</h3>\n`,
        h2: s => `<h2>${s}</h2>\n`,
        h1: s => `<h1>${s}</h1>\n`,
        horizontalLine: _ => `<hr>\n`,
        singleLineQuote: s => `<blockquote>\n\t<p>${s}</p>\n</blockquote>\n`,
        quoteFirst: s => `<blockquote>\n\t<p>${s}`,
        quoteMiddle: s => s,
        quoteLast: s => `${s}</p>\n</blockquote>\n`,
        lineBreak: _ => `<br>\n`,
    };

     private static replacer(match: string, ...args: Record<string, string>[]): string {
        const groups: Record<string, string> = args.at(-1)!; // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#making_a_generic_replacer

        if (groups.text) {
            const titleAttr = !!groups.title
                ? ` title="${groups.title}"`
                : '';

            return match[0] === '!'
                ? `\n<img src="${groups.url}" alt="${groups.text}"${titleAttr}/>\n`
                : `<a href="${groups.url}"${titleAttr}>${groups.text}</a>\n`;
        }

        const [ mapped ] = Object
            .entries(groups)
            .map(([group, value]) => value && MarkdownMapper.mappers[group]?.(value.trim()))
            .filter(x => typeof x === 'string');

        return mapped ?? match; // If we do not have rule for some part we leave it as it is
    }
}
