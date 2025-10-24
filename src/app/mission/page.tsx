"use client";

import Link from "next/link";

export default function MissionPage() {
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
            <span className="text-xl font-semibold text-gray-900">Focus</span>
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
              Our Mission
            </h1>

            <div className="text-xl text-gray-600 font-medium mb-8">
              Empowering productivity, enhancing learning, and transforming work
            </div>
          </div>

          {/* Mission Statement */}
          <section className="mb-16">
            <div className="bg-teal-50/30 border border-teal-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                What We Believe
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  At Focus, we believe that productivity isn't about working
                  harder—it's about working smarter. Our mission is to create
                  tools that help individuals and teams unlock their full
                  potential by making productivity personal, intuitive, and
                  sustainable.
                </p>
                <p>
                  We're building more than just another productivity app. We're
                  creating a comprehensive ecosystem that adapts to your unique
                  workflow, learns from your habits, and grows with your
                  ambitions.
                </p>
              </div>
            </div>
          </section>

          {/* Our Focus Areas */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-8">
              How We're Making a Difference
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Productivity */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">
                  Enhanced Productivity
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We help you organize tasks, track time, and build sustainable
                  habits that lead to meaningful progress. Our tools eliminate
                  busy work so you can focus on what truly matters.
                </p>
              </div>

              {/* Study */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">
                  Smarter Learning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're a student or lifelong learner, our platform
                  helps you retain information better, track your progress, and
                  develop effective study strategies that work for you.
                </p>
              </div>

              {/* Work */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-teal-600"
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
                <h3 className="text-xl font-bold text-black mb-4">
                  Better Work-Life Balance
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe great work happens when you have balance. Our tools
                  help you set boundaries, track your well-being, and ensure
                  productivity doesn't come at the cost of your health.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-8">Our Values</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    User-Centric Design
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every feature we build starts with understanding real user
                    needs. We prioritize simplicity, accessibility, and genuine
                    usefulness over flashy features.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Quality Over Quantity
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe in building fewer things better. Each tool is
                    crafted with attention to detail and designed to solve real
                    problems effectively.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Continuous Innovation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Technology evolves rapidly, and so do we. We're constantly
                    exploring new ways to make productivity more intelligent,
                    personalized, and effective.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Privacy & Security
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your data is yours. We're committed to protecting your
                    privacy and ensuring your information is secure,
                    transparent, and under your control.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Stats */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-8">
              Our Impact So Far
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-teal-600 mb-2">
                  50K+
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-teal-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-teal-600 mb-2">
                  100+
                </div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
              <div className="text-center bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-teal-600 mb-2">
                  4.9/5
                </div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-teal-50/30 border border-teal-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Join Our Mission
              </h2>
              <p className="text-lg mb-6 text-gray-700">
                Ready to transform your productivity and achieve your goals?
                Start your journey with Focus today.
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Started Free
              </Link>
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
                <img src="/logo.svg" alt="Focus" className="w-8 h-8" />
                <span className="text-xl font-bold text-gray-900">Focus</span>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 Focus, New Delhi, India
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
