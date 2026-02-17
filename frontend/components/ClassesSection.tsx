'use client';

import Link from 'next/link';

export default function ClassesSection() {
    return (
        <div id="classes" className="w-full bg-background-light flex flex-col items-center py-20">
            <div className="max-w-4xl mx-auto px-6 w-full">
                <h2 className="text-center text-3xl font-bold mb-10">Weekly Schedule</h2>

                {/* Schedule Grid Container */}
                <div className="border border-white/30 rounded-3xl p-8 bg-transparent">

                    {/* Days Header */}
                    <div className="grid grid-cols-3 mb-8 text-center text-xl font-bold uppercase tracking-wider">
                        <div>{/* Time Column Placeholder */}</div>
                        <div>TUES</div>
                        <div>FRI</div>
                    </div>

                    {/* Timetable Rows */}
                    <div className="flex flex-col gap-8">

                        {/* 4 PM */}
                        <div className="grid grid-cols-3 items-center">
                            <div className="text-xl font-bold pl-4">4 PM</div>
                            <div className="col-span-2"></div>
                        </div>

                        {/* 5 PM */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-xl font-bold pl-4 flex items-center">5 PM</div>

                            {/* Tues 5PM */}
                            <div className="bg-[#C92C2C]/90 p-4 rounded-xl text-sm">
                                <h3 className="font-bold text-lg">Coach Eithan</h3>
                                <p>Drop-in Class (FREE, beginners recommended)</p>
                                <p className="mt-4 italic font-light text-xs">Women’s Only Session</p>
                            </div>

                            {/* Fri 5PM */}
                            <div className="bg-[#3B71CA] p-4 rounded-xl text-sm">
                                <h3 className="font-bold text-lg">Coach Nic</h3>
                                <p>Membership Class</p>
                                <p>($25.00 one-time fee)</p>
                            </div>
                        </div>

                        {/* 6 PM */}
                        <div className="grid grid-cols-3 items-center">
                            <div className="text-xl font-bold pl-4">6 PM</div>
                            <div className="col-span-2"></div>
                        </div>

                        {/* 7 PM */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-xl font-bold pl-4 flex items-center">7 PM</div>

                            {/* Tues 7PM */}
                            <div className="bg-[#3B71CA] p-4 rounded-xl text-sm">
                                <h3 className="font-bold text-lg">Coach Dionne</h3>
                                <p>Membership Class</p>
                                <p>($25.00 one-time fee)</p>
                            </div>

                            {/* Fri 7PM */}
                            <div className="bg-[#C92C2C]/90 p-4 rounded-xl text-sm">
                                <h3 className="font-bold text-lg">Coach Eithan</h3>
                                <p>Drop-in Class (FREE, beginners recommended)</p>
                            </div>
                        </div>

                        {/* 8 PM */}
                        <div className="grid grid-cols-3 items-center">
                            <div className="text-xl font-bold pl-4">8 PM</div>
                            <div className="col-span-2"></div>
                        </div>

                    </div>
                </div>

                {/* Sign Up Button */}
                <div className="flex justify-center mt-12">
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
