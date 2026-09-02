'use client';

import Link from 'next/link';
import { CalendarPlus, FileText } from 'lucide-react';
import Calendar from './calendar/Calendar';
import { useSiteConfig } from '../context/SiteConfigContext';
import { googleCalendarSubscribeUrl } from '@/lib/calendar/api';

/**
 * The full weekly schedule section: the calendar grid plus the three actions
 * a visitor needs from it - sign up for classes, sign the safety waiver, and
 * subscribe to the schedule in their own Google Calendar.
 */
export default function ClassesSection() {
    const { classSignupUrl, waiverUrl } = useSiteConfig();
    const subscribeUrl = googleCalendarSubscribeUrl();

    return (
        <section
            id="classes"
            className="w-full bg-background-light flex flex-col items-center px-4 sm:px-6 py-20 lg:py-24 lg:h-screen"
        >
            <div className="max-w-5xl w-full flex flex-col lg:h-full">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 flex-shrink-0">
                    Weekly Schedule
                </h2>

                <div className="w-full lg:flex-1 lg:min-h-0 flex flex-col">
                    <Calendar />
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
                    {classSignupUrl ? (
                        <a href={classSignupUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <button className="w-full bg-[#C92C2C] hover:bg-red-700 text-white font-bold text-lg py-2.5 px-10 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                                Sign Up for Classes
                            </button>
                        </a>
                    ) : (
                        // No sign-up form configured yet - send people to memberships instead.
                        <Link href="/store" className="w-full sm:w-auto">
                            <button className="w-full bg-[#C92C2C] hover:bg-red-700 text-white font-bold text-lg py-2.5 px-10 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                                Sign Up
                            </button>
                        </Link>
                    )}

                    {waiverUrl && (
                        <a href={waiverUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold py-2.5 px-6 rounded-full transition cursor-pointer">
                                <FileText size={18} />
                                Sign Safety Waiver
                            </button>
                        </a>
                    )}

                    {subscribeUrl && (
                        <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold py-2.5 px-6 rounded-full transition cursor-pointer">
                                <CalendarPlus size={18} />
                                Add to Google Calendar
                            </button>
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
