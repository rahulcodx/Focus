"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-lg">
              Effective Date: Monday, July 28th, 2025
            </p>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <h2 className="text-xl text-gray-600 font-medium">
              How we collect, use, and protect your information
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
                  Planly is a provider of AI-assisted productivity tools and
                  infrastructure.
                </p>
                <p>
                  We understand that you care about your personal privacy
                  interests, and we take that seriously. This Privacy Notice
                  describes Planly's policies and practices regarding its
                  collection and use of your personal data and sets forth your
                  privacy rights. We recognize that information privacy is an
                  ongoing responsibility and will update this Privacy Notice as
                  we adopt new personal data practices.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Information We Collect
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, use our services, or contact us
                  for support.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Content you create using our services</li>
                  <li>Communications with our support team</li>
                  <li>
                    Payment information (processed by third-party providers)
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                How We Use Your Information
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize your experience</li>
                  <li>Monitor and analyze usage patterns</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Information Sharing
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy.
                </p>
                <p>
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Data Security
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
                <p>
                  However, no internet transmission is completely secure, and we
                  cannot guarantee absolute security of your data.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">
                Your Rights
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Contact Us</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us at:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <p className="font-medium text-black mb-2">Email:</p>
                  <p className="text-teal-600">privacy@planly.com</p>
                  <p className="font-medium text-black mt-4 mb-2">Address:</p>
                  <p>
                    Planly Inc.
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
