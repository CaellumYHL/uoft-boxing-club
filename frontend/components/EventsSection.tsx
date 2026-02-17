'use client';

import { CONSTANTS } from '../utils/data';

export default function EventsSection() {
    const handleSignUp = () => {
        window.open(CONSTANTS.GOOGLE_FORM_URL, '_blank');
    };

    return (
        <div id="events" className="w-full h-screen flex flex-col justify-between items-center px-6">
            <div className="max-w-4xl w-full pt-30 flex flex-col gap-8">
                <h2 className="text-center text-3xl font-bold mb-4">Upcoming Events</h2>

                {/* Event Card 1 */}
                <div className="bg-[#3B71CA] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg border border-white/10">
                    <div className="w-32 h-32 bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
                        🥊
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">Introduction to Boxing</h3>
                        <p className="text-sm text-blue-100 italic mb-2">Sept 20 (6 PM to 8 PM) at VS Wellness Studio</p>
                        <p className="text-sm mb-4 text-white">A perfect introduction for beginners. Learn the stance, jab, and cross.</p>

                        <button onClick={handleSignUp} className="bg-[#C92C2C] hover:bg-red-700 text-white px-6 py-1 rounded-full text-sm font-bold transition cursor-pointer shadow-md transform hover:scale-105">
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Event Card 2 */}
                <div className="bg-[#3B71CA] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg border border-white/10">
                    <div className="w-32 h-32 bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
                        🏋️
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">Community Sparring</h3>
                        <p className="text-sm text-blue-100 italic mb-2">Oct 05 (7 PM to 9 PM) at VS Wellness Studio</p>
                        <p className="text-sm mb-4 text-white">Open sparring for advanced members. Mouthguard required.</p>

                        <button onClick={handleSignUp} className="bg-[#C92C2C] hover:bg-red-700 text-white px-6 py-1 rounded-full text-sm font-bold transition cursor-pointer shadow-md transform hover:scale-105">
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}