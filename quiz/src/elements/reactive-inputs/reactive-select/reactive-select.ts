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

export class ReactiveSelect extends StateFullWebComponent<ReactiveSelectState> {
    public static readonly buttonClickedEventType = 'reactive-select-button-clicked';
    public static readonly observedAttributes = [Attrs.type];
    private type = 'normal';

    constructor() {
        super();

        this
            .setAttributeHandler(Attrs.type, v => { this.type = v; this.tryRender() });
    }

    public get value(): ReactiveSelectOption {
        const state = this.state!;
        return state.options.find(option => option.value === state.selected)!;
    }

    private tryRender() {
        !!this.type && this.render();
    }

    protected render() {
        this
            .removeChildren()
            .addChild(ElementBuilder
                .make('select')
                .onlyIf(this.type === 'multiple', e => e.withAttr('multiple', ''))
                .withChildren(this.state?.options
                    .map(option => ElementBuilder
                        .make('option')
                        .withText(option.text)
                        .withAttr('value', option.value)
                        .onlyIf(option.value === this.state!.selected, option => option.withAttr('selected', ''))
                        .build()
                    )
                )
                .withEventHandler('change', event => {
                    const select = event.target as HTMLSelectElement;
                    this.state!.selected = select.value;
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
