"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".scroll-blur-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.svg"
              alt="Planly"
              className="w-7 h-7 transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-semibold text-gray-900">Planly</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link
              href="#features"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#mission"
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
              className="px-4 py-2 rounded-lg bg-[var(--accent-teal)] text-white text-sm font-medium hover:bg-[var(--accent-teal-light)] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 grid-background overflow-hidden">
        {/* Hand-drawn sketch doodles */}
        <div
          className="doodle top-32 left-[8%] hidden lg:block"
          style={{ transform: "rotate(-12deg)" }}
        >
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
            <path
              d="M20 30 L30 10 L60 30 L50 50 L20 30"
              className="sketch-path"
              strokeWidth="2"
            />
            <path
              d="M35 25 L45 35 L35 45"
              className="sketch-path"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div
          className="doodle top-28 right-[10%] hidden lg:block"
          style={{ transform: "rotate(8deg)" }}
        >
          <svg width="80" height="80" viewBox="0 0 90 90" fill="none">
            <rect
              x="20"
              y="15"
              width="50"
              height="60"
              rx="4"
              className="sketch-path"
              strokeWidth="2"
            />
            <path
              d="M30 30 L60 30 M30 40 L60 40 M30 50 L55 50"
              className="sketch-path"
              strokeWidth="1.5"
            />
            <circle cx="25" cy="70" r="2.5" fill="#333" />
          </svg>
        </div>

        <div
          className="doodle bottom-32 left-[12%] hidden xl:block"
          style={{ transform: "rotate(-5deg)" }}
        >
          <svg width="60" height="60" viewBox="0 0 90 90" fill="none">
            <text
              x="5"
              y="55"
              fontSize="40"
              fontFamily="serif"
              fill="#333"
              opacity="0.5"
            >
              E=mc
              <tspan baselineShift="super" fontSize="24">2</tspan>
            </text>
          </svg>
        </div>

        <div
          className="doodle bottom-28 right-[15%] hidden lg:block"
          style={{ transform: "rotate(15deg)" }}
        >
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="30"
              r="10"
              className="sketch-path"
              strokeWidth="2"
            />
            <path
              d="M40 40 L40 52 M40 52 L32 60 M40 52 L48 60 M32 46 L40 46 L48 46"
              className="sketch-path"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div
          className="doodle top-[48%] left-[6%] hidden xl:block"
          style={{ transform: "rotate(-8deg)" }}
        >
          <svg width="55" height="55" viewBox="0 0 60 60" fill="none">
            <circle
              cx="30"
              cy="30"
              r="18"
              className="sketch-path"
              strokeWidth="2"
            />
            <path
              d="M30 20 L30 30 L38 34"
              className="sketch-path"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Extra doodles for richer background */}
        <div
          className="doodle top-40 left-[24%] hidden lg:block"
          style={{ transform: "rotate(6deg)" }}
        >
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
            <polygon points="10,40 40,10 70,40 40,70" className="sketch-path" strokeWidth="2" />
          </svg>
        </div>
        <div
          className="doodle top-[55%] right-[22%] hidden lg:block"
          style={{ transform: "rotate(-10deg)" }}
        >
          <svg width="60" height="60" viewBox="0 0 70 70" fill="none">
            <path d="M15 20 Q35 5 55 20 M15 30 Q35 15 55 30 M15 40 Q35 25 55 40" className="sketch-path" strokeWidth="2" />
          </svg>
        </div>
        <div
          className="doodle top-[35%] right-[6%] hidden xl:block"
          style={{ transform: "rotate(4deg)" }}
        >
          <svg width="60" height="60" viewBox="0 0 70 70" fill="none">
            <circle cx="35" cy="35" r="6" className="sketch-path" strokeWidth="2" />
            <line x1="35" y1="10" x2="35" y2="25" className="sketch-path" strokeWidth="2" />
            <line x1="35" y1="45" x2="35" y2="60" className="sketch-path" strokeWidth="2" />
            <line x1="10" y1="35" x2="25" y2="35" className="sketch-path" strokeWidth="2" />
            <line x1="45" y1="35" x2="60" y2="35" className="sketch-path" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-[1.15] tracking-tight animate-fade-in-up px-4 mt-8">
            The productivity tool that lives in your workflow.
          </h1>

          <p
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up px-4"
            style={{ animationDelay: "0.1s" }}
          >
            Stay focused, track progress, and achieve your goals. No switching
            apps, no losing momentum.
          </p>

          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-lg bg-[var(--accent-teal)] text-white text-sm font-medium hover:bg-[var(--accent-teal-light)] transition-all shadow-sm animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Start working smarter
          </Link>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-500 mb-12 text-lg font-medium">
            Loved by students at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16">
            {/* Stanford */}
            <div
              className="w-32 h-12 flex items-center justify-center animate-logo-blur"
              style={{ animationDelay: "0s" }}
            >
              <svg viewBox="0 0 200 60" className="w-full h-full">
                <text
                  x="100"
                  y="35"
                  fontSize="28"
                  fontFamily="serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#8C1515"
                >
                  Stanford
                </text>
              </svg>
            </div>

            {/* MIT */}
            <div
              className="w-24 h-12 flex items-center justify-center animate-logo-blur"
              style={{ animationDelay: "0.8s" }}
            >
              <svg viewBox="0 0 120 40" className="w-full h-full">
                <text
                  x="60"
                  y="25"
                  fontSize="22"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#A31F34"
                >
                  MIT
                </text>
              </svg>
            </div>

            {/* Harvard */}
            <div
              className="w-32 h-12 flex items-center justify-center animate-logo-blur"
              style={{ animationDelay: "1.6s" }}
            >
              <svg viewBox="0 0 180 50" className="w-full h-full">
                <text
                  x="90"
                  y="30"
                  fontSize="24"
                  fontFamily="serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#A51C30"
                >
                  Harvard
                </text>
              </svg>
            </div>

            {/* Berkeley */}
            <div
              className="w-36 h-12 flex items-center justify-center animate-logo-blur"
              style={{ animationDelay: "2.4s" }}
            >
              <svg viewBox="0 0 200 50" className="w-full h-full">
                <text
                  x="100"
                  y="30"
                  fontSize="22"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#003262"
                >
                  UC Berkeley
                </text>
              </svg>
            </div>

            {/* Yale */}
            <div
              className="w-24 h-12 flex items-center justify-center animate-logo-blur"
              style={{ animationDelay: "3.2s" }}
            >
              <svg viewBox="0 0 120 40" className="w-full h-full">
                <text
                  x="60"
                  y="25"
                  fontSize="24"
                  fontFamily="serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#00356B"
                >
                  Yale
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white scroll-blur-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5K+", label: "Active Users" },
              { number: "40K+", label: "Tasks Completed" },
              { number: "99.9%", label: "Uptime" },
              { number: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[var(--accent-teal)] mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white scroll-blur-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and boost your productivity instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your free account in seconds",
                icon: (
                  <svg
                    className="w-10 h-10 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Set Your Goals",
                desc: "Define what you want to achieve",
                icon: (
                  <svg
                    className="w-10 h-10 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Start Working",
                desc: "Use our tools to stay focused and productive",
                icon: (
                  <svg
                    className="w-10 h-10 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-8 text-center"
              >
                <div className="text-[var(--accent-teal)] mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-6 bg-white scroll-blur-section"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-gray-900 leading-tight">
            Everything you need, right where you work.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
            All your productivity tools in one place. No more switching between
            apps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Smart Timer",
                desc: "Pomodoro sessions that sync with your tasks",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ),
                title: "Task Management",
                desc: "Organize and prioritize your work effortlessly",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ),
                title: "Streak Tracking",
                desc: "Build habits with daily activity tracking",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                ),
                title: "Leaderboards",
                desc: "Stay motivated with friendly competition",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8l-8 8M8 8l8 8" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
                title: "Goal Setting",
                desc: "Track progress towards your objectives",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                ),
                title: "Focus Mode",
                desc: "Block distractions when you need deep work",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-7 text-left"
              >
                <div className="text-[var(--accent-teal)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white scroll-blur-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900">
              Loved by productive people
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about their productivity journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Product Designer",
                text: "Planly has completely transformed how I manage my day. The timer feature is a game-changer!",
                avatar: (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    SC
                  </div>
                ),
              },
              {
                name: "Alex Kumar",
                role: "Software Engineer",
                text: "Finally, a productivity tool that actually helps me stay focused. Love the streak tracking!",
                avatar: (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                    AK
                  </div>
                ),
              },
              {
                name: "Emma Wilson",
                role: "Student",
                text: "Perfect for balancing studies and personal projects. The leaderboard keeps me motivated!",
                avatar: (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-semibold">
                    EW
                  </div>
                ),
              },
            ].map((testimonial, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-teal)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white scroll-blur-section">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-gray-900 leading-tight">
            Learn more, spend less.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-16">
            Simple pricing that scales with you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Free</h3>
              <p className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-base text-gray-500 ml-1">USD/month</span>
              </p>
              <ul className="space-y-3 mb-6 mt-5">
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Basic Pomodoro timer
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Up to 10 tasks per day
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Basic streak tracking
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Simple notes
                  </span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block text-center w-full py-2.5 rounded-lg border-2 border-gray-200 text-gray-900 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-[var(--accent-teal)] rounded-xl p-6 text-left relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent-teal)] text-white text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Pro</h3>
              <p className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-base text-gray-500 ml-1">USD/month</span>
              </p>
              <p className="text-xs text-[var(--accent-teal)] font-medium mb-5">
                Students get 20% off with education email!
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Unlimited tasks & goals
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Advanced timer modes
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Detailed analytics & insights
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Priority support
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Export data & reports
                  </span>
                </li>
              </ul>
              <Link
                href="#"
                className="block text-center w-full py-2.5 rounded-lg bg-gray-300 text-white text-sm font-medium cursor-not-allowed opacity-70 pointer-events-none"
                aria-disabled
              >
                Unavailable
              </Link>
            </div>

            {/* Team Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Team</h3>
              <p className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$19.99</span>
                <span className="text-base text-gray-500 ml-1">USD/month</span>
              </p>
              <p className="text-xs text-[var(--accent-teal)] font-medium mb-5">
                Perfect for teams and organizations
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Everything in Pro +
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Team collaboration features
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Shared goals & projects
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Team leaderboards & stats
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Admin dashboard & controls
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-[var(--accent-teal)] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Custom integrations & API
                  </span>
                </li>
              </ul>
              <Link
                href="#"
                className="block text-center w-full py-2.5 rounded-lg border-2 border-gray-200 text-gray-400 text-sm font-medium cursor-not-allowed opacity-70 pointer-events-none"
                aria-disabled
              >
                Unavailable
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white scroll-blur-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Planly
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Planly really free?",
                a: "Yes! We offer a generous free plan with essential features. You can upgrade anytime to unlock advanced capabilities.",
              },
              {
                q: "Can I use Planly on multiple devices?",
                a: "Absolutely! Your data syncs across all your devices in real-time. Work from anywhere, anytime.",
              },
              {
                q: "How secure is my data?",
                a: "We take security seriously. All data is encrypted end-to-end and stored securely. We never share your information.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel anytime with no questions asked. You'll continue to have access until the end of your billing period.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-white scroll-blur-section">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-br from-teal-50/60 to-cyan-50/60 rounded-2xl p-12 md:p-16 border border-teal-100/50">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-900 leading-tight">
              Productivity that works for you. Not the other way around.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of people getting more done, every day.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-lg bg-[var(--accent-teal)] text-white text-sm font-medium hover:bg-[var(--accent-teal-light)] transition-all shadow-sm"
            >
              Try for free
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
              onClick={() => setIsContactModalOpen(false)}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-2">
                  Contact Us
                </h3>
                <p className="text-gray-600 text-sm">
                  Reach out to the Planly team here!
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Select Subject</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing</option>
                    <option>Feature Request</option>
                  </select>
                  <input
                    type="text"
                    placeholder="No Subject..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Your Questions, Comments, Concerns..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                ></textarea>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-left text-gray-600 hover:text-teal-600 hover:underline transition-all text-base cursor-pointer"
                >
                  Contact Us
                </button>
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
