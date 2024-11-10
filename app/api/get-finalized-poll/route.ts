// @ts-nocheck

import {getMongoConnection} from "@/lib/mongoUtils";
import {ObjectId} from 'mongodb';


export async function GET(request) {
    const url = new URL(request.url);
    const finalizedId = url.searchParams.get("finalizedId");

    if (!finalizedId) {
        throw new Error("Missing parameter 'finalizedId'");
    }

    try {
        const client = await getMongoConnection();

        const db = client.db("trusto");
        const finalizedPollsCollection = db.collection("finalizedPolls");

        const finalizedPoll = await finalizedPollsCollection.findOne({_id: new ObjectId(finalizedId)}, {
            projection: {
                hash: 0
            }
        });

        return new Response(JSON.stringify(finalizedPoll), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}