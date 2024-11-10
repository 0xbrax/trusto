'use client'

import React, {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
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

const base_url = process.env.NEXT_PUBLIC_BASE_URL;


interface VoteProps {
    _id: string,
    email: string,
    answer: string,
    timestamp: number,
    signature: string,
}

interface PollProps {
    data: {
        _id: string,
        email: string;
        question: string;
        answers: string[];
        voters: string[];
        timestamp: number,
        expiresAt: string;
        signature: string,
        votes: VoteProps[]
    };
}


export default function VotePoll({data}: PollProps) {
    const router = useRouter();
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
            pollId: data._id,
            email: data.email,
            question: data.question,
            answers: data.answers,
            voters: data.voters,
            timestamp: data.timestamp
        };

        isVerified = await verifyHashFromSolana(hashData, data.signature);
        isVerified = await verifyVotes();

        setIsPollVerified(isVerified);
    };
    const verifyVotes = async () => {
        let isVerified: boolean = true;
        for (const vote of data.votes as VoteProps[]) {
            const hashData = {
                pollId: data._id,
                voteId: vote._id,
                email: vote.email,
                answer: vote.answer,
                timestamp: vote.timestamp
            };
            isVerified = await verifyHashFromSolana(hashData, vote.signature);
        }
        return isVerified;
    };

    const votePoll = async () => {
        const voteData = {
            pollId: data._id,
            email,
            answer
        };

        try {
            await axios.post('/api/vote-poll', voteData);
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
        }
    };

    const finalizePoll = async () => {
        const response = await axios.get(`${base_url}/api/finalize-poll?pollId=${data._id}`);

        router.push(`/poll/${data._id}?finalizedId=${response.data.finalizedPollId}`);
    };


    return (
        <div className="p-4 text-center md:text-start">
            <div className="flex flex-col justify-between items-center">
                <h2 className="text-xl font-bold">Vote poll</h2>

                <div>
                    Expires at {formatDate(data.expiresAt)}
                </div>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-2 mt-2">
                <span>Verify before vote</span>
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
                        size="icon"
                        className="rounded-full"
                        onClick={() => openBlockchainExplorerTx(data.signature)}
                ><LucideExternalLink/>
                </Button>
                <Button variant="secondary"
                        onClick={verifyPoll}
                >Verify
                </Button>
            </div>

            <div className="mt-4 font-bold">{data.question}</div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />

                <Select
                    value={answer}
                    onValueChange={handleAnswerChange}
                >
                    <SelectTrigger>
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


            <div className="mt-4">
                <ShinyButton onClick={votePoll}
                             className="uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all mr-4"
                >
                    Vote
                </ShinyButton>
                <ShinyButton onClick={finalizePoll}
                             className="uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all"
                >
                    Finalize
                </ShinyButton>
            </div>
        </div>
    )
}
