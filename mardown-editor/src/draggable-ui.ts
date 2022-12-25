let dragSrcEl;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.innerHTML);
}

function handleDragEnd() {
    this.style.opacity = '1';

    draggable.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter() {
    this.classList.add('over');
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation(); // stops the browser from redirecting.

    if (dragSrcEl !== this) {
        const temp = document.createComment('')
        dragSrcEl.replaceWith(temp);
        this.replaceWith(dragSrcEl);
        temp.replaceWith(this);
    }

    return false;
}

const draggable = document.querySelectorAll('[draggable]');

draggable.forEach(toolbar => {
    toolbar.addEventListener('dragstart', handleDragStart);
    toolbar.addEventListener('dragover', handleDragOver);
    toolbar.addEventListener('dragenter', handleDragEnter);
    toolbar.addEventListener('dragleave', handleDragLeave);
    toolbar.addEventListener('dragend', handleDragEnd);
    toolbar.addEventListener('drop', handleDrop);
});

const toggles = document.querySelectorAll('span.drag');

for (const toggle of toggles) {
    const parent = toggle.parentNode.parentElement;

    toggle.addEventListener('pointerdown', () => {
        parent.setAttribute('draggable', 'true');
    });

    toggle.addEventListener('pointercancel', () => {
        parent.setAttribute('draggable', 'false');
    });
}
