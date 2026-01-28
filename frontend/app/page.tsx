import Navbar from '../components/Navbar';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import GloveIcon from '../components/GloveIcon';
import ClassesSection from '../components/ClassesSection';
import EventsSection from '../components/EventsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div id="home" className="flex flex-col md:flex-row items-center justify-center gap-12 px-4 max-w-5xl mx-auto min-h-[80vh]">
        {/* Left: Icon/Image */}
        <div className="relative">
          {/* Using the boxing glove SVG */}
          <div className="transform -rotate-12 drop-shadow-2xl">
            <GloveIcon className="w-48 h-auto" />
          </div>
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-5xl font-bold tracking-tight">Box with us!</h1>

          <div className="flex items-start gap-3 text-lg text-gray-200">
            <MapPin className="mt-1 flex-shrink-0" />
            <div>
              <p>St. Michaels College Wellness Studio</p>
              <p>81 Mary Street</p>
            </div>
          </div>

          <Link href="#classes">
            <button className="mt-4 bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
              Get Started!
            </button>
          </Link>
        </div>
      </div>

      {/* Upcoming Classes Teaser (Optional - keeping as per original design but linking to full schedule) */}
      <div className="mt-24 px-6 max-w-4xl mx-auto mb-32">
        <h2 className="text-center text-2xl font-semibold mb-8">Upcoming Classes</h2>

        <div className="border border-white/50 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-transparent">

          {/* Class 1 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">TUES 13</span>
            <Link href="#classes">
              <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-full shadow-md transition cursor-pointer transform hover:scale-105">
                Regular Classes
              </button>
            </Link>
          </div>

          {/* Class 2 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">FRI 16</span>
            <Link href="#classes">
              <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-full shadow-md transition cursor-pointer transform hover:scale-105">
                Regular Classes
              </button>
            </Link>
          </div>

          {/* Class 3 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">MON 19</span>
            <Link href="#events">
              <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-full shadow-md transition cursor-pointer transform hover:scale-105">
                Calisthenics Colab
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* Full Classes Section */}
      <ClassesSection />

      {/* Full Events Section */}
      <EventsSection />

    </main>
  );
}