type ElementMapper<T extends Element = Element> = (e: T) => string;
export class HtmlMapper {
    private static mappers: Record<string, ElementMapper> = {
        'H1': this.prefixMapper('#'),
        'H2': this.prefixMapper('##'),
        'H3': this.prefixMapper('###'),
        'H4': this.prefixMapper('####'),
        'H5': this.prefixMapper('#####'),
        'H6': this.prefixMapper('######'),
        'P': e => e.textContent ?? '',
        'BR': () => '',
        'STRONG': this.surroundMapper('**'),
        'EM': this.surroundMapper('*'),
        'BLOCKQUOTE': this.multilinePrefixMapper('>'),
        'LI': e => e.textContent ?? '',
        'CODE': this.surroundMapper('`'),
        'HR': () => '---',
        'A': this.linkMapper(),
        'IMG': this.imageMapper(),
        'OL': this.listMapper(),
        'UL': this.listMapper(false),
        'TABLE': this.tableMapper() as ElementMapper
    };

    public static html2md(content: DocumentFragment): string {
        const output = [];
        for (const element of content.children) {
            const mappedValue = this.mapElementToMarkdown(element);

            output.push(mappedValue);
        }

        return output.join('\n');
    }

    private static mapElementToMarkdown(element: Element): string {
        return this.mappers[element.tagName]?.(element) ?? '<unknown-element>';
    }

    private static mapChildrenToMarkdown(element: Element): string {
        return Array.from(element.children).map(child => this.mapElementToMarkdown(child)).join();
    }

    private static prefixMapper(prefix: string): ElementMapper {
        return (e: Element) => this.removeLineBreaks(`${prefix} ${this.getJustOwnedText(e)} ${this.mapChildrenToMarkdown(e)}`);
    }

    private static surroundMapper(token: string): ElementMapper {
        return (e: Element) => `${token}${this.getJustOwnedText(e)}${this.mapChildrenToMarkdown(e)}${token}`;
    }

    private static multilinePrefixMapper(prefix: string): ElementMapper {
        return (e: Element) => this
            .getJustOwnedText(e)
            .split('\n')
            .map((v, i) => `${prefix} ${i === 0 ? this.mapChildrenToMarkdown(e) : ''} ${v.trim()}`)
            .join('\n');
    }

    private static linkMapper(): ElementMapper {
        return (e: Element) => `[${e.textContent}](${e.getAttribute('href')})`;
    }

    private static imageMapper(): ElementMapper {
        return (e: Element) => `![${e.getAttribute('alt')}](${e.getAttribute('src')} "${e.getAttribute('title') ?? ''}")`;
    }

    private static listMapper(ordered = true): ElementMapper {
        return (e: Element) => Array
            .from(e.children)
            .map(e => this.mapElementToMarkdown(e))
            .map((v, i) => ordered ? `${i + 1}. ${v}` : `- ${v}`)
            .join('\n');
    }

    private static tableMapper(): ElementMapper<HTMLTableElement> {
        return table => {
            const columns = table.querySelectorAll('th');
            const rows = table.querySelectorAll('tr:has(td)');

            const columnsTexts = Array.from(columns, c => c.textContent ?? '');

            const columnsMd = '| ' + columnsTexts.join(' | ') + ' |';
            const spacerMd = '|' + Array.from({length: columnsMd.length - 1}).join('-') + '|';

            const columnsWidths = columnsTexts.map(v => v.length);

            const rowsMd = [];
            for (const row of rows) {
                const tds = '| ' + Array.from(row.children, (c, i) => c.textContent!.padEnd(columnsWidths[i], ' ')).join(' | ') + ' |';
                rowsMd.push(tds);
            }

            return [
                columnsMd,
                spacerMd,
                ...rowsMd,
                '\n'
            ].join('\n');
        };
    }

    private static getJustOwnedText(element: Element): string {
        return Array
            .from(element.childNodes)
            .filter(x => x.nodeType === Node.TEXT_NODE)
            .map(x => x.textContent?.trim() ?? '')
            .join();
    }

    private static removeLineBreaks(value: string): string {
        return value.replaceAll('\n', '').trim();
    }
}
