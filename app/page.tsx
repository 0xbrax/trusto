"use client";

//import Image from "next/image";

import {BorderBeam} from "@/components/ui/border-beam";
import CreatePoll from "@/components/custom/createPoll";

export default function Home() {
    return (
        <div id="home" className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center md:gap-8">
            <div className="w-1/2">
                <h1
                    className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
                >
                    Building trust,<br/>
                    one vote at a time !
                </h1>
                <p className="text-muted-foreground text-center">
                    Experience secure, transparent voting with Trusto.<br/>
                    Our blockchain-hybrid platform ensures every vote is trusted.
                </p>
            </div>


            <div
                className="relative h-1/2 w-1/2 overflow-hidden rounded-lg border glass shadow-xl"
            >
                <CreatePoll/>

                <BorderBeam
                    size={250}
                    duration={12}
                    delay={9}
                    colorFrom="#E34107"
                    colorTo="#DDDDDD"
                />
            </div>
        </div>
    );
}
