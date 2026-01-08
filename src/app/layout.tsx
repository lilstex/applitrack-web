import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppliTrack | Smarter resumes. Organized applications.",
  description:
    "Generate tailored resumes and cover letters in seconds. No spreadsheets. No guesswork. Just organized job applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
