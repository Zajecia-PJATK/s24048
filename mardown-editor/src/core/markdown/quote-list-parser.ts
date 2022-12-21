import { LinkImageParser } from './link-image-parser';

export class QuoteListParser {
    public constructor(private readonly md: string) {}

    public parseQuotesLists(): LinkImageParser {
        const lines = this.md.split('\n');
        const output = [];

        const tags: Record<string, string> = {
            'ul': 'li',
            'blockquote': 'p',
            'ol': 'li',
        };

        const openers: Record<string, string> = {
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

        return new LinkImageParser(output.join('\n'));
    }
}
