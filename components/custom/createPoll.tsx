'use client'

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {getSolBalance, openBlockchainExplorerAddress, requestSolAirdrop} from "@/lib/solanaUtils";
import {useRouter} from "next/navigation"
import ShinyButton from "@/components/ui/shiny-button";
import {Button} from "@/components/ui/button";
import {
    LucidePlus,
    LucideTrash,
    LucideRefreshCw,
    LucideHandCoins,
    LucideExternalLink
} from "lucide-react";


export default function CreatePoll() {
    const walletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET_PUBLIC_KEY;
    const [walletBalance, setWalletBalance] = useState<number>(0);

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
        const pollData = {
            email,
            question,
            answers,
            voters,
        };

        try {
            const {data} = await axios.post('/api/create-poll', pollData);

            router.push(`/poll/${data.pollId}`);
        } catch (error: any) {
            console.error('ERROR: ', error.response.data.message);
        }
    };

    const updateBalance = async () => {
        const balance = await getSolBalance(walletAddress);

        setWalletBalance(balance);
    };
    const getAirdrop = async () => {
        await requestSolAirdrop(walletAddress);
        await updateBalance();
    };


    // INIT
    updateBalance();


    return (
        <div className="h-full p-4 overflow-y-auto">
            <div>
                <h2 className="text-xl font-bold">Your poll</h2>

                <div className="mt-2 flex items-center gap-2">
                    <span>{walletBalance} SOL</span>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openBlockchainExplorerAddress(walletAddress)}
                    >
                        <LucideExternalLink/>
                    </Button>
                    <Button onClick={updateBalance} variant="secondary" size="icon"
                            className="rounded-full"><LucideRefreshCw/></Button>
                    <Button onClick={getAirdrop} variant="secondary">Airdrop<LucideHandCoins
                        className="inline h-4 w-4"/></Button>
                </div>
            </div>

            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />

                <Input
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="Question"
                />

                <div>
                    <div className="relative mb-2">
                        <Input
                            value={answer}
                            onChange={handleAnswerChange}
                            onKeyDown={handleAddAnswer}
                            placeholder="Answers"
                            className="w-full pr-10"
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
                            placeholder="Voters"
                            className="w-full pr-10"
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
                         className="uppercase bg-secondary-color font-bold hover:bg-primary-color hover:text-black transition-all"
            >
                Create
            </ShinyButton>
        </div>
    )
}
