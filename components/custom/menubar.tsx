'use client'

import Link from "next/link";

export default function Menubar() {

    return (
        <nav id="menubar"
             className="w-full h-[5rem] absolute z-[5000] top-0 left-0 px-4 flex justify-center items-center bg-gradient-to-b from-primary-color/25 to-transparent">
            <Link href="/" className="font-bold text-2xl">
                <span className="text-primary-color">Trust</span><span className="text-secondary-color">o</span>
            </Link>
        </nav>
    )
}