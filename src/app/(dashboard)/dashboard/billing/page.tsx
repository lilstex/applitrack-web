"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Globe, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PaymentGateway, CreditPlan } from "@/types";

export default function BillingPage() {
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState<PaymentGateway>(
    PaymentGateway.PAYSTACK
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await apiClient.get("/payment/plans");
        setPlans(data);
      } catch (error) {
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleTopUp = async (planSlug: string) => {
    setProcessingId(planSlug);
    try {
      const response = await apiClient.post("/payment/top-up", {
        gateway,
        planId: planSlug,
      });

      const data = response.data;

      // Paystack uses 'authorization_url', Stripe usually uses 'url'
      const redirectUrl = data.authorization_url || data.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error("No redirection URL found");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Could not initiate payment. Please try again.");
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold uppercase tracking-wider">
          Pricing Plans
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Ready to boost your career?
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Select a credit pack to start generating ATS-optimized resumes and
          cover letters tailored to your dream jobs.
        </p>

        {/* Gateway Toggle */}
        <div className="flex items-center justify-center pt-6">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setGateway(PaymentGateway.PAYSTACK)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                gateway === PaymentGateway.PAYSTACK
                  ? "bg-white text-emerald-600 shadow-md ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CreditCard size={18} /> Nigeria (NGN)
            </button>
            <button
              onClick={() => setGateway(PaymentGateway.STRIPE)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                gateway === PaymentGateway.STRIPE
                  ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Globe size={18} /> International (USD)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <PricingCard
            key={plan._id}
            plan={plan}
            gateway={gateway}
            isProcessing={processingId === plan.slug}
            onPurchase={() => handleTopUp(plan.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan, gateway, isProcessing, onPurchase }: any) {
  const isPro = plan.slug === "pro-pack";

  return (
    <Card
      className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:translate-y-[-4px] ${
        isPro
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-900/5"
          : "border-slate-200 shadow-sm"
      }`}
    >
      {isPro && (
        <div className="bg-emerald-500 text-white text-[10px] font-black uppercase py-1.5 text-center tracking-[0.2em]">
          Recommended
        </div>
      )}
      <CardContent className="p-8 flex flex-col flex-1">
        <div className="mb-8">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-2">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900">
              {gateway === PaymentGateway.PAYSTACK
                ? `₦${plan.priceNgn.toLocaleString()}`
                : `$${plan.priceUsd}`}
            </span>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold">
            <Zap size={14} className="text-amber-500" fill="currentColor" />
            {plan.credits} AI Credits
          </div>
        </div>

        <div className="space-y-4 mb-10 flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            What&rsquo;s included:
          </p>
          <ul className="space-y-4">
            {[
              "Tailored CV Generation",
              "Professional Cover Letters",
              "ATS Keyword Optimization",
              "Unlimited Exports",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-slate-600 leading-tight"
              >
                <div className="mt-0.5 rounded-full bg-emerald-100 p-0.5">
                  <Check size={14} className="text-emerald-600" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={onPurchase}
          disabled={isProcessing}
          className={`w-full rounded-2xl font-bold py-7 text-base shadow-lg transition-all ${
            isPro
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Initializing...
            </span>
          ) : (
            "Select Plan"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
