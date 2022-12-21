export class HeadersHorizontalLineParser {
    public constructor(private readonly md: string) {}

    public parseHeadersHorizontalLine(): string {
        const lines = this.md.split('\n');

        const makeElement = (tag: string, content: string): HTMLElement => {
            const e = document.createElement(tag);
            e.textContent = content;
            return e;
        };

        const prefixMappers: Record<string, (content: string) => HTMLElement> = {
            '######': content => makeElement('h6', content.substring(7)),
            '#####': content => makeElement('h5', content.substring(6)),
            '####': content => makeElement('h4', content.substring(5)),
            '###': content => makeElement('h3', content.substring(4)),
            '---': () => makeElement('hr', ''),
            '##': content => makeElement('h2', content.substring(3)),
            '#': content => makeElement('h1', content.substring(2)),
        };

        const output = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [mapperToken] = Object.keys(prefixMappers).filter(token => line.startsWith(token))
            const prefixMapped: HTMLElement | undefined = prefixMappers[mapperToken]?.(line);

            if (prefixMapped) {
                output.push(prefixMapped?.outerHTML);
                continue;
            }

            // if (line.startsWith('<')) {
            //     continue;
            // }
            //
            // output.push(`<p>${line}</p>`);

            output.push(line);
        }

        return output.join('\n');
    }
}
