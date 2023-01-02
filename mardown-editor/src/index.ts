import { ReactiveTextarea } from './elements/reactive-textarea/reactive-textarea';
import { HtmlMapper } from './core/html-mapper';
import { MarkdownMapper } from './core/markdown-mapper';

customElements.define('reactive-textarea', ReactiveTextarea);

const inputTextArea = document.querySelector<HTMLTextAreaElement>('textarea#input')!;
const outputTextArea = document.querySelector<HTMLTextAreaElement>('textarea#output')!;
const conversion = document.querySelector<HTMLHeadingElement>('h1#conversion')!;
const liveOutput = document.querySelector('section#live')!;

inputTextArea.addEventListener('input', () => {
    const value = inputTextArea.value;
    const template = document.createElement('template');
    template.innerHTML = value;
    const isHtml = template.content.children.length > 0;
    conversion.textContent = isHtml ? 'HTML 2 MD' : 'MD 2 HTML';

    if (isHtml) {
        outputTextArea.value = HtmlMapper.html2md(value);
        liveOutput.innerHTML = value;
    } else {
        outputTextArea.value = MarkdownMapper.md2html(value);
        liveOutput.innerHTML = outputTextArea.value;
    }

    outputTextArea.dispatchEvent(new InputEvent('input'));
});
