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

    cacheReflow() {}

    reflowOnce() {}
}

class ReflowUnoptimized extends Reflow {
    constructor(...props) {
        super(...props);
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

