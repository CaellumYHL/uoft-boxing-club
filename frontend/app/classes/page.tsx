'use client'; // strictly ensures client-side rendering which prevents some export confusion

import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function Classes() {
  return (
    <main className="min-h-screen bg-background text-white pb-20 pt-32">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6">

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
              <div className="bg-primary/90 p-4 rounded-xl text-sm">
                <h3 className="font-bold text-lg">Coach Eithan</h3>
                <p>Drop-in Class (FREE, beginners recommended)</p>
                <p className="mt-4 italic font-light text-xs">Women’s Only Session</p>
              </div>

              {/* Fri 5PM */}
              <div className="bg-secondary p-4 rounded-xl text-sm">
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
              <div className="bg-secondary p-4 rounded-xl text-sm">
                <h3 className="font-bold text-lg">Coach Dionne</h3>
                <p>Membership Class</p>
                <p>($25.00 one-time fee)</p>
              </div>

              {/* Fri 7PM */}
              <div className="bg-primary/90 p-4 rounded-xl text-sm">
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
            <button className="bg-primary hover:bg-red-700 text-white font-bold text-2xl py-3 px-16 rounded-full shadow-lg transition-transform hover:scale-105">
              Sign Up
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}