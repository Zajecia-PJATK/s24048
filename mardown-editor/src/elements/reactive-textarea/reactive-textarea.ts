import './reactive-textarea.scss';

export class ReactiveTextarea extends HTMLElement {
    private child: HTMLTextAreaElement;

    constructor() {
        super();

        const [textarea] = this.getElementsByTagName('textarea');

        if (!textarea) throw new Error('Pass textarea within label to <reactive-textarea>!')

        this.child = textarea;
        this.child.addEventListener('input', this.resize.bind(this));
    }

    private resize() {
        this.child.style.height = '0';
        this.child.style.height = `${this.child.scrollHeight}px`;
    }
}
