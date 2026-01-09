import { ApplicationStatus } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns Tailwind CSS classes based on the application status.
 * Optimized for Shadcn/UI Badge consistency.
 */
export const getStatusStyles = (status: ApplicationStatus | string) => {
  switch (status) {
    case ApplicationStatus.HIRED:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case ApplicationStatus.INTERVIEWING:
      return "bg-purple-50 text-purple-700 border-purple-200";
    case ApplicationStatus.OFFERED:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case ApplicationStatus.APPLIED:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case ApplicationStatus.REJECTED:
      return "bg-red-50 text-red-700 border-red-200";
    case ApplicationStatus.GENERATED:
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};
