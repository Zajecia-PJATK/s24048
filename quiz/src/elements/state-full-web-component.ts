import { WebComponent } from './web-component';

export abstract class StateFullWebComponent<T> extends WebComponent {
    protected state?: T ;

    public updateState(changes: Partial<T>): void {
        this.state = Object.assign({}, this.state, changes);
    };

    public withInitialState(state: Partial<T>): StateFullWebComponent<T> {
        this.updateState(state);
        this.render();
        return this;
    }

    protected abstract render(): void;
}
