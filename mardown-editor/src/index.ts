import { ReactiveTextarea } from './elements/reactive-textarea/reactive-textarea';
import { HtmlMapper } from './core/html-mapper';

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
        outputTextArea.value = HtmlMapper.html2md(template.content);
        liveOutput.innerHTML = value;
    } else {
        const lines = value.split('\n');

        const makeElement = (tag: string, content: string): HTMLElement => {
            const e = document.createElement(tag);
            e.textContent = content;
            return e;
        }

        const wrapElement = (tag: string, element: Element): HTMLElement => {
            const p = document.createElement(tag);
            p.append(element);
            return p;
        }

        const mappers: Record<string, (content: string) => HTMLElement> = {
            '######': content => makeElement('h6', content.substring(7)),
            '#####': content => makeElement('h5', content.substring(6)),
            '####': content => makeElement('h4', content.substring(5)),
            '###': content => makeElement('h3', content.substring(4)),
            '---': () => makeElement('hr', ''),
            '##': content => makeElement('h2', content.substring(3)),
            '#': content => makeElement('h1', content.substring(2)),
            '***': content => wrapElement('em', makeElement('strong', content.substring(3, content.length-3))),
            '**': content => makeElement('strong', content.substring(2, content.length-2)),
            '*': content => makeElement('em', content.substring(1, content.length-1)),
        }

        const output = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const [ mapperToken ] = Object.keys(mappers).filter(token => line.startsWith(token))
            const prefixMapped: HTMLElement | undefined = mappers[mapperToken]?.(line);

            if (prefixMapped) {
                output.push(prefixMapped?.outerHTML);
                continue;
            }


            const p = makeElement('p', line);
            output.push(p.outerHTML);
        }

        outputTextArea.value = output.join('\n');
        liveOutput.innerHTML = outputTextArea.value;
    }

    outputTextArea.dispatchEvent(new InputEvent('input'));
});
