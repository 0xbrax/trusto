'use client'

import {openBlockchainExplorerTx, verifyHashFromSolana} from "@/lib/solanaUtils";
import React, {useState} from "react";
import {formatDate} from "@/lib/globals";
import {LucideCheck, LucideExternalLink, LucideX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

interface FinalizedPollProps {
    data: {
        _id: string,
        pollId: string,
        isVerified: boolean,
        question: string,
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
            question: data.question,
            answerPercentages: data.answerPercentages,
            timestamp: data.timestamp
        };

        const isVerified: boolean = await verifyHashFromSolana(hashData, data.signature);

        setIsPollVerified(isVerified);
    };

    verifyPoll() // async is ignored

    return (
        <div className="p-4 text-center md:text-start">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                <h2 className="text-xl font-bold">Finalized poll</h2>
                <p className="text-sm text-muted-foreground">expires at {formatDate(data.expiresAt)}</p>
            </div>

            <div className="mt-4 font-bold">{data.question}</div>

            <div className="mt-2">
                {data.answerPercentages.map((item: any, i) => (<React.Fragment key={i}>
                    <Separator className="my-2"/>
                    <div className="flex justify-between gap-2">
                        <div>
                            {item.answer}
                        </div>
                        <div>
                            {item.percentage}
                        </div>
                    </div>
                    {i === data.answerPercentages.length - 1 && <Separator className="my-2"/>}
                </React.Fragment>))}
            </div>

            <div className="flex justify-center md:justify-start items-center gap-2 mt-4">
                <span>Database verified</span>
                {data.isVerified ? (
                    <span
                        className="h-9 aspect-square rounded-full bg-primary-color text-black flex justify-center items-center"
                    ><LucideCheck/>
                        </span>
                ) : (
                    <span
                        className="h-9 aspect-square rounded-full bg-secondary-color flex justify-center items-center"
                    ><LucideX/>
                        </span>
                )}
            </div>

            <div className="flex justify-center md:justify-start items-center gap-2 mt-2">
                <span>Blockchain verified</span>
                {isPollVerified ? (
                    <span
                        className="h-9 aspect-square rounded-full bg-primary-color text-black flex justify-center items-center"
                    ><LucideCheck/>
                        </span>
                ) : (
                    <span
                        className="h-9 aspect-square rounded-full bg-secondary-color flex justify-center items-center"
                    ><LucideX/>
                        </span>
                )}
                <Button variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openBlockchainExplorerTx(data.signature)}
                ><LucideExternalLink/>
                </Button>
            </div>
        </div>
    )
}