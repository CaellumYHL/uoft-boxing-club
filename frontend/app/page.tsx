import Navbar from '../components/Navbar';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16 px-4 max-w-5xl mx-auto">
        {/* Left: Icon/Image */}
        <div className="relative">
          {/* Simulating the red glove with a large icon or shape */}
          <div className="text-red-700 transform -rotate-12 drop-shadow-2xl">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" stroke="none" />
              {/* Placeholder for glove shape - using a rounded rect for now to match the "blob" look if no svg */}
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#B91C1C" />
            </svg>
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

          <Link href="/classes">
            <button className="mt-4 bg-primary hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
              Get Started!
            </button>
          </Link>
        </div>
      </div>

      {/* Upcoming Classes Section */}
      <div className="mt-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-semibold mb-8">Upcoming Classes</h2>

        <div className="border border-white/50 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-transparent">

          {/* Class 1 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">TUES 13</span>
            <Link href="/classes">
              <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-lg shadow-md transition">
                Regular Classes
              </button>
            </Link>
          </div>

          {/* Class 2 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">FRI 16</span>
            <Link href="/classes">
              <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2 px-6 rounded-lg shadow-md transition">
                Regular Classes
              </button>
            </Link>
          </div>

          {/* Class 3 */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xl font-bold">MON 19</span>
            <Link href="/events">
              <button className="bg-secondary hover:bg-blue-600 text-white text-sm font-bold py-2 px-6 rounded-lg shadow-md transition">
                Calisthenics Colab
              </button>
            </Link>
          </div>

        </div>
      </div>

    </main>
  );
}