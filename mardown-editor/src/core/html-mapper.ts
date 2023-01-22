type ChildNodeMapper<T extends Node | Element = ChildNode | Element> = (e: T) => string;
export class HtmlMapper {
    private static mappers: Record<string, ChildNodeMapper> = {
        'H1': this.prefixMapper('#'),
        'H2': this.prefixMapper('##'),
        'H3': this.prefixMapper('###'),
        'H4': this.prefixMapper('####'),
        'H5': this.prefixMapper('#####'),
        'H6': this.prefixMapper('######'),
        'P': e => e.textContent ?? '',
        '#text': e => this.removeLineBreaks(e.textContent ?? ''),
        'BR': () => '',
        'STRONG': this.surroundMapper('**'),
        'DEL': this.surroundMapper('~~'),
        'EM': this.surroundMapper('*'),
        'BLOCKQUOTE': this.multilinePrefixMapper('>'),
        'LI': e => e.textContent ?? '',
        'CODE': this.surroundMapper('`'),
        'PRE': this.multilineCodeMapper() as ChildNodeMapper,
        'HR': () => '---',
        'A': this.linkMapper(),
        'IMG': this.imageMapper() as ChildNodeMapper,
        'OL': this.listMapper() as ChildNodeMapper,
        'UL': this.listMapper(false) as ChildNodeMapper,
        'TABLE': this.tableMapper() as ChildNodeMapper
    };

    public static html2md(content: DocumentFragment): string {
        const output = [];
        for (const element of content.childNodes) {
            const mappedValue = this.mapChildNodeToMarkdown(element);

            output.push(mappedValue);
        }

        return output.join('\n');
    }

    private static mapChildNodeToMarkdown(element: ChildNode): string {
        return this.mappers[element.nodeName]?.(element) ?? element.textContent;
    }

    private static mapChildrenToMarkdown(element: ChildNode): string {
        return Array.from(element.childNodes).map(child => this.mapChildNodeToMarkdown(child)).join();
    }

    private static prefixMapper(prefix: string): ChildNodeMapper {
        return (e: ChildNode) => this.removeLineBreaks(`${prefix} ${this.getJustOwnedText(e)} ${this.mapChildrenToMarkdown(e)}`);
    }

    private static surroundMapper(token: string): ChildNodeMapper {
        return (e: ChildNode) => `${token}${this.getJustOwnedText(e)}${this.mapChildrenToMarkdown(e)}${token}`;
    }

    private static multilinePrefixMapper(prefix: string): ChildNodeMapper {
        return (e: ChildNode) => this
            .getJustOwnedText(e)
            .split('\n')
            .map((v, i) => `${prefix} ${i === 0 ? this.mapChildrenToMarkdown(e) : ''} ${v.trim()}`)
            .join('\n');
    }

    private static linkMapper(): ChildNodeMapper {
        return (e: ChildNode) => `[${e.textContent}](${(<Element> e).getAttribute('href')})`;
    }

    private static imageMapper(): ChildNodeMapper<Element> {
        return (e: Element) => `![${e.getAttribute('alt')}](${e.getAttribute('src')} "${e.getAttribute('title') ?? ''}")`;
    }

    private static listMapper(ordered = true): ChildNodeMapper<Element> {
        return (e: Element) => Array
            .from(e.children)
            .map(e => this.mapChildNodeToMarkdown(e))
            .map((v, i) => ordered ? `${i + 1}. ${v}` : `- ${v}`)
            .join('\n');
    }

    private static tableMapper(): ChildNodeMapper<HTMLTableElement> {
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

    private static getJustOwnedText(element: ChildNode): string {
        return Array
            .from(element.childNodes)
            .filter(x => x.nodeType === Node.TEXT_NODE)
            .map(x => x.textContent?.trim() ?? '')
            .join();
    }

    private static removeLineBreaks(value: string): string {
        return value.replaceAll('\n', '').trim();
    }

    private static multilineCodeMapper() {
        return (e: Element) => `\`\`\`${e.textContent}\`\`\``;
    }
}
