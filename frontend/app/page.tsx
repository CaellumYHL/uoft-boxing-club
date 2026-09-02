'use client';

import Navbar from '../components/Navbar';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import GloveIcon from '../components/GloveIcon';
import ClassesSection from '../components/ClassesSection';
import EventsSection from '../components/EventsSection';
import UpcomingClasses from '../components/UpcomingClasses';
import Footer from '../components/Footer';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Home() {
  const { locationName, locationAddress } = useSiteConfig();

  return (
    <main className="min-h-screen bg-background text-white overflow-x-hidden">
      <Navbar />

      {/*
        Hero + upcoming strip share the first screen so the schedule is fully
        visible on load without scrolling (issue #13).
      */}
      <div id="home" className="flex flex-col justify-center gap-8 lg:gap-14 pt-24 lg:pt-28 pb-10 lg:pb-14 lg:min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Left: Icon/Image */}
          <div className="relative flex-shrink-0">
            <div className="transform -rotate-12 drop-shadow-2xl">
              <GloveIcon className="w-24 sm:w-36 lg:w-48 h-auto" />
            </div>
          </div>

          {/* Right: Text content */}
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Box with us!</h1>

            <div className="flex items-start gap-3 text-sm sm:text-lg text-gray-200">
              <MapPin className="mt-1 flex-shrink-0" />
              <div>
                <p>{locationName}</p>
                <p>{locationAddress}</p>
              </div>
            </div>

            <Link href="#classes">
              <button className="mt-2 bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                Get Started!
              </button>
            </Link>
          </div>
        </div>

        <UpcomingClasses />
      </div>

      {/* Full Classes Section */}
      <ClassesSection />

      {/* Full Events Section */}
      <EventsSection />

      <Footer />
    </main>
  );
}
