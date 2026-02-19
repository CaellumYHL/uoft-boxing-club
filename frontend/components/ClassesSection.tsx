'use client';

import Link from 'next/link';
import Calendar from './Calendar';

export default function ClassesSection() {
    return (
        <div
            id="classes"
            className="w-full min-h-screen bg-background-light flex flex-col items-center px-6"
        >
            <div className="max-w-4xl w-full pt-30 flex flex-col">
                <h2 className="text-center text-3xl font-bold mb-10">
                    Weekly Schedule
                </h2>

                {/* Calendar */}
                <div className="w-full">
                    <Calendar />
                </div>

                {/* Controlled spacing */}
                <div className="mt-6 flex justify-center">
                    <Link href="/store">
                        <button className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold text-lg py-2 px-10 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
