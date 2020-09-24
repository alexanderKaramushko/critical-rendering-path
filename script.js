const list = document.querySelector('.list');

class Reflow {
    constructor(button, target) {
        this.buttons = document.body.querySelectorAll(button);
        this.target = document.body.querySelector(target);
    }

    addFnListeners() {
        for (const button of this.buttons) {
            const fn = button.dataset.fn;
            button.addEventListener('click', this[fn]);
        }
    }

    timeout(ms, fn) {
        return new Promise((resolve) => {
            setTimeout(() => {
                fn && fn();
                resolve();
            }, ms)
        });
    }

    createNode(tagName) {
        const node = document.createElement(tagName);
        return node;
    }

    cacheReflow() {}

    reflowOnce() {}
}

class ReflowUnoptimized extends Reflow {
    constructor(...props) {
        super(...props);
    }

    appendItemsRaf = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            child.style.width = '200px';
        }

        const t2 = performance.now();
        console.log(t2 - t1);
    }

    cacheReflow = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            // Read
            const height = child.clientHeight;

            // Write (invalidates layout)
            child.style.height = (height * 2) + 'px';

            // Read (triggers layout)
            const width = child.clientWidth;

            // Write (invalidates layout)
            child.style.width = (width * 2) + 'px';
        }

        const t2 = performance.now();
        console.log(t2 - t1);
    }

    reflowOnce = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            // Read
            const height = child.clientHeight;

            // ...use height for something else

            // Write (invalidates layout)
            child.style.height = 200 + 'px';

            // Read (triggers layout)
            const width = child.clientWidth;

            // ...use width for something else

            // Write (invalidates layout)
            child.style.width = 200 + 'px';
        }

        const t2 = performance.now();
        console.log(t2 - t1);
    }
}

class ReflowOptimized extends Reflow {
    constructor(...props) {
        super(...props);
    }

    appendItemsFragment = () => {
        const t1 = performance.now();
        const fragment = document.createDocumentFragment();

        fragment.append(this.target.cloneNode(true));

        for (const child of fragment.firstChild.children) {
            child.classList.add('item_large');
        }

        this.target.replaceWith(fragment);

        const t2 = performance.now(); 
        console.log(t2 - t1);
    }

    appendItemsRaf = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            window.requestAnimationFrame(() => {
                child.style.width = '200px';
            });
        }

        const t2 = performance.now(); 
        console.log(t2 - t1);
    }

    cacheReflow = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            // Read
            const height = child.clientHeight;
            const width = child.clientWidth;

            // Write (invalidates layout)
            child.style.height = (height * 2) + 'px';
            child.style.width = (width * 2) + 'px';
        }

        const t2 = performance.now();
        console.log(t2 - t1);
    }

    reflowOnce = () => {
        const t1 = performance.now();

        for (const child of this.target.children) {
            child.classList.add('item_large');
        }

        const t2 = performance.now();
        console.log(t2 - t1);
    }
}

const reflowUnoptimized = new ReflowUnoptimized('.button_unoptimized', '.list');
reflowUnoptimized.addFnListeners();

const reflowOptimized = new ReflowOptimized('.button_optimized', '.list');
reflowOptimized.addFnListeners();

