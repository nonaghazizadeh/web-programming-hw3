import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = resolve(__dirname, '../../../cache/lru.proto');
dotenv.config({path: resolve(__dirname, '../.env')});

const options = {
    keepCase: true,
    longs: String,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH,options);
const CacheService = grpc.loadPackageDefinition(packageDefinition).CacheService;

let port = process.env.CACHE_PORT || 8081;
const cache_cli = new CacheService(`localhost:${port}`, grpc.credentials.createInsecure())
export default cache_cli