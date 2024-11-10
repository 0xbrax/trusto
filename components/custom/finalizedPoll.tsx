'use client'

import {verifyHashFromSolana} from "@/lib/solanaUtils";
import {useState} from "react";

interface FinalizedPollProps {
    data: {
        _id: string,
        pollId: string,
        isVerified: boolean,
        answerPercentages: object[],
        timestamp: number,
        expiresAt: string,
        signature: string,
    };
}

export default function FinalizedPoll({data}: FinalizedPollProps) {
    const [isPollVerified, setIsPollVerified] = useState<boolean>(false);

    const verifyPoll = async () => {
        const hashData = {
            pollId: data.pollId,
            finalizedPollId: data._id,
            isVerified: data.isVerified,
            answerPercentages: data.answerPercentages,
            timestamp: data.timestamp
        };

        const isVerified: boolean = await verifyHashFromSolana(hashData, data.signature);

        setIsPollVerified(isVerified);
    };

    return (
        <div>{JSON.stringify(data)}</div>
    )
}