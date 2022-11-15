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

    public withEventHandler<E extends Event>(event: keyof HTMLElementEventMap, listener: (event: E) => void): ElementBuilder<T> {
        const modified = this.element;
        modified.addEventListener(event, listener as (ev: Event) => void);
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

    public withoutAttr(attr: string): ElementBuilder<T> {
        const modified = this.element;
        modified.removeAttribute(attr);
        return new ElementBuilder(modified);
    }

    public withHtml(html: string): ElementBuilder<T> {
        const modified = this.element;
        modified.innerHTML = html;
        return new ElementBuilder(modified);
    }
}
