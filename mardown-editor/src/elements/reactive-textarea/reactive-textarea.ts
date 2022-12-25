import './reactive-textarea.scss';
import { substituteString } from '../../core/common/substitute-string';

declare global {
    interface Window {
        conversion: HTMLElement;
    }
}

export class ReactiveTextarea extends HTMLElement {
    private static readonly TAB = '\t';
    private child: HTMLTextAreaElement;

    constructor() {
        super();

        const [textarea] = this.getElementsByTagName('textarea');

        if (!textarea) throw new Error('Pass textarea within label to <reactive-textarea>!')

        this.child = textarea;

        this.setupImport();
        this.setupExport();
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

    private setupImport(): void {
        const input: HTMLInputElement | null = this.querySelector('#import');
        if (!input) return;

        input.addEventListener('change', async () => {
            const [file] = input.files!;
            this.child.value = await file.text();
            this.child.dispatchEvent(new InputEvent('input'));
        })
    }

    private setupExport(): void {
        const button: HTMLButtonElement | null = this.querySelector('#export');
        if (!button) return;

        button.addEventListener('click', async () => {
            try {
                const newHandle = await window.showSaveFilePicker({
                    suggestedName: 'Untitled.' + window.conversion.textContent!.split(' ')[2].toLowerCase(),
                    types: [{
                        description: 'Source code',
                        accept: {'text/plain': ['.md', '.html']},
                    }],
                });
                const writableStream = await newHandle.createWritable();

                await writableStream.write(this.child.value);
                await writableStream.close();
            } catch (ignore) {
                // E.g.: DOMException: The user aborted a request
            }
        });
    }

    private setupTab(): void {
        this.child.addEventListener('keydown', event => {
            if (event.key !== 'Tab') { return; }
            event.preventDefault();

            const before = this.child.value;
            const selectionStart = this.child.selectionStart;
            if (event.shiftKey) {
                const textLeftToCursor = before.substring(0, selectionStart);
                const textRightToCursor = before.substring(selectionStart);

                const leftNewlinePosition = textLeftToCursor.indexOf('\n');
                const rightNewlinePosition = textRightToCursor.lastIndexOf('\n');

                const leftConstraint = leftNewlinePosition === -1 ? 0 : leftNewlinePosition;
                const rightConstraint = rightNewlinePosition === -1 ? before.length : rightNewlinePosition;

                const constrainedText = before.substring(leftConstraint, rightConstraint + 1);
                const tabIndex = constrainedText.indexOf('\t');

                if (tabIndex === -1) { return; }

                const tabPosition = tabIndex + leftConstraint;

                this.child.value = substituteString(before, tabPosition, tabPosition + 1, '');
                this.child.selectionStart = selectionStart + (Number(tabPosition >= 0) * (tabPosition >= selectionStart ? 0 : -1));
            } else {
                this.child.value = before.substring(0, selectionStart) + ReactiveTextarea.TAB + before.substring(selectionStart);
                this.child.selectionStart = selectionStart + 1;
            }
            this.child.selectionEnd = this.child.selectionStart;
        });
    }
}
