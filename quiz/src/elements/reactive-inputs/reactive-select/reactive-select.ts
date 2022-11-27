import './reactive-select.scss';
import { Attrs } from '../../attrs';
import { ElementBuilder } from '../../../shared/element-builder';
import { StateFullWebComponent } from '../../state-full-web-component';

export interface ReactiveSelectOption {
    value: string;
    text: string;
}

export interface ReactiveSelectState {
    name: string;
    selected?: string;
    options: ReactiveSelectOption[];
}

export class ReactiveSelect extends StateFullWebComponent {
    public static readonly buttonClickedEventType = 'reactive-select-button-clicked';
    public static readonly observedAttributes = [Attrs.storage, Attrs.type];
    private storagePath?: string;
    private type = 'normal';

    constructor() {
        super();

        this
            .setAttributeHandler(Attrs.storage, v => { this.storagePath = v; this.tryRender() })
            .setAttributeHandler(Attrs.type, v => { this.type = v; this.tryRender() });
    }

    public updateState(changes: Partial<ReactiveSelectState>): void {
        const current = this.state;
        Object.assign(current, changes);
    }

    public get state(): ReactiveSelectState {
        const json = sessionStorage.getItem(this.storagePath!);
        return JSON.parse(json!);
    }

    public get value(): ReactiveSelectOption {
        const state = this.state;
        return state.options.find(option => option.value === state.selected)!;
    }

    public get options(): ReactiveSelectOption[] {
        return this.state.options;
    }

    private tryRender() {
        !!this.storagePath && !!this.type && this.render();
    }

    private render() {
        const currentState = this.state;

        this
            .removeChildren()
            .addChild(ElementBuilder
                .make('select')
                .withChildren(this.options
                    .map(option => ElementBuilder
                        .make('option')
                        .withText(option.text)
                        .withAttr('value', option.value)
                        .onlyIf(option.value === currentState.selected, option => option.withAttr('selected', ''))
                        .build()
                    )
                )
                .withEventHandler('change', event => {
                    const select = event.target as HTMLSelectElement;
                    const modifiedState = this.state;

                    modifiedState.selected = select.value;
                    sessionStorage.setItem(this.storagePath!, JSON.stringify(modifiedState));
                })
                .build()
            );

        if (this.type === 'with-button') {
            this
                .addChild(ElementBuilder
                    .make('button')
                    .withText('Add question')
                    .withEventHandler('click', event => {
                        event.preventDefault();

                        this.dispatchEvent(new CustomEvent(ReactiveSelect.buttonClickedEventType, {
                            bubbles: true,
                            detail: {
                                value: this.value
                            }
                        }));
                    })
                    .build()
                )
        }
    }
}
