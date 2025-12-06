import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Club Football Competition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">

          {/* ✅ HEADER UPGRADE (TEXT 100% UNTOUCHED) */}
          <header className="mb-8 bg-gradient-to-r from-black via-gray-900 to-black rounded-xl p-6 shadow-lg border border-gray-800">
            <h1 className="text-2xl font-bold text-center tracking-wide text-white">
              Club Football Competition
            </h1>

            {/* ✅ NAV UPGRADE (NOW DEFAULT WHITE ✅) */}
            <nav className="mt-4 flex gap-6 justify-center text-sm sm:text-base font-semibold text-white">
              <Link href="/" className="hover:text-yellow-400 transition">
                Home
              </Link>
              <Link href="/teams" className="hover:text-yellow-400 transition">
                Teams
              </Link>
              <Link href="/fixtures" className="hover:text-yellow-400 transition">
                Fixtures
              </Link>
              <Link href="/playersStats" className="hover:text-yellow-400 transition">
                Players
              </Link>
              <Link href="/table" className="hover:text-yellow-400 transition">
                Table
              </Link>
            </nav>

            <hr className="mt-5 border-gray-700" />
          </header>

          {/* ✅ MAIN CONTENT CARD */}
          <main className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-xl border border-gray-800">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
