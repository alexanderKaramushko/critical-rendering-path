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
        const children = this.target.children;
        // Read
        const item1Height = children[0].clientHeight;

        // Write (invalidates layout)
        children[0].style.height = (item1Height * 2) + 'px';

        // Read (triggers layout)
        const item2Height = children[1].clientHeight;

        // Write (invalidates layout)
        children[1].style.height = (item2Height * 2) + 'px';

        // Read (triggers layout)
        const item3Height = children[2].clientHeight;

        // Write (invalidates layout)
        children[2].style.height = (item3Height * 2) + 'px';
    }

    reflowOnce = () => {
        // Read
        const listHeight = this.target.clientWidth;

        // ...use listHeight for something else

        // Write (invalidates layout)
        this.target.style.width = 300 + 'px';

        // Read (triggers layout)
        const listOffsetLeft = this.target.offsetLeft;

        // ...use listOffsetLeft for something else

        // Write (invalidates layout)
        this.target.style.margin = 20 + 'px';
    }
}

class ReflowOptimized extends Reflow {
    constructor(...props) {
        super(...props);
    }

    cacheReflow = () => {
        const children = this.target.children;

        // Read
        const item1 = children[0].clientHeight;
        const item2 = children[1].clientHeight;
        const item3 = children[2].clientHeight;

        // Write (invalidates layout)
        children[0].style.height = (item1 * 2) + 'px';
        children[1].style.height = (item2 * 2) + 'px';
        children[2].style.height = (item3 * 2) + 'px';

        // Document reflows at end of frame
    }

    reflowOnce = () => {
        this.target.classList.add('list_grown');
    }
}

const reflowUnoptimized = new ReflowUnoptimized('.button-unoptimized', '.list');
reflowUnoptimized.addFnListeners();

const reflowOptimized = new ReflowOptimized('.button-optimized', '.list');
reflowOptimized.addFnListeners();

