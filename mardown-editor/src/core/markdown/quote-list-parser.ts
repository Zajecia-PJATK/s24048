import { HeadersHorizontalLineParser } from './headers-horizontal-line-parser';

export class QuoteListParser {
    public constructor(private readonly md: string) {}

    public parseQuotesLists(): HeadersHorizontalLineParser {
        const lines = this.md.split('\n');
        const output = [];

        const tags = {
            'ul': 'li',
            'blockquote': 'p',
            'ol': 'li',
        };

        const openers = {
            '>': 'blockquote',
            '-': 'ul',
            '1': 'ol',
        };

        let opened = '';
        for (const line of lines) {
            if (!(line.startsWith('> ') || line.startsWith('- ') || line.startsWith('1. '))) {
                if (opened) {
                    output.push(`</${opened}>`);
                    opened = '';
                }

                output.push(line);
                continue;
            }

            if (!opened) {
                opened = openers[line[0]];
                output.push(`<${opened}>`);
            }

            output.push(`<${tags[opened]}>${line.substring(2)}</${tags[opened]}>`);
        }

        if (opened) {
            output.push(`</${opened}>`);
        }

        return new HeadersHorizontalLineParser(output.join('\n'));
    }
}
