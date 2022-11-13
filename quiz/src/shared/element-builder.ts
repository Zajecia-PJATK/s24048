export class ElementBuilder<T extends HTMLElement> {
    private constructor(private readonly element: T) { }

    public static make<T extends HTMLElement>(tagName: string): ElementBuilder<T> {
        return new ElementBuilder(document.createElement(tagName) as T);
    }

    public build(): T {
        return this.element;
    }

    public withClassName(className: string): ElementBuilder<T> {
        const modified = this.element;
        modified.classList.add(className);
        return new ElementBuilder(modified);
    }

    public withEventHandler(event: keyof HTMLElementEventMap, listener: () => void): ElementBuilder<T> {
        const modified = this.element;
        modified.addEventListener(event, listener);
        return new ElementBuilder(modified);
    }

    public withChild(child: HTMLElement): ElementBuilder<T> {
        const modified = this.element;
        modified.appendChild(child);
        return new ElementBuilder(modified);
    }

    public withChildren(children: HTMLElement[]): ElementBuilder<T> {
        const modified = this.element;
        modified.append(...children);
        return new ElementBuilder(modified);
    }

    public withText(text: string): ElementBuilder<T> {
        const modified = this.element;
        modified.innerText = text;
        return new ElementBuilder(modified);
    }

    public withAttr(attr: string, value: string): ElementBuilder<T> {
        const modified = this.element;
        modified.setAttribute(attr, value);
        return new ElementBuilder(modified);
    }
}
