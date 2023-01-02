export class HtmlMapper {
    /** Order of these rules matters! */
    private static readonly rules = new RegExp([
        /** Text decorations */
        /(<strong>(?<strong>.+)<\/strong>\s*)/,
        /(<em>(?<em>.+)<\/em>\s*)/,
        /(<del>(?<del>.+)<\/del>\s*)/,
        /(<pre><code>(?<multilineCode>.+)<\/code><\/pre>\s*)/,
        /(<code>(?<inlineCode>.+)<\/code>\s*)/,

        /** Headers */
        /(<h6>(?<h6>.+)<\/h6>\s*)/,
        /(<h5>(?<h5>.+)<\/h5>\s*)/,
        /(<h4>(?<h4>.+)<\/h4>\s*)/,
        /(<h3>(?<h3>.+)<\/h3>\s*)/,
        /(<h2>(?<h2>.+)<\/h2>\s*)/,
        /(<h1>(?<h1>.+)<\/h1>\s*)/,

        /** Horizontal line */
        /(?<hr><hr\/?>\s*)/,

        /** Line breaks */
        /(?<br><br\/?>\s*)/,

        /** Images */
        /<img src="(?<imgSrc>[^"]+)" alt="(?<imgAlt>[^"]+)"( title="(?<imgTitle>.+)")?\/>\s*/,

        /** Links */
        /<a\s+href="(?<linkUrl>[^"]+)"(?:\s+title="(?<linkTitle>.+)")?>(?<linkText>.+)<\/a>\s*/,

        /** Quote */
        /<blockquote>\s*<p>(?<quote>.+)<\/p>\s*<\/blockquote>\s*/,

    ].map(r => r.source).join('|'), 'gm');

    public static html2md(html: string): string {
        let md = html;

        console.time('html2md');
        for (let i = 0; i < 5; i++) {
            md = md.replace(HtmlMapper.rules, this.replacer);
        }
        console.timeEnd('html2md');

        return md;
    }

    private static readonly mappers: Record<string, (text: string) => string> = {
        /** Text decorations */
        strong: s => `**${s}**`,
        em: s => `*${s}*`,
        del: s => `~~${s}~~`,
        multilineCode: s => `\`\`\`${s}\`\`\``,
        inlineCode: s => `\`${s}\``,

        /** Headers */
        h1: s => `# ${s}\n`,
        h2: s => `## ${s}\n`,
        h3: s => `### ${s}\n`,
        h4: s => `#### ${s}\n`,
        h5: s => `##### ${s}\n`,
        h6: s => `###### ${s}\n`,

        /** Horizontal line */
        hr: _ => `---\n`,

        /** Line breaks */
        br: _ => `\n\n`,

        /** Quote */
        quote: s => `\n\n> ${s.replaceAll('<br>', '\n> ')}`,
    };

    private static replacer(match: string, ...args: Record<string, string>[]): string {
        const groups: Record<string, string> = args.at(-1)!; // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#making_a_generic_replacer

        if (groups.linkUrl) {
            const {linkText, linkUrl, linkTitle} = groups;
            return `[${linkText}](${linkUrl}`+ (linkTitle ? ` "${linkTitle}"` : '') +`)`;
        } if (groups.imgSrc) {
            const {imgSrc, imgAlt, imgTitle} = groups;
            return `![${imgAlt}](${imgSrc}`+ (imgTitle ? ` "${imgTitle}"` : '') +`)`;
        }

        const [ mapped ] = Object
            .entries(groups)
            .map(([group, value]) => value && HtmlMapper.mappers[group]?.(value.trim()))
            .filter(x => typeof x === 'string');

        return mapped ?? match; // If we do not have rule for some part we leave it as it is
    }
}
