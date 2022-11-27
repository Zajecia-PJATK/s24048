import { WebComponent } from './web-component';

export abstract class StateFullWebComponent extends WebComponent {
    public abstract updateState<T>(changes: Partial<T>): void;
}
