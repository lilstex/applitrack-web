import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { CreditPlan, PaymentGateway } from "@/types";

interface PricingCardProps {
  plan: CreditPlan;
  gateway: PaymentGateway;
  loading: boolean;
  onSelect: (planSlug: string) => void;
}

export function PricingCard({
  plan,
  gateway,
  loading,
  onSelect,
}: PricingCardProps) {
  const isPro = plan.slug === "pro-pack";
  const price =
    gateway === PaymentGateway.PAYSTACK
      ? `₦${plan.priceNgn.toLocaleString()}`
      : `$${plan.priceUsd}`;

  return (
    <div
      className={`relative flex flex-col p-6 bg-white rounded-2xl border ${
        isPro
          ? "border-emerald-500 shadow-xl scale-105 z-10"
          : "border-slate-200"
      }`}
    >
      {isPro && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase py-1 px-3 rounded-full">
          Most Popular
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
        <p className="text-3xl font-extrabold text-slate-900 mt-2">{price}</p>
        <p className="text-sm text-slate-500">{plan.credits} AI Credits</p>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Check size={16} className="text-emerald-500" /> Tailored CV
          Generation
        </li>
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Check size={16} className="text-emerald-500" /> ATS Optimization
        </li>
      </ul>

      <Button
        onClick={() => onSelect(plan.slug)}
        disabled={loading}
        className={`w-full ${
          isPro ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900"
        }`}
      >
        {loading ? "Processing..." : "Get Started"}
      </Button>
    </div>
  );
}
