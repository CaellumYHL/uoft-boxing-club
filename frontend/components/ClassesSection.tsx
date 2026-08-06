'use client';

import Link from 'next/link';
import Calendar from './calendar/Calendar';

export default function ClassesSection() {
    return (
        <div
            id="classes"
            className="w-full h-screen bg-background-light flex flex-col items-center px-6 pb-10 pt-32"
        >
            <div className="max-w-5xl w-full flex flex-col h-full">
                <h2 className="text-center text-3xl font-bold mb-3 flex-shrink-0">
                    Weekly Schedule
                </h2>

                {/* Calendar */}
                <div className="w-full flex-1 min-h-0 flex flex-col">
                    <Calendar />
                </div>

                {/* Sign Up button */}
                <div className="mt-10 flex justify-center flex-shrink-0">
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
