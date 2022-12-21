import './reactive-textarea.scss';
import { substituteString } from '../../core/common/substitute-string';

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
                this.child.selectionStart = selectionStart + (Number(tabPosition >= 0) * (tabPosition >= selectionStart) ? 0 : -1);
            } else {
                this.child.value = before.substring(0, selectionStart) + ReactiveTextarea.TAB + before.substring(selectionStart);
                this.child.selectionStart = selectionStart + 1;
            }
            this.child.selectionEnd = this.child.selectionStart;
        });
    }
}
