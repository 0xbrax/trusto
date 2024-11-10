"use client";

//import Image from "next/image";

import {BorderBeam} from "@/components/ui/border-beam";
import CreatePoll from "@/components/custom/createPoll";

export default function Home() {
    return (
        <div id="home"
             className="container mx-auto px-4 h-full md:flex justify-center items-center gap-4 md:gap-8 overflow-y-auto">
            <div className="h-full md:h-auto md:w-1/2 flex flex-col justify-center items-center">
                <h1
                    className="text-center text-2xl md:text-6xl font-bold text-primary-color"
                >
                    <span className="">Building <span
                        className="inline-block px-3 bg-primary-color text-secondary-color">trust</span>,</span><br/>
                    <span className="text-secondary-color">o</span>ne vote at a time <span
                    className="inline-block px-3 bg-primary-color text-secondary-color">!</span>
                </h1>
                <p className="text-muted-foreground text-center md:text-xl mt-2">
                    Experience secure, transparent voting with <strong className="font-normal">Trusto</strong>.<br/>
                    Our blockchain-hybrid platform ensures every vote is trusted.
                </p>
            </div>

            <div className="h-full w-full md:w-1/2 flex justify-center items-center">
                <div
                    className="relative w-full overflow-hidden rounded-lg border glass shadow-xl"
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
        </div>
    );
}
