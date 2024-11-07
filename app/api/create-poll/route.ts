// @ts-nocheck
import {MongoClient, ServerApiVersion} from 'mongodb';
import crypto from 'crypto';

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const generateUniqueId = () => {
    return crypto.randomBytes(8).toString('hex');
};

export async function POST(request) {
    const pollData = await request.json();

    try {
        await client.connect();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        /*await pollsCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );*/

        let uniqueId;
        let isIdUnique = false;
        while (!isIdUnique) {
            uniqueId = generateUniqueId();
            const existingPoll = await pollsCollection.findOne({pollId: uniqueId});
            if (!existingPoll) {
                isIdUnique = true;
            }
        }

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const data = {
            ...pollData,
            pollId: uniqueId,
            expiresAt
        };

        await pollsCollection.insertOne(data);

        return new Response(JSON.stringify({pollId: uniqueId}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}