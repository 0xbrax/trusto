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
import {useToast} from "@/hooks/use-toast";
import {useClipboard} from "@/hooks/useClipboard";
import {
    LucideExternalLink,
    LucideX,
    LucideCheck,
    LucideLoader2,
    LucideCopy
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
    const {copyToClipboard} = useClipboard();
    const [isPollVerified, setIsPollVerified] = useState<boolean>(false);

    const {toast} = useToast();
    const [isPollVoting, setIsPollVoting] = useState<boolean>(false);
    const [isPollFinalizing, setIsPollFinalizing] = useState<boolean>(false);
    const [isPollVerifying, setIsPollVerifying] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleAnswerChange = (value: string) => {
        setAnswer(value);
    };

    const handleCopy = () => {
        const url = `${base_url}/poll/${data._id}`;

        copyToClipboard(url); // promise is ignored
    };


    const verifyPoll = async () => {
        setIsPollVerifying(true);
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
        setIsPollVerifying(false);
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
        if (isPollVoting || isPollFinalizing) return;

        const voteData = {
            pollId: data._id,
            email,
            answer
        };

        if (voteData.email === '' || voteData.answer === '') {
            toast({
                title: "Error",
                description: "Some inputs are missing",
            });
            return;
        }

        try {
            setIsPollVoting(true);
            await axios.post('/api/vote-poll', voteData);
            toast({
                title: "Success",
                description: "Your vote is signed",
            });
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
            toast({
                title: "Error",
                description: error.response.data.message,
            });
        } finally {
            setIsPollVoting(false);
        }
    };

    const finalizePoll = async () => {
        if (isPollFinalizing || isPollVoting) return;
        try {
            setIsPollFinalizing(true);
            const response = await axios.get(`${base_url}/api/finalize-poll?pollId=${data._id}`);
            toast({
                title: "Success",
                description: "Poll is finalized",
            });
            router.push(`/poll/${data._id}?finalizedId=${response.data.finalizedPollId}`);
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
            toast({
                title: "Error",
                description: error.response.data.message,
            });
        } finally {
            setIsPollFinalizing(false);
        }
    };


    return (
        <div className="p-4 text-center md:text-start">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>Vote poll</span>
                    <Button variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-secondary/20 hover:text-white"
                            onClick={handleCopy}
                    ><LucideCopy/>
                    </Button>
                </h2>
                <p className="text-sm text-muted-foreground">expires at {formatDate(data.expiresAt)}</p>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-2 mt-2">
                <span>Verify before vote</span>
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
                <Button variant="secondary"
                        onClick={verifyPoll}
                        disabled={isPollVerifying}
                >
                    {isPollVerifying && <LucideLoader2 className="animate-spin"/>}
                    Verify
                </Button>
            </div>

            <div className="mt-4 font-bold">{data.question}</div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter email"
                    className="placeholder:text-primary-color/75"
                />

                <Select
                    value={answer}
                    onValueChange={handleAnswerChange}
                >
                    <SelectTrigger className={!answer ? "text-primary-color/75" : ""}>
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
                             className={`uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all mr-4 ${isPollVoting || isPollFinalizing ? 'opacity-50 cursor-auto' : ''}`}
                >
                    {isPollVoting && <LucideLoader2 className="inline-block h-4 w-4 animate-spin mr-2"/>}
                    Vote
                </ShinyButton>
                <ShinyButton onClick={finalizePoll}
                             className={`uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all ${isPollFinalizing || isPollVoting ? 'opacity-50 cursor-auto' : ''}`}
                >
                    {isPollFinalizing && <LucideLoader2 className="inline-block h-4 w-4 animate-spin mr-2"/>}
                    Finalize
                </ShinyButton>
            </div>
        </div>
    )
}
