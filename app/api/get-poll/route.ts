// @ts-nocheck
import {MongoClient, ServerApiVersion, ObjectId} from 'mongodb';

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function GET(request) {
    const url = new URL(request.url);
    const pollId = url.searchParams.get("pollId");

    if (!pollId) {
        throw new Error("Missing parameter 'pollId'");
    }

    try {
        await client.connect();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        const votesCollection = db.collection("votes");

        const poll = await pollsCollection.findOne({_id: new ObjectId(pollId)});
        poll.votes = await votesCollection.find({pollId: pollId}, {
            projection: {
                pollId: 0,
                answer: 0,
                expiresAt: 0
            }
        }).toArray();

        return new Response(JSON.stringify(poll), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}