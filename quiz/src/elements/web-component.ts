export class WebComponent extends HTMLElement {
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
}
