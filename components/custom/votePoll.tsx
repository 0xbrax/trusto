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


interface VotePollProps {
    data: {
        _id: string,
        email: string;
        question: string;
        answers: string[];
        voters: string[];
        expiresAt: string;
    };
}


export default function VotePoll({data}: VotePollProps) {
    const [email, setEmail] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleAnswerChange = (value: string) => {
        setAnswer(value);
    };

    console.log('LOG - - ', data)


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
