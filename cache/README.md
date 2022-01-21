# LRU cache and grpc
In this part we are going to implement LRU cache and connect to backend with GRPC
## LRU cache
For more infomartion that how does LRU cache works you can visit [this page](https://www.interviewcake.com/concept/java/lru-cache) but we are going to say some basic concepts
1. Insert an element in the LRU Cache should be done with time complexity of O(1). In other words, constant time.
2. Get an element from the LRU Cache should be done with time complexity of O(1).
3. When we retrieve an element from the LRU Cache, it should become the most recently used item in the list.
4. We use doubly linked list for implementation
    1. Insert an element at the head of the doubly linked list.
    2. On every read or insert to the cache, the element that is read or inserted is moved to the head of the linked list.
    3. If the cache limit is exceeded while inserting, remove the element at the tail of the linked list.
    4. Store the key and value of the relation in an object.

Let's now get through code implementation
### Node class
Node class stores the element in the Linked List.
```
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}
```
### LRU Cache class
We have the head and tail elements. Then, we have the size attribute to store the current size of the cache. Then, the maxSize property to store the maximum size of the cache. Finally, we have the cache object. We initialize it to an empty object in the constructor.
```
class Cache {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.maxSize = process.env.CACHE_MAX_SIZE;;
        this.cache = {};
    }
}
```

### setKey funciton
We check whether the item with the given key is already present. If not, we insert it into the list and the cache object. Then, if it is the first element in the cache, we make it the head and tail of the list. Otherwise, we make the new node as the head of the list. Finnaly, if we reach the maximum size of the list, we remove the item at the tail of the list.
```
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
```
### getKey function
We use the cache object to find the element with the given key. Now, we make the element that was accessed as the first element in the list (most recently item). If it is already the first element, we return it. If it's not the first element, then we have to remove the element from the list and replace it as the new head. While removing, we have to connect the element’s previous node with the element’s next node.
```
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
```
### clear function
We remove all the elements from cache and make all variable as same as constructor.
```
clear() {
      this.head = null;
      this.tail = null;
      this.size = 0;
      this.maxSize = 4;
      this.cache = {};
}
```
### all function
We retun all elements in Cache.
```
all() {
        var all = []
        for (let it = this.head; it !== undefined && it !== null; it = it.next)
            all = [...all, {
                key: it.key,
                value: it.value
            }]
        return all
}
```
