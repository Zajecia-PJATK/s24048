import { Attrs } from './attrs';

export abstract class WebComponent extends HTMLElement {
    // TODO: This record might have stricter typing, allow only Attr
    public attributeHandlers: Record<string, (value: string) => void> = {};

    public addChild(child: HTMLElement): WebComponent {
        this.appendChild(child);
        return this;
    }

    public addChildren(children: HTMLElement[]): WebComponent {
        this.append(...children);
        return this;
    }

    public removeChildren(): WebComponent {
        this.innerHTML = '';
        return this;
    }

    public setAttr(attr: Attrs, value: string | number): WebComponent {
        this.setAttribute(attr, `${value}`);
        return this;
    }

    public setAttributeHandler(attr: Attrs, handler: (value: string) => void): WebComponent {
        this.attributeHandlers[attr] = handler;
        return this;
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        this.attributeHandlers[attr]?.(newValue);
    }
}
