"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-gray-500 text-lg">
              Effective Date: Monday, July 28th, 2025
            </p>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <h2 className="text-xl text-gray-600 font-medium">
              Terms and conditions for using our platform
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
                  Welcome to Focus. These Terms of Service ("Terms") govern
                  your use of our productivity platform and services.
                </p>
                <p>
                  By accessing or using Focus, you agree to be bound by these
                  Terms. If you disagree with any part of these terms, then you
                  may not access the service.
                </p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Acceptance of Terms
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  By creating an account or using our services, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. We
                  will notify you of any changes by posting the new Terms on
                  this page.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Description of Service
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Focus provides:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Task management and organization tools</li>
                  <li>Time tracking and productivity analytics</li>
                  <li>Goal setting and progress monitoring</li>
                  <li>AI-powered productivity assistance</li>
                  <li>Team collaboration features</li>
                  <li>Data synchronization across devices</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                User Accounts
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To use certain features of our service, you must create an
                  account. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and complete information</li>
                </ul>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Acceptable Use
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any harmful or malicious content</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access the service</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Intellectual Property
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  Focus and its licensors.
                </p>
                <p>
                  You retain ownership of any content you create using our
                  services. By using our service, you grant us a license to use,
                  store, and display your content as necessary to provide the
                  service.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Payment Terms
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Some features of our service are provided for free, while
                  others require payment. Paid services are billed in advance on
                  a monthly or annual basis.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>Prices are subject to change with notice</li>
                  <li>Payment is due at the time of purchase</li>
                  <li>We may suspend access for non-payment</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Termination
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason, including breach of
                  these Terms.
                </p>
                <p>
                  Upon termination, your right to use the service will cease
                  immediately. You may delete your account at any time.
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Disclaimer</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The service is provided on an "AS IS" and "AS AVAILABLE"
                  basis. We make no warranties, expressed or implied, and hereby
                  disclaim all other warranties.
                </p>
                <p>
                  We do not warrant that the service will be uninterrupted,
                  secure, or error-free.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Contact Us</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <p className="font-medium text-black mb-2">Email:</p>
                  <p className="text-teal-600">legal@Focus.com</p>
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
