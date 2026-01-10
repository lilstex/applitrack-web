"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/app/components/Sidebar";

// Global listener for payment redirects
function PaymentListener() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const { mutateUser } = useAuth();

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Payment successful! Your credits have been updated.");
      mutateUser();
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled.");
    }
  }, [paymentStatus, mutateUser]);

  return null;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isError } = useAuth();
  const token = Cookies.get("token");

  // Auth Guard Logic
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Loading State (Centered)
  if (!token || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="text-slate-400 font-medium text-sm">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  // Main Dashboard Shell
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Suspense fallback={null}>
        <PaymentListener />
      </Suspense>

      <Sidebar user={user} />

      <main className="flex-1 w-full lg:pl-64 pt-16 lg:pt-0 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
