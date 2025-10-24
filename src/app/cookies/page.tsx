"use client";

import Link from "next/link";

export default function CookiePolicyPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-500 text-lg">
              Effective Date: Monday, July 28th, 2025
            </p>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <h2 className="text-xl text-gray-600 font-medium">
              How we use cookies and similar technologies
            </h2>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Introduction
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  This Cookie Policy explains how Focus uses cookies and
                  similar technologies when you visit our website or use our
                  services.
                </p>
                <p>
                  It explains what these technologies are and why we use them,
                  as well as your rights to control our use of them.
                </p>
              </div>
            </section>

            {/* What Are Cookies */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                What Are Cookies
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. Cookies are widely
                  used by website owners to make their websites work more
                  efficiently and to provide reporting information.
                </p>
                <p>
                  Cookies set by the website owner (in this case, Focus) are
                  called "first party cookies." Cookies set by parties other
                  than the website owner are called "third party cookies."
                </p>
              </div>
            </section>

            {/* Types of Cookies We Use */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Types of Cookies We Use
              </h3>
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    Essential Cookies
                  </h4>
                  <p className="text-gray-700 mb-3">
                    These cookies are strictly necessary for the website to
                    function and cannot be switched off.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
                    <li>Authentication and security</li>
                    <li>Session management</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                {/* Performance Cookies */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    Performance Cookies
                  </h4>
                  <p className="text-gray-700 mb-3">
                    These cookies help us understand how visitors interact with
                    our website by collecting anonymous information.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
                    <li>Page analytics</li>
                    <li>Usage statistics</li>
                    <li>Error tracking</li>
                  </ul>
                </div>

                {/* Functional Cookies */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    Functional Cookies
                  </h4>
                  <p className="text-gray-700 mb-3">
                    These cookies allow the website to remember choices you make
                    and provide enhanced features.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
                    <li>User preferences</li>
                    <li>Language settings</li>
                    <li>Theme preferences</li>
                  </ul>
                </div>

                {/* Targeting Cookies */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    Targeting Cookies
                  </h4>
                  <p className="text-gray-700 mb-3">
                    These cookies may be set through our site by our advertising
                    partners to build a profile of your interests.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
                    <li>Advertising personalization</li>
                    <li>Social media integration</li>
                    <li>Marketing analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Third-Party Cookies
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may use third-party services that place cookies on your
                  device:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Google Analytics:</strong> For website analytics and
                    performance monitoring
                  </li>
                  <li>
                    <strong>Intercom:</strong> For customer support and
                    messaging
                  </li>
                  <li>
                    <strong>Stripe:</strong> For payment processing and fraud
                    prevention
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> For social sharing
                    and authentication
                  </li>
                </ul>
              </div>
            </section>

            {/* Managing Cookies */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Managing Cookies
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You have several options for managing cookies:</p>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    Browser Settings
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Most web browsers allow you to control cookies through their
                    settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-4">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Clear cookies when you close your browser</li>
                    <li>Delete specific cookies</li>
                  </ul>
                </div>
                <p>
                  Please note that if you disable cookies, some features of our
                  website may not function properly.
                </p>
              </div>
            </section>

            {/* Cookie Consent */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Cookie Consent
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  When you first visit our website, we will ask for your consent
                  to use non-essential cookies. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                  <li>Change your preferences at any time</li>
                </ul>
                <p>
                  You can update your cookie preferences by clicking the "Cookie
                  Settings" link in our website footer.
                </p>
              </div>
            </section>

            {/* Updates to This Policy */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Updates to This Policy
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time to reflect
                  changes in our practices or for legal, operational, or
                  regulatory reasons.
                </p>
                <p>
                  We will notify you of any material changes by posting the new
                  Cookie Policy on this page and updating the effective date.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Contact Us</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about this Cookie Policy or our use
                  of cookies, please contact us at:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <p className="font-medium text-black mb-2">Email:</p>
                  <p className="text-teal-600">cookies@Focus.com</p>
                  <p className="font-medium text-black mt-4 mb-2">Address:</p>
                  <p>
                    Focus Inc.
                    <br />
                    San Francisco, CA
                  </p>
                </div>
              </div>
            </section>
          </div>
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
