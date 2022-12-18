import { ReactiveTextarea } from './elements/reactive-textarea/reactive-textarea';
import { HtmlMapper } from './core/html-mapper';

customElements.define('reactive-textarea', ReactiveTextarea);

const inputTextArea: HTMLTextAreaElement = document.querySelector('textarea#input');
const outputTextArea: HTMLTextAreaElement = document.querySelector('textarea#output');
const conversion: HTMLHeadingElement = document.querySelector('h1#conversion');
const liveOutput: HTMLElement = document.querySelector('section#live');

inputTextArea.addEventListener('input', () => {
    const value = inputTextArea.value;
    const template = document.createElement('template');
    template.innerHTML = value;
    const isHtml = template.content.children.length > 0;
    conversion.textContent = isHtml ? 'HTML 2 MD' : 'MD 2 HTML';

    outputTextArea.value = HtmlMapper.html2md(template.content);
    outputTextArea.dispatchEvent(new InputEvent('input'));

    liveOutput.innerHTML = value;
});
