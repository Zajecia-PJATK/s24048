import './reactive-input.scss';
import { WebComponent } from '../web-component';
import { Attrs } from '../attrs';
import { ElementBuilder } from '../../shared/element-builder';

export class ReactiveInput extends WebComponent {
    public static readonly stateChangeEventType = 'reactive-input-state-change';
    public static readonly observedAttributes = [Attrs.storage, Attrs.label, Attrs.type];
    private label?: string;
    private type?: string;
    private input?: HTMLInputElement | HTMLTextAreaElement;
    private storagePath?: string;

    constructor() {
        super();

        this
            .setAttributeHandler(Attrs.label, v => { this.label = v; this.tryRender() })
            .setAttributeHandler(Attrs.type, v => { this.type = v; this.tryRender() })
            .setAttributeHandler(Attrs.storage, v => { this.storagePath = v; this.tryRender() });
    }

    private tryRender() {
        !!this.label && !!this.storagePath && this.render();
    }

    private render(): void {
        const savedValue = decodeURI(localStorage.getItem(this.storagePath!) ?? '');
        let tmpInput;

        if (this.type === 'textarea') {
            tmpInput = ElementBuilder
                .make<HTMLTextAreaElement>('textarea')
                .withHtml(savedValue)
        } else {
            tmpInput = ElementBuilder
                .make<HTMLInputElement>('input')
                .withAttr('type', this.type!)
                .withAttr('value', savedValue);
        }

        this.input = tmpInput
            .withEventHandler('input', this.onInput.bind(this))
            .build();

        this
            .removeChildren()
            .addChild(ElementBuilder
                .make('label')
                .withText(this.label!)
                .withChild(this.input)
                .build()
            );

        queueMicrotask(() => this.resizeTextArea()); // Render first, then change height
        this.validateCurrentValue(); // Initially we have value from localstorage
    }

    private onInput(_: InputEvent): void {
        const value = this.input!.value;
        localStorage.setItem(this.storagePath!, encodeURI(value));
        this.type === 'textarea' && this.resizeTextArea();
        this.validateCurrentValue();
    }

    private validateCurrentValue(): void {
        this.dispatchEvent(new CustomEvent(ReactiveInput.stateChangeEventType, {
            bubbles: true,
            detail: {
                valid: this.input!.value.trim() !== '' // TODO: Validate data e.g. required and type
            }
        }));
    }

    private resizeTextArea(): void {
        this.input!.style.height = `0px`;
        this.input!.style.height = `${this.input!.scrollHeight}px`;
    }
}
