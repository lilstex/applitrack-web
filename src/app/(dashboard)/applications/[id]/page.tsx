/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, use } from "react";
import { apiClient } from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit3,
  Save,
  Printer,
  ArrowLeft,
  Layout,
  CheckCircle,
  FileText,
  Type,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ViewApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [app, setApp] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [template, setTemplate] = useState("modern");

  // Fetch application data
  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await apiClient.get(`/application/${id}`);
        setApp(res.data);
      } catch (error) {
        toast.error("Failed to load application data");
      }
    };
    fetchApp();
  }, [id]);

  const handleSave = async () => {
    try {
      await apiClient.patch(`/application/${id}`, app);
      setIsEditing(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const handlePrint = () => window.print();

  if (!app)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Action Bar - Sticky */}
      <div className="flex justify-between items-center print:hidden bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-20">
        <Link
          href="/dashboard"
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={
              isEditing
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "text-slate-600"
            }
          >
            <Edit3 size={16} className="mr-2" />{" "}
            {isEditing ? "Exit Editor" : "Edit Content"}
          </Button>
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          ) : (
            <Button onClick={handlePrint} className="bg-slate-900 text-white">
              <Printer size={16} className="mr-2" /> Print / Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Template Selection (Hidden in Edit Mode) */}
        <div
          className={`lg:col-span-1 space-y-6 print:hidden ${
            isEditing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layout size={18} className="text-emerald-600" /> Choose Template
            </h3>
            <p className="text-xs text-slate-500">
              Select a design for your resume.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "modern",
                name: "Modern Minimal",
                color: "bg-emerald-500",
                desc: "Clean with emerald accents",
              },
              {
                id: "corporate",
                name: "Executive Serif",
                color: "bg-slate-900",
                desc: "Formal and traditional",
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all group ${
                  template === t.id
                    ? "border-emerald-500 bg-emerald-50/50 shadow-md"
                    : "border-white bg-white hover:border-slate-200 shadow-sm"
                }`}
              >
                <div className={`w-10 h-1.5 ${t.color} mb-3 rounded-full`} />
                <div className="font-bold text-sm text-slate-900">{t.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                  {t.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Document Preview & Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="resume" className="w-full">
            <div className="flex justify-between items-center print:hidden mb-6 bg-slate-100 p-1 rounded-lg w-fit">
              <TabsList className="bg-transparent">
                <TabsTrigger value="resume" className="px-8 flex gap-2">
                  <FileText size={16} /> Resume
                </TabsTrigger>
                <TabsTrigger value="cover-letter" className="px-8 flex gap-2">
                  <Type size={16} /> Cover Letter
                </TabsTrigger>
              </TabsList>
            </div>

            {/* RESUME CONTENT */}
            <TabsContent value="resume" className="mt-0 focus-visible:ring-0">
              <div
                className={`bg-white shadow-2xl mx-auto min-h-[1123px] transition-all duration-300 print:shadow-none print:m-0 ${
                  template === "modern"
                    ? "p-12"
                    : "p-16 border-t-[12px] border-slate-900"
                }`}
              >
                {isEditing ? (
                  <ResumeEditor app={app} setApp={setApp} />
                ) : (
                  <ResumeTemplate data={app} template={template} />
                )}
              </div>
            </TabsContent>

            {/* COVER LETTER CONTENT */}
            <TabsContent
              value="cover-letter"
              className="mt-0 focus-visible:ring-0"
            >
              <div className="bg-white shadow-2xl p-16 mx-auto min-h-[1123px] print:shadow-none print:m-0">
                {isEditing ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">
                      Edit Cover Letter
                    </h3>
                    <Textarea
                      value={app.generatedCoverLetter}
                      onChange={(e) =>
                        setApp({ ...app, generatedCoverLetter: e.target.value })
                      }
                      className="min-h-[800px] text-lg leading-relaxed focus:ring-emerald-500"
                    />
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap text-lg leading-relaxed text-slate-800">
                    {app.generatedCoverLetter}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function ResumeEditor({ app, setApp }: any) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg border-l-4 border-emerald-500 pl-3">
          Professional Summary
        </h3>
        <Textarea
          value={app.generatedCvData.professionalSummary}
          onChange={(e) =>
            setApp({
              ...app,
              generatedCvData: {
                ...app.generatedCvData,
                professionalSummary: e.target.value,
              },
            })
          }
          className="h-40 text-base leading-relaxed"
        />
      </section>

      <section className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500 text-sm text-center">
          Experience highlights and skills are pulled from your{" "}
          <strong>Master Profile</strong>. Edit them there to update all future
          applications.
        </p>
      </section>
    </div>
  );
}

function ResumeTemplate({ data, template }: { data: any; template: string }) {
  const { professionalSummary, refinedExperience, relevantSkills } =
    data.generatedCvData;

  const isModern = template === "modern";

  return (
    <div className={isModern ? "font-sans" : "font-serif"}>
      {/* Header */}
      <header
        className={`mb-10 ${
          isModern
            ? "border-b-4 border-emerald-500 pb-8"
            : "text-center border-b pb-10"
        }`}
      >
        <h1
          className={`${
            isModern ? "text-5xl font-black" : "text-4xl font-bold"
          } uppercase tracking-tighter text-slate-900`}
        >
          {data.companyName} Application
        </h1>
        <p
          className={`${
            isModern
              ? "text-emerald-600 tracking-[0.3em] font-black"
              : "text-slate-500 italic"
          } mt-2 uppercase text-sm`}
        >
          {data.jobTitle}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Body */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2
              className={`text-xs font-black uppercase tracking-widest mb-4 ${
                isModern ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              Professional Profile
            </h2>
            <p className="text-slate-700 leading-relaxed text-[15px]">
              {professionalSummary}
            </p>
          </section>

          <section>
            <h2
              className={`text-xs font-black uppercase tracking-widest mb-6 ${
                isModern ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              Relevant Experience
            </h2>
            {refinedExperience.map((exp: any, i: number) => (
              <div key={i} className="mb-8 last:mb-0">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {exp.role}
                  </h3>
                  <span className="text-sm font-bold text-slate-400">
                    {exp.company}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((h: string, j: number) => (
                    <li
                      key={j}
                      className="text-[14px] text-slate-600 flex gap-2"
                    >
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <section className={isModern ? "bg-slate-50 p-6 rounded-2xl" : ""}>
            <h2
              className={`text-xs font-black uppercase tracking-widest mb-4 ${
                isModern ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              Core Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {relevantSkills.map((skill: string) => (
                <span
                  key={skill}
                  className={`${
                    isModern
                      ? "bg-white border text-slate-700"
                      : "bg-slate-900 text-white"
                  } px-3 py-1 text-[11px] rounded-md font-bold uppercase tracking-wider`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
