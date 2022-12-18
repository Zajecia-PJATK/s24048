import { ReactiveTextarea } from './elements/reactive-textarea/reactive-textarea';

customElements.define('reactive-textarea', ReactiveTextarea);

const input: HTMLTextAreaElement = document.querySelector('textarea#input');

input.addEventListener('input', () => {
    console.log(input.value)
});
