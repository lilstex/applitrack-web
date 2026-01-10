"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Target,
  FileText,
  Download,
  Zap,
  Check,
  Loader2,
} from "lucide-react";
import { CreditPlan } from "@/types";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    // Check if user has an active session token
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }

    // Fetch dynamic plans from backend
    const fetchPlans = async () => {
      try {
        const { data } = await apiClient.get("/payment/plans");
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
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
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2">
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
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
          <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
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

      {/* Pricing Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Pricing
          </div>
          <h2 className="text-4xl font-bold text-slate-900">
            Simple, Credit-Based Pricing
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Buy credits only when you need
            them and use them whenever you apply.
          </p>
        </div>

        {loadingPlans ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative flex flex-col p-8 rounded-3xl border transition-all ${
                  plan.slug === "pro-pack"
                    ? "border-emerald-500 shadow-xl shadow-emerald-100 ring-1 ring-emerald-500/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.slug === "pro-pack" && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-md">
                    Recommended
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">
                      ${plan.priceUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <Zap size={14} fill="currentColor" /> {plan.credits} Token
                    Credits
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Tailored CV Generation",
                    "Professional Cover Letters",
                    "ATS Keyword Match",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-sm text-slate-600 font-medium"
                    >
                      <Check size={18} className="text-emerald-500" /> {feat}
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    className={`w-full py-7 rounded-2xl font-bold text-base ${
                      plan.slug === "pro-pack"
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 text-center text-slate-400 text-sm border-t border-slate-100">
        © {new Date().getFullYear()} AppliTrack. Built for career growth.
      </footer>
    </div>
  );
}
