import './reactive-input.scss';
import { WebComponent } from '../web-component';
import { Attrs } from '../attrs';
import { ElementBuilder } from '../../shared/element-builder';

export class ReactiveInput extends WebComponent {
    public static readonly stateChangeEventType = 'reactive-input-state-change';
    public static readonly observedAttributes = [Attrs.storage, Attrs.label, Attrs.type];
    private label?: string;
    private type?: string;
    private input?: HTMLInputElement;
    private storagePath?: string;

    constructor() {
        super();

        this
            .setAttributeHandler(Attrs.label, v => (this.label = v) && this.render())
            .setAttributeHandler(Attrs.type, v => (this.type = v) && this.render())
            .setAttributeHandler(Attrs.storage, v => this.storagePath = v);
    }

    private render(): void {
        this.input = ElementBuilder
            .make<HTMLInputElement>('input')
            .withAttr('type', this.type!)
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
    }

    private onInput(_: InputEvent): void {
        const value = this.input!.value;
        localStorage.setItem(this.storagePath!, value);

        this.dispatchEvent(new CustomEvent(ReactiveInput.stateChangeEventType, {
            bubbles: true,
            detail: {
                valid: !(value?.trim() === '') // TODO: Validate data e.g. required and type
            }
        }));
    }
}
