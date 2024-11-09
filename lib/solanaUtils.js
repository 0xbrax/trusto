import crypto from 'crypto';
import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction
} from "@solana/web3.js";


let cachedConnection = null;
export const getSolanaConnection = async () => {
    if (!cachedConnection) {
        cachedConnection = await new Connection(process.env.SOLANA_NETWORK || process.env.NEXT_PUBLIC_SOLANA_NETWORK, "finalized");
    }
    return cachedConnection;
};


export const calculateHash = (data) => {
    const jsonString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
    return hash;
};

export const getTransaction = async (signature) => {
    const connection = await getSolanaConnection();
    const transaction = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 1
    });
    return transaction;
};

export const recordHashToSolana = async (payer, hash) => {
    const connection = await getSolanaConnection();
    const memoProgramId = new PublicKey(process.env.SOLANA_MEMO_PROGRAM_ID);

    const memoInstruction = new TransactionInstruction({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(hash, 'utf-8'),
    });

    const transaction = new Transaction().add(memoInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);

    return signature;
};

export const verifyHashFromSolana = async (data, signature) => {
    const calculatedHash = calculateHash(data);
    const transaction = await getTransaction(signature);

    const memoLog = transaction.meta.logMessages.find(log => log.startsWith('Program log: Memo'));
    const memoHash = memoLog.split(': ')[2].slice(1, -1);

    const isVerified = calculatedHash === memoHash;
    return isVerified;
}

export const openBlockchainExplorerTx = (signature) => {
    const url = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    window.open(url, '_blank');
};

export const getSolBalance = async (address) => {
    const connection = await getSolanaConnection();
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
};

export const requestSolAirdrop = async (address, amount = 2) => {
    const connection = await getSolanaConnection();
    const publicKey = new PublicKey(address);

    await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
    );
};