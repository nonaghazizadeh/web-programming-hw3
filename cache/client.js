import grpc from '@grpc/grpc-js'
const PROTO_PATH = "./lru.proto";
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
dotenv.config()
const options = {
    keepCase: true,
    longs: String,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH,options);
const CacheService = grpc.loadPackageDefinition(packageDefinition).CacheService;

let port = process.env.PORT
const client = new CacheService(`localhost:${port}`, grpc.credentials.createInsecure())
export default client