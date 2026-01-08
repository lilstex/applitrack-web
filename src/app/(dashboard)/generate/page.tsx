"use client";

import { useState, useEffect, useRef } from "react"; // Added useEffect/useRef
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileDown, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Application } from "@/types";

interface GenerateFormInputs {
  title: string;
  company: string;
  description: string;
}

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Application | null>(null);
  const resultRef = useRef<HTMLDivElement>(null); // Ref for mobile scrolling

  const { register, handleSubmit } = useForm<GenerateFormInputs>();

  // Auto-scroll to result on mobile when generated
  useEffect(() => {
    if (result && window.innerWidth < 1024) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const onGenerate = async (data: GenerateFormInputs) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await apiClient.post("/application/generate", data);

      if (response.data.isDuplicate) {
        toast.info("Existing CV Found", {
          description:
            "You've already optimized for this job. Loading previous version.",
        });
        setResult(response.data.data as Application);
      } else {
        toast.success("Resume Optimized!", {
          description: "AI has successfully tailored your CV to this JD.",
        });
        setResult(response.data as Application);
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Check your OpenAI credits.";
      toast.error("Generation Failed", { description: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (appId: string) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Session Expired", { description: "Please log in again." });
      return;
    }
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/application/download/${appId}?token=${token}`,
      "_blank"
    );
  };

  return (
    /* Changed fixed height to min-h-screen for mobile flexibility */
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-120px)]">
      {/* Input Section */}
      <div className="space-y-6 overflow-y-auto lg:pr-2 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            CV Generator
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Paste the job details to optimize your resume instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase text-slate-400">
                Target Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("title")}
                  placeholder="Job Title"
                  className="focus:ring-emerald-500 h-11"
                  required
                />
                <Input
                  {...register("company")}
                  placeholder="Company"
                  className="focus:ring-emerald-500 h-11"
                  required
                />
              </div>
              <Textarea
                {...register("description")}
                placeholder="Paste the full Job Description here..."
                className="min-h-[250px] lg:min-h-[300px] resize-none focus:ring-emerald-500 text-sm md:text-base"
                required
              />
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 transition-all h-12 text-base shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-400" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 text-emerald-400" />
                    Optimize My CV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Result Section */}
      <div
        ref={resultRef}
        className="bg-white rounded-xl border border-slate-200 shadow-sm lg:overflow-y-auto p-6 md:p-8 relative min-h-[400px] lg:h-full"
      >
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 lg:py-0 text-slate-400">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p className="max-w-xs mx-auto">
              Your tailored CV and Cover Letter will appear here after
              generation.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-12 lg:py-0">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium animate-pulse">
              Brewing a perfect resume...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100 sticky top-0 z-10 shadow-sm gap-3">
              <div className="text-emerald-800 font-bold flex items-center gap-2 text-sm md:text-base">
                <CheckCircle size={18} className="text-emerald-600" /> Ready to
                Download
              </div>
              <Button
                onClick={() => downloadPdf(result._id)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md text-white font-bold"
              >
                <FileDown size={18} className="mr-2" /> Download PDF
              </Button>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">
                  AI-Optimized Summary
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                  {result.generatedCvData?.professionalSummary}
                </div>
              </section>

              <section className="space-y-3 mt-8">
                <h3 className="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">
                  Cover Letter Strategy
                </h3>
                <div className="text-slate-600 italic bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50 text-sm md:text-base">
                  &quot;The AI has crafted a cover letter focusing on your{" "}
                  <span className="font-bold text-emerald-700">
                    {result.generatedCvData?.relevantSkills
                      ?.slice(0, 3)
                      .join(", ") || "core strengths"}
                  </span>
                  ...&quot;
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
