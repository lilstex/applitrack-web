"use client";

import { useState } from "react";
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

  const { register, handleSubmit } = useForm<GenerateFormInputs>();

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
      toast.error("Generation Failed", {
        description: errorMsg,
      });
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
      <div className="space-y-6 overflow-y-auto pr-2">
        <h1 className="text-3xl font-bold text-slate-900">CV Generator</h1>
        <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-slate-500">
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                {...register("title")}
                placeholder="Job Title (e.g. Senior Backend Engineer)"
                className="focus:ring-emerald-500"
                required
              />
              <Input
                {...register("company")}
                placeholder="Company (e.g. Google)"
                className="focus:ring-emerald-500"
                required
              />
              <Textarea
                {...register("description")}
                placeholder="Paste the full Job Description here..."
                className="min-h-[300px] resize-none focus:ring-emerald-500"
                required
              />
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                    with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-emerald-400" />{" "}
                    Optimize My CV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto p-8 relative">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p>Your tailored CV and Cover Letter will appear here.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">
              Brewing a perfect resume...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-lg border border-emerald-100 sticky top-0 z-10 shadow-sm">
              <div className="text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle size={18} /> Ready to Download
              </div>
              <Button
                onClick={() => downloadPdf(result._id)}
                className="bg-emerald-600 hover:bg-emerald-700 shadow-md text-white"
              >
                <FileDown size={18} className="mr-2" /> Download PDF
              </Button>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-slate-900">
                AI-Optimized Summary
              </h3>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result.generatedCvData?.professionalSummary}
              </div>

              <h3 className="text-lg font-bold mt-8 text-slate-900">
                Cover Letter Strategy
              </h3>
              <p className="text-slate-600 italic border-l-4 border-emerald-200 pl-4 py-2">
                &quot;The AI has crafted a cover letter focusing on your{" "}
                {result.generatedCvData?.relevantSkills?.join(", ") ||
                  "core strengths"}
                ...&quot;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
