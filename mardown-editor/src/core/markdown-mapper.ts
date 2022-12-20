export class MarkdownMapper {
    public static md2html(md: string): string {
        return this.parseHeadersHorizontalLine(this.parseBoldItalicStrikethrough(md));
    }

    private static parseBoldItalicStrikethrough(value: string): string {
        let regexParsedOutput = value.slice();

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

        return regexParsedOutput;
    }

    private static parseHeadersHorizontalLine(value: string): string {
        const lines = value.split('\n');

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

            output.push(`<p>${line}</p>`);
        }

        return output.join('\n');
    }
}
