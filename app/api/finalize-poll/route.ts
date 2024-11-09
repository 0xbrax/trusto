// @ts-nocheck
import {MongoClient, ServerApiVersion, ObjectId} from 'mongodb';
import {calculatePercentages} from "@/lib/globals";
import {verifyHashFromSolana} from "@/lib/solanaUtils";

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyPoll = async (poll) => {
    let isVerified: boolean = true;
    const hashData = {
        email: poll.email,
        question: poll.question,
        answers: poll.answers,
        voters: poll.voters,
        timestamp: poll.timestamp,
        expiresAt: poll.expiresAt,
        pollId: poll._id
    };

    isVerified = await verifyHashFromSolana(hashData, data.signature);
    isVerified = await verifyVotes(poll.votes);

    return isVerified;
};
const verifyVotes = async (votes) => {
    let isVerified: boolean = true;
    for (const vote of votes) {
        const hashData = {
            pollId: vote._id,
            email: vote.email,
            answer: vote.answer,
            timestamp: vote.timestamp,
            voteId: vote._id
        };
        isVerified = await verifyHashFromSolana(hashData, vote.signature);
    }
    return isVerified;
};


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
        const resultsCollection = db.collection("results");
        await resultsCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );

        const poll = await pollsCollection.findOne({_id: new ObjectId(pollId)});
        if (!poll) {
            return new Response(JSON.stringify({message: 'Poll is expired'}), {status: 500});
        }

        poll.votes = await votesCollection.find({pollId: pollId}).toArray();

        const isVerified = verifyPoll(poll);
        const answerPercentages = calculatePercentages(poll.answers, poll.votes.map(el => el.answer));

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const timestamp = Date.now();

        const data = {
            pollId: poll.pollId,
            isVerified: isVerified,
            timestamp: timestamp,
            expiresAt: expiresAt
        };

        const result = await resultsCollection.insertOne(data);
        const resultId = result.insertedId;

        await pollsCollection.deleteOne({_id: ObjectId(voteData.pollId)});
        await votesCollection.deleteMany({pollId: voteData.pollId});

        return new Response(JSON.stringify({resultId: resultId}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}