'use client'

import React, {useState} from "react";
import axios from "axios";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {calculateHash, openBlockchainExplorerTx, verifyHashFromSolana} from "@/lib/solanaUtils";
import {
    LucideExternalLink
} from "lucide-react";


interface VotePollProps {
    data: {
        _id: string,
        email: string;
        question: string;
        answers: string[];
        voters: string[];
        timestamp: string,
        expiresAt: string;
        hash: string,
        signature: string,
    };
}


export default function VotePoll({data}: VotePollProps) {
    console.log('LOG - - ', data)


    const [email, setEmail] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleAnswerChange = (value: string) => {
        setAnswer(value);
    };


    const verifyPoll = async (signature: string) => {
        const hashData = {
            email: data.email,
            question: data.question,
            answers: data.answers,
            voters: data.voters,
            timestamp: data.timestamp,
            expiresAt: data.expiresAt,
            pollId: data._id
        };

        const {isVerified, hash} = await verifyHashFromSolana(data, signature);

        console.log(isVerified, hash)
    };


    const votePoll = async () => {
        const voteData = {
            pollId: data._id,
            email,
            answer,
        };

        try {
            const {data} = await axios.post('/api/vote-poll', voteData);

            console.log('LOG - - ', data.voteId)
        } catch (error) {
            console.error('ERROR: ', error);
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Vote your poll</h2>

            <div>
                <div>
                    Signature {data.signature}
                    <Button variant="secondary"
                            size="icon"
                            className="rounded-full"
                            onClick={() => openBlockchainExplorerTx(data.signature)}
                    ><LucideExternalLink/>
                    </Button>
                </div>

                <div>
                    Please verify before vote
                    <Button variant="secondary"
                            onClick={() => verifyPoll(data.signature)}
                    >Verify
                    </Button>
                </div>
            </div>


            <p>{data.question}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />

                <Select
                    value={answer}
                    onValueChange={handleAnswerChange}
                >
                    <SelectTrigger className="w-1/2 overflow-hidden">
                        <SelectValue placeholder="Select answer"/>
                    </SelectTrigger>
                    <SelectContent>
                        {data.answers.map((value, i) => (
                            <SelectItem key={i} value={value}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <span onClick={votePoll}>VOTA</span>
        </div>
    )
}
