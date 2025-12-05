import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero Section */}
        <header className="relative mb-16">
          {/* Background hero shape */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120%] h-full opacity-10"
              viewBox="0 0 1440 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#gradient)"
                d="M0,64L48,101.3C96,139,192,213,288,245.3C384,277,480,267,576,245.3C672,224,768,192,864,165.3C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative max-w-5xl mx-auto text-center px-6">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-md">
              Greenlanders Competition Dashboard
            </h1>
            <p className="text-gray-700 sm:text-xl max-w-3xl mx-auto">
              Monitor teams, schedule fixtures, track results, and analyze player statistics with a professional-grade interface.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/teams"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
              >
                Get Started
              </Link>
              <Link
                href="/fixtures"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg shadow transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <Link
            href="/teams"
            className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Teams</h2>
            <p className="text-sm opacity-80">View and manage all club teams.</p>
          </Link>

          <Link
            href="/fixtures"
            className="relative overflow-hidden p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Fixtures</h2>
            <p className="text-sm opacity-80">Schedule and manage all upcoming matches.</p>
          </Link>

          <Link
            href="/results"
            className="relative overflow-hidden p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Results</h2>
            <p className="text-sm opacity-80">View match results and scores.</p>
          </Link>

          <Link
            href="/players"
            className="relative overflow-hidden p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-bold mb-2">Player Stats</h2>
            <p className="text-sm opacity-80">Track performance and stats for all players.</p>
          </Link>

          <Link
            href="/table"
            className="relative overflow-hidden p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-bold mb-2">League Table</h2>
            <p className="text-sm opacity-80">View the standings and points table.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
