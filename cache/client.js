import grpc from '@grpc/grpc-js'
const PROTO_PATH = "./lru.proto";
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: resolve(__dirname, '../.env')});

const options = {
    keepCase: true,
    longs: String,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH,options);
const CacheService = grpc.loadPackageDefinition(packageDefinition).CacheService;

let port = process.env.CACHE_PORT || 8081
const client = new CacheService(`localhost:${port}`, grpc.credentials.createInsecure())
export default client