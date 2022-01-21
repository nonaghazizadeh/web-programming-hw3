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
## GRPC
### proto file
This is the file where we declare our Protocol Buffer Message and gRPC Service. We declare the syntax to use the proto3 version of the protocol buffer language which is the current latest version.
1. We define our service as below. Then we define rpc methods inside our service defintion
```
service CacheService {
    rpc GetKey(Key) returns (Value) {}
    rpc SetKey(Node) returns (Cache) {}
    rpc Clear(Empty) returns (Empty) {}
}
```

2. We define the structure for the data we want to serialize in a proto file. In the other words our proto file contains protocol buffer message type definitions for all the request and response types used in our service methods. In the code below Repeated means that the field is a type of list. We also create an Empty Message for empty request or empty response for a method.
```
message Empty {}

message Key {
    string key = 1;
}

message Value {
    string value = 1;
}

message Node {
    string key = 1;
    string value = 2;
}

message Cache {
    repeated Node cache = 1;
}
```
### grpc.js file(server)
In server side we should be sure about ThreadSafety so we use async-mutex. For more details about async-mutex you can visit [this page](https://www.npmjs.com/package/async-mutex) we get through our implementation for GRPC server side

1. We import the grpc module, then we use the grpc load method passing the path of our lru.proto so it can be loaded by the grpc module. Then we instantiate grpc Server object.
```
import grpc from '@grpc/grpc-js';
const PROTO_PATH = "./lru.proto";
import protoLoader from '@grpc/proto-loader';
const options = {
    keepCase: true,
    longs: String,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const cacheProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();
```
2. We import aysnc-mutex and our LRU.js and get an instance .
```
import {Mutex} from 'async-mutex';
import Cache from './lru.js'

const cache = new Cache()
const mutex = new Mutex()
```
3. We invoke the server addService method passing the CacheService service from the lru proto object, the second parameter accepts an object. It has 2 parameters, call and callback. The call is the request from the Client while the callback is a function we will invoke to return the response to the Client.
    1. We add getKey method function handler inside our file as shown in the code below. First we get the key from the client, then with parse function that we implemented for converting, Then we get the value of given key with the function implemented in Cache in lru.js file. If the value is undefiend we notify pur client by returning error. If the key exists we return the value
    ```
    getKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)
                const value = parse(cache.getKey(key))
                if (value === undefined) {
                    callback({
                        code: 404,
                        message: "key not found",
                        status: grpc.status.INVALID_ARGUMENT
                    })
                } else
                    callback(null, {
                        value: value.value
                    })
                release()
            })
    },
    ```
    2. We add setKey method function handler inside our file as shown in the code below. First we set key with the function implemented in Cache in lru.js file. Then we return our cache to the client
    ```
    setKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)
                const value = parse(_.request.value)
                cache.setKey(key, value)
                callback(null, {
                    cache: cache.all()
                })
                release()
            })
    },
    ```
    3. We add clear method function handler inside our file as shown in the code below. First we clear all keys and values with the function implemented in Cache in lru.js file. Then we return an empty object to client.
    ```
    clear: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                cache.clear()
                callback(null, {})
                release()
            })
    }
    ```
The final server addService methods is shown below
```
server.addService(cacheProto.CacheService.service, {
    getKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)
                const value = parse(cache.getKey(key))
                if (value === undefined) {
                    callback({
                        code: 404,
                        message: "key not found",
                        status: grpc.status.INVALID_ARGUMENT
                    })
                } else
                    callback(null, {
                        value: value.value
                    })
                release()
            })
    },
    setKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)
                const value = parse(_.request.value)
                cache.setKey(key, value)
                callback(null, {
                    cache: cache.all()
                })
                release()
            })
    },
    clear: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                cache.clear()
                callback(null, {})
                release()
            })
    }
})
```
4. After we instantiate grpc Server object, we bind it to our localhost with the port of 8080, and passing Server Credential insecure object for our current development testing. Finally we invoke the start method of the server to start our gRPC server.
```
let port = process.env.PORT
server.bindAsync(
    `localhost:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at localhost:${port}`);
        server.start();
    }
);
```











