'use client';

import Navbar from '../../components/Navbar';
import { CONSTANTS } from '../../utils/data';

export default function Events() {
  const handleSignUp = () => {
    window.open(CONSTANTS.GOOGLE_FORM_URL, '_blank');
  };

  return (
    <main className="min-h-screen bg-background text-white pb-20 pt-32">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-8">

        {/* Event Card 1 */}
        <div className="bg-secondary rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg">
          <div className="w-32 h-32 bg-background/50 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
            🥊
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold">Introduction to Boxing</h3>
            <p className="text-sm text-blue-100 italic mb-2">Sept 20 (6 PM to 8 PM) at VS Wellness Studio</p>
            <p className="text-sm mb-4">A perfect introduction for beginners. Learn the stance, jab, and cross.</p>

            <button onClick={handleSignUp} className="bg-background hover:bg-slate-900 text-white px-6 py-1 rounded-full text-sm font-bold transition cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>

        {/* Event Card 2 */}
        <div className="bg-secondary rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg">
          <div className="w-32 h-32 bg-background/50 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
            🏋️
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">Community Sparring</h3>
            <p className="text-sm text-blue-100 italic mb-2">Oct 05 (7 PM to 9 PM) at VS Wellness Studio</p>
            <p className="text-sm mb-4">Open sparring for advanced members. Mouthguard required.</p>

            <button onClick={handleSignUp} className="bg-background hover:bg-slate-900 text-white px-6 py-1 rounded-full text-sm font-bold transition cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}