import './reactive-textarea.scss';

export class ReactiveTextarea extends HTMLElement {
    private static readonly TAB = '\t';
    private child: HTMLTextAreaElement;

    constructor() {
        super();

        const [textarea] = this.getElementsByTagName('textarea');

        if (!textarea) throw new Error('Pass textarea within label to <reactive-textarea>!')

        this.child = textarea;

        this.setupTab();

        if (!this.hasAttribute('save')) { return; }
        const key = this.getAttribute('save')!;

        // Restore content initially
        this.child.value = sessionStorage.getItem(key) ?? '';

        // Mock user input
        queueMicrotask(() => this.child.dispatchEvent(new InputEvent('input')));

        // Save content on each type
        this.child.addEventListener('input', () => sessionStorage.setItem(key, this.child.value));
    }

    private setupTab(): void {
        this.child.addEventListener('keydown', event => {
            if (event.key !== 'Tab') { return; }
            event.preventDefault();

            const before = this.child.value;
            const selectionStart = this.child.selectionStart;
            this.child.value = before.substring(0, selectionStart) + ReactiveTextarea.TAB + before.substring(selectionStart);

            this.child.selectionStart = selectionStart + 1;
            this.child.selectionEnd = this.child.selectionStart;
        });
    }
}
