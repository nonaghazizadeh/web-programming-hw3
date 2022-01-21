import dotenv from 'dotenv';
dotenv.config()

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class Cache {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.maxSize = process.env.CACHE_MAX_SIZE;;
        this.cache = {};
    }

    setKey(key, value) {
        let newNode

        if (this.cache[key] === undefined) newNode = new Node(key, value);

        if (this.size === 0) {
            this.head = newNode;
            this.tail = newNode;
            this.size++;
            this.cache[key] = newNode;
            return this;
        }

        if (this.size === this.maxSize) {
            delete this.cache[this.tail.key]

            this.tail = this.tail.prev;
            this.tail.next = null;
            this.size--;
        }

        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;
        this.size++;

        this.cache[key] = newNode;
        return this;
    }
    getKey(key) {
        if (!this.cache[key]) {
            return undefined
        }
        let node = this.cache[key];

        if (node === this.head) {
            return node;
        }

        let previous = node.prev;
        let next = node.next;

        if (node === this.tail) {
            previous.next = null;
            this.tail = previous
        } else {
            previous.next = next;
            next.prev = previous;
        }

        this.head.prev = node;
        node.next = this.head;
        node.prev = null;
        this.head = node;

        return node;
    }
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.maxSize = 4;
        this.cache = {};
    }
    all() {
        var all = []
        for (let it = this.head; it !== undefined && it !== null; it = it.next)
            all = [...all, {
                key: it.key,
                value: it.value
            }]
        return all
    }
}

export default Cache