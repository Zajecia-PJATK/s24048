import './reactive-textarea.scss';

export class ReactiveTextarea extends HTMLElement {
    private child: HTMLTextAreaElement;

    constructor() {
        super();

        const [textarea] = this.getElementsByTagName('textarea');

        if (!textarea) throw new Error('Pass textarea within label to <reactive-textarea>!')

        this.child = textarea;
        this.child.addEventListener('input', this.resize.bind(this));

        if (!this.hasAttribute('save')) { return; }
        const key = this.getAttribute('save');

        // Restore content initially
        this.child.value = sessionStorage.getItem(key);

        // Mock user input
        queueMicrotask(() => this.child.dispatchEvent(new InputEvent('input')));

        // Save content on each type
        this.child.addEventListener('input', () => sessionStorage.setItem(key, this.child.value));
    }

    private resize() {
        this.child.style.height = '0';
        this.child.style.height = `${this.child.scrollHeight}px`;
    }
}
