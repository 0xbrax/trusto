import type {Metadata} from "next";
import "@/app/globals.css";

import {GlobalProvider} from "@/context/GlobalContext";
import Particles from "@/components/ui/particles";
import Menubar from "@/components/custom/menubar";


export const metadata: Metadata = {
    title: "Trusto.foo",
    description: "Hybrid WEB2-WEB3 voting platform based on Solana blockchain.",
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
            </div>
        </GlobalProvider>
        </body>
        </html>
    );
}
