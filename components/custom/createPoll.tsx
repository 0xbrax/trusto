'use client'

import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {openBlockchainExplorerAddress, requestSolAirdrop} from "@/lib/solanaUtils";
import {useRouter} from "next/navigation";
import {useGlobal} from "@/context/GlobalContext";
import ShinyButton from "@/components/ui/shiny-button";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {
    LucidePlus,
    LucideTrash,
    LucideRefreshCw,
    LucideExternalLink,
    LucideLoader2
} from "lucide-react";


export default function CreatePoll() {
    const {walletAddress, walletBalance, updateBalance}: any = useGlobal();

    const {toast} = useToast();
    const [isWalletUpdating, setIsWalletUpdating] = useState<boolean>(false);
    const [isAirdropLoading, setIsAirdropLoading] = useState<boolean>(false);
    const [isPollCreating, setIsPollCreating] = useState<boolean>(false);

    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>([]);
    const [voter, setVoter] = useState<string>('');
    const [voters, setVoters] = useState<string[]>([]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value);
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    };
    const handleAddAnswer = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        if ((e.type === 'keydown' && e.key === 'Enter' && answer.trim() !== '') || (e.type === 'click' && answer.trim() !== '')) {
            e.preventDefault();
            addAnswer(answer);
            setAnswer('');
        }
    };
    const addAnswer = (value: string) => {
        if (value.trim() && !answers.includes(value.trim())) {
            setAnswers([...answers, value.trim()]);
        }
    };
    const removeAnswer = (value: string) => {
        setAnswers(answers.filter(val => val !== value));
    };

    const handleVoterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoter(e.target.value);
    };
    const handleAddVoter = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        if ((e.type === 'keydown' && e.key === 'Enter' && voter.trim() !== '') || (e.type === 'click' && voter.trim() !== '')) {
            e.preventDefault();
            addVoter(voter);
            setVoter('');
        }
    };
    const addVoter = (value: string) => {
        if (value.trim() && !voters.includes(value.trim())) {
            setVoters([...voters, value.trim()]);
        }
    };
    const removeVoter = (value: string) => {
        setVoters(voters.filter(val => val !== value));
    };


    const createPoll = async () => {
        if (isPollCreating) return;

        const pollData = {
            email,
            question,
            answers,
            voters,
        };

        for (const key in pollData) {
            // @ts-ignore
            if (pollData[key] === '' || (Array.isArray(pollData[key]) && !pollData[key].length)) {
                toast({
                    title: "Error",
                    description: "Some inputs are missing",
                });
                return;
            }
        }

        try {
            setIsPollCreating(true);
            const {data} = await axios.post('/api/create-poll', pollData);
            toast({
                title: "Success",
                description: "Your poll is created",
            });
            router.push(`/poll/${data.pollId}`);
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
            toast({
                title: "Error",
                description: error.response.data.message,
            });
        } finally {
            setIsPollCreating(false);
        }
    };

    const handleUpdateBalance = async () => {
        try {
            setIsWalletUpdating(true);
            await updateBalance();
        } catch (error) {
            console.error('ERROR: ', error);
            toast({
                title: "Error",
                description: `SOLANA Devnet is down...`,
            });
        } finally {
            setIsWalletUpdating(false);
        }
    };
    const getAirdrop = async () => {
        try {
            setIsAirdropLoading(true);
            await requestSolAirdrop(walletAddress);
            toast({
                title: "Success",
                description: `Your DEV SOL are on their way, auto update balance in 10 seconds`,
            });
        } catch (error) {
            console.error('ERROR: ', error);
            toast({
                title: "Error",
                description: `You have either reached your airdrop limit today or the airdrop faucet has run dry.`,
            });
        } finally {
            setIsAirdropLoading(false);
        }

        const timeout = setTimeout(() => {
            if (!isWalletUpdating) handleUpdateBalance();
            clearTimeout(timeout);
        }, 10_000);
    };


    useEffect(() => {
        handleUpdateBalance(); // promise is ignored
    }, []);


    return (
        <div className="p-4 text-center md:text-start">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Your poll</h2>
                    <p className="text-sm text-muted-foreground">will expire in 7 days</p>
                </div>


                <div className="mt-2 flex justify-center md:justify-start items-center gap-2">
                    <span>{walletBalance} DEV SOL</span>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openBlockchainExplorerAddress(walletAddress)}
                    >
                        <LucideExternalLink/>
                    </Button>
                    <Button onClick={handleUpdateBalance} disabled={isWalletUpdating || isAirdropLoading}
                            variant="secondary"
                            size="icon"
                            className="rounded-full">
                        {isWalletUpdating ? <LucideLoader2 className="animate-spin"/> : <LucideRefreshCw/>}
                    </Button>
                    <Button onClick={getAirdrop} disabled={isAirdropLoading || isWalletUpdating} variant="secondary">
                        {isAirdropLoading && <LucideLoader2 className="animate-spin"/>}
                        Airdrop
                    </Button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter email"
                    className="placeholder:text-primary-color/75"
                />

                <Input
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="Enter question"
                    className="placeholder:text-primary-color/75"
                />

                <div>
                    <div className="relative mb-2">
                        <Input
                            value={answer}
                            onChange={handleAnswerChange}
                            onKeyDown={handleAddAnswer}
                            placeholder="Add answers"
                            className="placeholder:text-primary-color/75 pr-10"
                        />
                        <button onClick={handleAddAnswer}
                                className="absolute inset-y-0 right-0 flex items-center pr-2"
                        ><LucidePlus className="h-4 w-4"/></button>
                    </div>

                    <div className="whitespace-nowrap overflow-x-auto">
                        {answers.map((value, index) => (
                            <span
                                key={index}
                                className={`inline-block px-3 py-1 rounded-full border ${index !== answers.length - 1 ? 'mr-2' : ''}`}
                            >
                        {value}
                                <button
                                    type="button"
                                    onClick={() => removeAnswer(value)}
                                    className="ml-2"
                                >
                            <LucideTrash className="inline h-4 w-4"/>
                        </button>
                    </span>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="relative mb-2">
                        <Input
                            value={voter}
                            onChange={handleVoterChange}
                            onKeyDown={handleAddVoter}
                            placeholder="Add voters"
                            className="placeholder:text-primary-color/75 pr-10"
                        />
                        <button onClick={handleAddVoter}
                                className="absolute inset-y-0 right-0 flex items-center pr-2"
                        ><LucidePlus className="h-4 w-4"/></button>
                    </div>

                    <div className="whitespace-nowrap overflow-x-auto">
                        {voters.map((value, index) => (
                            <span
                                key={index}
                                className={`inline-block px-3 py-1 rounded-full border ${index !== answers.length - 1 ? 'mr-2' : ''}`}
                            >
                        {value}
                                <button
                                    type="button"
                                    onClick={() => removeVoter(value)}
                                    className="ml-2"
                                >
                            <LucideTrash className="inline h-4 w-4"/>
                        </button>
                    </span>
                        ))}
                    </div>
                </div>
            </div>

            <ShinyButton onClick={createPoll}
                         className={`uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all mt-4 ${isPollCreating ? 'opacity-50 cursor-auto' : ''}`}
            >
                {isPollCreating && <LucideLoader2 className="inline-block h-4 w-4 animate-spin mr-2"/>}
                Create
            </ShinyButton>
        </div>
    )
}
