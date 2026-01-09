import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AppliTrack | Smarter resumes. Organized applications.",
  description:
    "Generate tailored resumes and cover letters in seconds. No spreadsheets. No guesswork. Just organized job applications.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased font-sans bg-slate-50 text-slate-900"
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
