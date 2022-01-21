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

import {Mutex} from 'async-mutex';
import Cache from './lru.js'

const parse = (arg) => /^-?[0-9]+$/.test(arg) ? Number.parseInt(arg) : arg

const cache = new Cache()
const mutex = new Mutex()

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

let port = process.env.PORT
server.bindAsync(
    `localhost:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at localhost:${port}`);
        server.start();
    }
);