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
            .setAttributeHandler(Attrs.label, v => { this.label = v; this.tryRender() })
            .setAttributeHandler(Attrs.type, v => { this.type = v; this.tryRender() })
            .setAttributeHandler(Attrs.storage, v => { this.storagePath = v; this.tryRender() });
    }

    private tryRender() {
        !!this.label && !!this.storagePath && this.render();
    }

    private render(): void {
        this.input = ElementBuilder
            .make<HTMLInputElement>('input')
            .withAttr('type', this.type!)
            .withAttr('value', localStorage.getItem(this.storagePath!) ?? '')
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

        this.onInput(null!);
    }

    private onInput(_: InputEvent): void {
        const value = this.input!.value;
        localStorage.setItem(this.storagePath!, value);

        this.dispatchEvent(new CustomEvent(ReactiveInput.stateChangeEventType, {
            bubbles: true,
            detail: {
                valid: value.trim() !== '' // TODO: Validate data e.g. required and type
            }
        }));
    }
}
