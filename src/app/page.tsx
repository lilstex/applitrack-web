"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Target,
  FileText,
  Download,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user has an active session token
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            Appli<span className="text-emerald-600">Track</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-0.5 leading-none">
            Apply better
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            /* Show Dashboard link if logged in */
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2">
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            /* Show Auth links if not logged in */
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100">
          <Sparkles size={16} />
          <span>AI-Powered Job Application Toolkit</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Optimize. Apply. Track. <br />
          <span className="text-emerald-600">Get Hired Faster.</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          AppliTrack helps you generate tailored resumes and cover letters for
          every job and track all your applications in one place. Stop guessing,
          stay organized, and apply smarter every day.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href={isLoggedIn ? "/generate" : "/signup"}>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-10 py-7 shadow-lg shadow-emerald-200"
            >
              Optimize My Resume <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Hero Trust Badges */}
        <div className="pt-16 flex flex-wrap justify-center gap-8 text-slate-400 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
            <CheckCircle size={16} className="text-emerald-500" /> ATS Optimized
          </div>
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
            <CheckCircle size={16} className="text-emerald-500" /> Recruiter
            Approved
          </div>
        </div>
      </section>

      {/* Supporting Value Section */}
      <section className="bg-slate-50 py-24 px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              Why AppliTrack?
            </h2>
            <p className="text-slate-600 text-lg">
              Everything you need to apply faster — without losing quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-emerald-700">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                Tailored Content
              </h3>
              <p className="text-slate-600">
                Automatically customize your CV and cover letter to match each
                job description using advanced AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-700">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                Tracking Dashboard
              </h3>
              <p className="text-slate-600">
                Track 10+ applications daily. Know where you applied, when, and
                what stage you’re in at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-orange-700">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                ATS Optimization
              </h3>
              <p className="text-slate-600">
                Improve your chances with AI-driven keyword matching and
                ATS-friendly formatting.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-purple-700">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                Fast Templates
              </h3>
              <p className="text-slate-600">
                Clean, recruiter-approved resume and cover letter templates
                designed for readability.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-slate-700">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                Instant PDF Export
              </h3>
              <p className="text-slate-600">
                Download polished resumes and cover letters in seconds,
                formatted exactly how hiring managers want them.
              </p>
            </div>

            {/* Final "CTA" Card */}
            <div className="bg-slate-900 p-8 rounded-2xl flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold mb-4 text-white">
                Ready to start?
              </h3>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} AppliTrack. Built for career growth.
      </footer>
    </div>
  );
}
