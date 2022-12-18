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

    if (isHtml) {
        outputTextArea.value = HtmlMapper.html2md(template.content);
        liveOutput.innerHTML = value;
    } else {
        const lines = value.split('\n');

        const m = (t, c) => {
            const e = document.createElement(t);
            e.textContent = c;
            return e;
        }

        const mm = (t, e) => {
            const p = document.createElement(t);
            p.append(e);
            return p;
        }

        const mappers = {
            '######': content => m('h6', content.substring(7)),
            '#####': content => m('h5', content.substring(6)),
            '####': content => m('h4', content.substring(5)),
            '###': content => m('h3', content.substring(4)),
            '---': () => m('hr', ''),
            '##': content => m('h2', content.substring(3)),
            '#': content => m('h1', content.substring(2)),
            '***': content => mm('em', m('strong', content.substring(3, content.length-3))),
            '**': content => m('strong', content.substring(2, content.length-2)),
            '*': content => m('em', content.substring(1, content.length-1)),
        }

        const output = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [ mapperToken ] = Object.keys(mappers).filter(token => line.startsWith(token))
            const prefixMapped: HTMLElement = mappers[mapperToken]?.(line);

            if (prefixMapped) {
                output.push(prefixMapped?.outerHTML);
                continue;
            }


            const p = m('p', line);
            output.push(p.outerHTML);
        }

        outputTextArea.value = output.join('\n');
        liveOutput.innerHTML = outputTextArea.value;
    }

    outputTextArea.dispatchEvent(new InputEvent('input'));
});
