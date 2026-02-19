'use client';

import Link from 'next/link';
import Calendar from './Calendar';

export default function ClassesSection() {
    return (
        <div id="classes" className="w-full h-screen bg-background-light flex flex-col justify-between items-center px-6">
            <div className="max-w-4xl w-full pt-30">
                <h2 className="text-center text-3xl font-bold mb-10">Weekly Schedule</h2>

                {/* Schedule Grid Container */}
                <div className='h-[60vh] w-full'>
                    <Calendar />
                </div>

                {/* Sign Up Button */}
                <div className="flex justify-center mt-10">
                    <Link href="/store">
                        <button className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold text-2xl py-3 px-16 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
