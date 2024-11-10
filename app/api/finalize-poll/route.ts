// @ts-nocheck

import {getMongoConnection} from "@/lib/mongoUtils";
import {ObjectId} from 'mongodb';
import {calculatePercentages} from "@/lib/globals";
import {verifyHashFromSolana} from "@/lib/solanaUtils";


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
        const client = await getMongoConnection();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        const votesCollection = db.collection("votes");
        const finalizedPollsCollection = db.collection("finalizedPolls");
        /*await finalizedPollsCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );*/

        const poll = await pollsCollection.findOne({_id: new ObjectId(pollId)});
        if (!poll) {
            return new Response(JSON.stringify({message: 'Poll is expired'}), {status: 500});
        }

        poll.votes = await votesCollection.find({pollId: pollId}).toArray();

        if (poll.voters.length !== poll.votes.length) {
            return new Response(JSON.stringify({message: 'Some vote are missing'}), {status: 500});
        }

        const isVerified = verifyPoll(poll);
        const answerPercentages = calculatePercentages(poll.answers, poll.votes.map(el => el.answer));

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const timestamp = Date.now();

        const data = {
            pollId: pollId,
            isVerified: isVerified,
            answerPercentages: answerPercentages,
            timestamp: timestamp,
            expiresAt: expiresAt
        };

        const result = await finalizedPollsCollection.insertOne(data);
        const finalizedPollId = result.insertedId.toString();

        await pollsCollection.deleteOne({_id: new ObjectId(pollId)});
        await votesCollection.deleteMany({pollId: pollId});

        return new Response(JSON.stringify({finalizedPollId: finalizedPollId}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}