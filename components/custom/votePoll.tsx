'use client'

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import axios from "axios";

interface VotePollProps {
    data: {
        pollId: string;
        email: string;
        question: string;
        answers: string[];
        voters: string[];
        expiresAt: string;
    };
}


export default function VotePoll({data}: VotePollProps) {
    const [email, setEmail] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    console.log('LOG - - ', data)


    const votePoll = async () => {
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Vote your poll</h2>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <Input
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />
            </div>

            <span>VOTA</span>
        </div>
    )
}
