// @ts-nocheck

import {getMongoConnection} from "@/lib/mongoUtils";
import {ObjectId} from 'mongodb';


export async function GET(request) {
    const url = new URL(request.url);
    const pollId = url.searchParams.get("pollId");

    if (!pollId) {
        throw new Error("Missing parameter 'pollId'");
    }

    try {
        const client = await getMongoConnection();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        const votesCollection = db.collection("votes");

        const poll = await pollsCollection.findOne({_id: new ObjectId(pollId)}, {
            projection: {
                hash: 0
            }
        });
        poll.votes = await votesCollection.find({pollId: pollId}, {
            projection: {
                pollId: 0,
                expiresAt: 0,
                hash: 0
            }
        }).toArray();

        return new Response(JSON.stringify(poll), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}