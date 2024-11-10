// @ts-nocheck

import {getMongoConnection} from "@/lib/mongoUtils";
import {ObjectId} from 'mongodb';

import {calculateHash, recordHashToSolana} from "@/lib/solanaUtils";
import {
    Keypair,
} from "@solana/web3.js";


export async function POST(request) {
    const voteData = await request.json();

    try {
        const client = await getMongoConnection();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        const votesCollection = db.collection("votes");
        /*await votesCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );*/

        const poll = await pollsCollection.findOne({_id: new ObjectId(voteData.pollId)});
        if (!poll) {
            return new Response(JSON.stringify({message: 'Poll is expired'}), {status: 500});
        }

        if (!poll.voters.includes(voteData.email)) {
            return new Response(JSON.stringify({message: 'Email not allowed'}), {status: 500});
        }

        const vote = await votesCollection.findOne({pollId: voteData.pollId, email: voteData.email});
        if (vote) {
            return new Response(JSON.stringify({message: 'You already voted this poll'}), {status: 500});
        }

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const timestamp = Date.now();

        const data = {
            ...voteData,
            timestamp: timestamp,
            expiresAt: expiresAt // used for auto-remove in Mongo only, we are going to delete it
        };

        const result = await votesCollection.insertOne(data);
        const voteId = result.insertedId.toString();
        delete data.expiresAt;

        const hashData = {
            pollId: vote._id,
            email: vote.email,
            answer: vote.answer,
            timestamp: vote.timestamp,
            voteId: voteId,
        };

        const walletPrivateKey = process.env.SOLANA_WALLET_PRIVATE_KEY.split(',').map(Number);
        const keypair = Keypair.fromSecretKey(new Uint8Array(walletPrivateKey));
        const hash = calculateHash(hashData);

        const signature = await recordHashToSolana(keypair, hash);

        const updateData = {$set: {hash: hash, signature: signature}};
        await votesCollection.updateOne({_id: new ObjectId(voteId)}, updateData);

        return new Response(JSON.stringify({voteId: voteId, signature: signature}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}