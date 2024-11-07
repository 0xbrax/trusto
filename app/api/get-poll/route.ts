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

export async function GET(request) {
    console.log(request)

    const url = new URL(request.url);
    const pollId = url.searchParams.get("pollId");

    if (!pollId) {
        throw new Error("Missing parameter 'pollId'");
    }

    try {
        await client.connect();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");

        const poll = await pollsCollection.findOne({pollId});

        return new Response(JSON.stringify(poll), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}