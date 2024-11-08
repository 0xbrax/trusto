// @ts-nocheck
import {getMongoConnection} from "@/lib/mongoUtils";
import {ObjectId} from 'mongodb';

import {calculateHash, recordHashOnSolana} from "@/lib/solanaUtils";
import {
    Keypair,
} from "@solana/web3.js";


export async function POST(request) {
    const pollData = await request.json();

    try {
        const client = await getMongoConnection();

        const db = client.db("trusto");
        const pollsCollection = db.collection("polls");
        /*await pollsCollection.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0}
        );*/

        let expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt = expiresAt.toISOString();

        const data = {
            ...pollData,
            expiresAt: expiresAt
        };
        const result = await pollsCollection.insertOne(data);
        const pollId = result.insertedId;

        const hashData = {
            ...data,
            pollId: pollId,
            timestamp: Date.now()
        };

        const walletPrivateKey = process.env.SOLANA_WALLET_PRIVATE_KEY.split(',').map(Number);
        const keypair = Keypair.fromSecretKey(new Uint8Array(walletPrivateKey));
        const hash = calculateHash(hashData);

        const signature = await recordHashOnSolana(keypair, hash);

        const updateData = {$set: {hash: hash, signature: signature}};
        await pollsCollection.updateOne({_id: new ObjectId(pollId)}, updateData);

        return new Response(JSON.stringify({pollId: pollId, signature: signature}), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({message: `Oh, no... ${error}`}), {status: 500});
    }
}