import { ReactiveTextarea } from './elements/reactive-textarea/reactive-textarea';

customElements.define('reactive-textarea', ReactiveTextarea);

const inputTextArea: HTMLTextAreaElement = document.querySelector('textarea#input');
const outputTextArea: HTMLTextAreaElement = document.querySelector('textarea#output');

const getSingleLineTextContent = (element: HTMLElement) => element.textContent.replaceAll('\n', '');

const getJustOwnedText = (element: Element) => Array
        .from(element.childNodes)
        .filter(x => x.nodeType === Node.TEXT_NODE)
        .map(x => x.textContent)
        .join()

const mappers = {
    'H1': e => `# ${getSingleLineTextContent(e)}`,
    'H2': e => `## ${getSingleLineTextContent(e)}`,
    'H3': e => `### ${getSingleLineTextContent(e)}`,
    'H4': e => `#### ${getSingleLineTextContent(e)}`,
    'H5': e => `##### ${getSingleLineTextContent(e)}`,
    'H6': e => `###### ${getSingleLineTextContent(e)}`,
    'P': e => `${e.textContent}`,
    'BR': () => '',
    'STRONG': e => `**${getJustOwnedText(e)}${mapChildrenToMarkdown(e)}**`,
    'EM': e => `*${getJustOwnedText(e)}${mapChildrenToMarkdown(e)}*`,
    'BLOCKQUOTE': e => `> ${e.textContent.trim().replaceAll('\n', '\n> ')}`,
    'OL': e => Array.from(e.children).map((v, i) => `${i + 1}. ${mapElementToMarkdown(v)}`).join('\n'),
    'UL': e => Array.from(e.children).map(v => `- ${mapElementToMarkdown(v)}`).join('\n'),
    'LI': e => e.textContent,
    'CODE': e => `\`${e.textContent}\``,
    'HR': () => '---',
    'A': e => `[${e.textContent}](${e.getAttribute('href')})`,
    'IMG': e => `![${e.getAttribute('alt')}](${e.getAttribute('src')} "${e.getAttribute('title') ?? ''}")`
}

inputTextArea.addEventListener('input', () => {
    const value = inputTextArea.value;
    const template = document.createElement('template');

    template.innerHTML = value;
    const isHtml = template.content.children.length > 0;

    const output = [];
    for (const element of template.content.children) {
        const mappedValue = mapElementToMarkdown(element);

        output.push(mappedValue);
    }

    outputTextArea.value = output.join('\n');
    outputTextArea.dispatchEvent(new InputEvent('input'))

    // console.log(output)
});

function mapElementToMarkdown(element: Element): string {
    return  mappers[element.tagName]?.(element);
}

function mapChildrenToMarkdown(element: Element): string {
    return Array.from(element.children).map(child => mapElementToMarkdown(child)).join();
}
