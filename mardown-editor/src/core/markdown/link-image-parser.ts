import { HeadersHorizontalLineParser } from './headers-horizontal-line-parser';
import { substituteString } from '../common/substitute-string';

export class LinkImageParser {
    public constructor(private readonly md: string) { }

    public parseLinksImages(): HeadersHorizontalLineParser {
        const regex = /!?(\[(?<text>[^(]+)]\((?<url>[^")]+))("(?<title>[^"]+)"|.*)\)/gm;
        const lines = this.md.split('\n');
        const output = [];

        for (const line of lines) {
            let regexParsed = line.slice();
            let m;
            while ((m = regex.exec(regexParsed)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const {text, url, title} = m.groups!;
                const [fullMatch] = m;

                const titleAttr = !!title
                    ? ` title="${title}"`
                    : '';

                const substitute = fullMatch[0] === '!'
                    ? `<img src="${url}" alt="${text}"${titleAttr}/>"`
                    : `<a href="${url}"${titleAttr}>${text}</a>`;

                regexParsed = substituteString(regexParsed, m.index, m.index + fullMatch.length, substitute);
            }

            output.push(regexParsed);
        }

        return new HeadersHorizontalLineParser(output.join('\n'));
    }
}
