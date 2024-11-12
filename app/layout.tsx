import type {Metadata} from "next";
import "@/app/globals.css";

import {GlobalProvider} from "@/context/GlobalContext";
import Particles from "@/components/ui/particles";
import Menubar from "@/components/custom/menubar";
import {Toaster} from "@/components/ui/toaster"


export const metadata: Metadata = {
    title: "Trusto.foo",
    description: "Experience transparent voting with Trusto, hybrid Web2-Web3 platform based on Solana blockchain.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <GlobalProvider>
            <div id="app" className="relative h-full bg-black text-white">
                <Menubar/>

                {children}

                <Particles
                    className="absolute inset-0"
                    quantity={100}
                    ease={80}
                    color="#6DEDD4"
                    refresh
                />

                <Toaster/>

                <div
                    className="w-full h-[2rem] absolute bottom-0 left-0 bg-gradient-to-b from-transparent to-secondary-color/25"></div>
            </div>
        </GlobalProvider>
        </body>
        </html>
    );
}
