// @ts-nocheck
import {MongoClient, ServerApiVersion} from 'mongodb';

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function POST(request) {
    const voteData = await request.json();

    try {
        await client.connect();

        const db = client.db("trusto");
        const votesCollection = db.collection("votes");
        /*await votesCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );*/

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const data = {
            ...voteData,
            expiresAt
        };

        const result = await votesCollection.insertOne(data);
        const voteId = result.insertedId;

        return new Response(JSON.stringify({voteId}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}