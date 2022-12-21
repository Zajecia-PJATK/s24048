import { HeadersHorizontalLineParser } from './headers-horizontal-line-parser';

export class QuoteParser {
    public constructor(private readonly md: string) {}

    public parseQuotes(): HeadersHorizontalLineParser {
        const lines = this.md.split('\n');
        const output = [];

        let citing = false;
        for (const line of lines) {
            if (!line.startsWith('> ')) {
                if (citing) {
                    citing = false;
                    output.push('</blockquote>');
                }

                output.push(line);
                continue;
            }

            if (!citing) {
                citing = true;
                output.push('<blockquote>');
            }

            output.push(`<p>${line.substring(2)}</p>`);
        }

        if (citing) {
            output.push('</blockquote>');
        }

        return new HeadersHorizontalLineParser(output.join('\n'));
    }
}
