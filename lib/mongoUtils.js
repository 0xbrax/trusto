import {MongoClient, ServerApiVersion} from 'mongodb';

const uri = process.env.MONGO_URI;
let cachedClient = null;

export const getMongoConnection = async () => {
    if (!cachedClient) {
        cachedClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        await cachedClient.connect();
    }
    return cachedClient;
};