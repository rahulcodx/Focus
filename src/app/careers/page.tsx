"use client";

import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Planly</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#mission"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Our Mission
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-8">
              Careers
            </h1>

            {/* Mission Statement */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Our mission is to make learning personal again and help students
                discover knowledge in ways that actually make sense for them.
              </p>

              <p className="text-lg">
                We're looking for highly motivated individuals with a proven
                track-record of product design, development, and ownership
                across all roles.
              </p>

              <p className="text-lg">
                If that sounds like you, we want to hear from you.
              </p>
            </div>
          </div>

          {/* Open Positions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-8">
              Open Positions
            </h2>

            {/* No Positions Available */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Positions Available
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                We don't have any open positions at the moment, but we're always
                looking for talented people to join our team. Feel free to reach
                out if you'd like to connect for future opportunities.
              </p>

              {/* Contact Button */}
              <div className="mt-6">
                <Link
                  href="mailto:careers@planly.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Get in Touch
                </Link>
              </div>
            </div>
          </section>

          {/* Why Work With Us Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-8">
              Why Work With Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">
                  Make an Impact
                </h3>
                <p className="text-gray-600 text-sm">
                  Help millions of students and professionals achieve their
                  goals through better productivity tools.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">
                  Great Team
                </h3>
                <p className="text-gray-600 text-sm">
                  Work alongside passionate, talented individuals who care about
                  building the best product.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600 text-sm">
                  Take on meaningful challenges and grow your skills in a
                  fast-paced startup environment.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">
                  Flexible Culture
                </h3>
                <p className="text-gray-600 text-sm">
                  Enjoy flexible work arrangements and a culture that values
                  work-life balance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Planly" className="w-8 h-8" />
                <span className="text-xl font-bold text-gray-900">Planly</span>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 Planly, New Delhi, India
              </p>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-x-4 gap-y-3">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Contact Us
                </Link>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Blog
                </Link>
                <Link
                  href="/mission"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Our Mission
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-teal-600 hover:underline transition-all text-base"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All services are online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
