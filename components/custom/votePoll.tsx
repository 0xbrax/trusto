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
import {openBlockchainExplorerTx, verifyHashFromSolana} from "@/lib/solanaUtils";
import ShinyButton from "@/components/ui/shiny-button";
import {formatDate} from "@/lib/globals";
import {
    LucideExternalLink,
    LucideX,
    LucideCheck
} from "lucide-react";


interface VoteProps {
    _id: string,
    email: string,
    answer: string,
    timestamp: string,
    signature: string,
}

interface PollProps {
    data: {
        _id: string,
        email: string;
        question: string;
        answers: string[];
        voters: string[];
        timestamp: string,
        expiresAt: string;
        signature: string,
        votes: VoteProps[]
    };
}


export default function VotePoll({data}: PollProps) {
    console.log('LOG - - -', data)


    const [isPollVerified, setIsPollVerified] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleAnswerChange = (value: string) => {
        setAnswer(value);
    };


    const verifyPoll = async () => {
        let isVerified: boolean = true;
        const hashData = {
            email: data.email,
            question: data.question,
            answers: data.answers,
            voters: data.voters,
            timestamp: data.timestamp,
            expiresAt: data.expiresAt,
            pollId: data._id
        };

        isVerified = await verifyHashFromSolana(hashData, data.signature);
        isVerified = await verifyVotes();

        console.log('IS VERIFIED', isVerified)

        setIsPollVerified(isVerified);
    };
    const verifyVotes = async () => {
        let isVerified: boolean = true;
        for (const vote of data.votes as VoteProps[]) {
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


    const votePoll = async () => {
        const voteData = {
            pollId: data._id,
            email,
            answer,
        };

        try {
            const {data} = await axios.post('/api/vote-poll', voteData);

            console.log('LOG - - ', data.voteId)
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Vote your poll</h2>

            <div>
                <div>
                    Expires at
                    {formatDate(data.expiresAt)}
                </div>
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
                    {isPollVerified ? (
                        <span
                            className="h-8 aspect-square rounded-full bg-primary-color text-black flex justify-center items-center"
                        ><LucideCheck/>
                        </span>
                    ) : (
                        <span
                            className="h-8 aspect-square rounded-full bg-secondary-color flex justify-center items-center"
                        ><LucideX/>
                        </span>
                    )}
                    <Button variant="secondary"
                            onClick={verifyPoll}
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


            <ShinyButton onClick={votePoll}
                         className="uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all"
            >
                Vote
            </ShinyButton>
        </div>
    )
}
