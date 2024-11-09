import type {Metadata} from "next";
import localFont from "next/font/local";
import "@/app/globals.css";

import {GlobalProvider} from "@/context/GlobalContext";
import Particles from "@/components/ui/particles";


export const metadata: Metadata = {
    title: "Trusto.foo",
    description: "Web2/Web3 hybrid voting platform",
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
            <div id="app" className="h-full bg-black text-white">
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
