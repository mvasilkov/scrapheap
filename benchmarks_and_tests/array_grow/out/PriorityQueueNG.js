export class PriorityQueueNG {
    constructor(params) {
        this.values = [];
        this.length = 0;
        this.comparatorFn = params.comparatorFn;
        if (params.initialValues) {
            params.initialValues.forEach(value => this.insert(value));
        }
    }
    insert(value) {
        // if (this.values.length <= this.length) {
        //     this.values.length = Math.max(1, this.values.length * 2);
        // }
        this.values[this.length++] = value;
        this.bubbleUp();
    }
    remove() {
        if (this.length === 0)
            return null;
        const node = this.values[0];
        if (this.length === 1) {
            this.length = 0;
            this.values[0] = null;
            return node;
        }
        this.values[0] = this.values[this.length - 1];
        this.values[this.length - 1] = null;
        this.length--;
        this.bubbleDown();
        return node;
    }
    heapsort() {
        return Array.from({ length: this.length }, () => this.remove());
    }
    parent(nodeIndex) {
        if (nodeIndex === 0)
            return null;
        return (nodeIndex - 1) >>> 1;
    }
    leftChild(nodeIndex) {
        const child = (nodeIndex * 2) + 1;
        if (child >= this.length)
            return null;
        return child;
    }
    rightChild(nodeIndex) {
        const child = (nodeIndex * 2) + 2;
        if (child >= this.length)
            return null;
        return child;
    }
    bubbleUp() {
        let index = this.length - 1;
        while (true) {
            const parent = this.parent(index);
            if (parent !== null && this.comparatorFn(this.values[index], this.values[parent]) < 0) {
                const tmp = this.values[index];
                this.values[index] = this.values[parent];
                this.values[parent] = tmp;
                index = parent;
                continue;
            }
            return;
        }
    }
    bubbleDown() {
        let index = 0;
        while (true) {
            const left = this.leftChild(index);
            const right = this.rightChild(index);
            let swapCandidate = index;
            if (left !== null && this.comparatorFn(this.values[swapCandidate], this.values[left]) > 0) {
                swapCandidate = left;
            }
            if (right !== null && this.comparatorFn(this.values[swapCandidate], this.values[right]) > 0) {
                swapCandidate = right;
            }
            if (swapCandidate !== index) {
                const tmp = this.values[index];
                this.values[index] = this.values[swapCandidate];
                this.values[swapCandidate] = tmp;
                index = swapCandidate;
                continue;
            }
            return;
        }
    }
}
