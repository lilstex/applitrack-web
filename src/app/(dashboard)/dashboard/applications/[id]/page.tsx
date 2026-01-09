"use client";

import { useEffect, useState, use, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Edit3,
  Save,
  FileDown,
  ArrowLeft,
  Layout,
  FileText,
  Type,
  Calendar,
  Plus,
  Trash2,
  User as UserIcon,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Application, ApplicationStatus, CVData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getStatusStyles } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
type CVDataArraySections = "refinedExperience" | "education" | "certifications";

interface EditorProps {
  app: Application;
  setApp: React.Dispatch<React.SetStateAction<Application | null>>;
}

interface TemplateProps {
  data: Application;
  template: string;
  userName: string;
}

export default function ViewApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [userName, setUserName] = useState("Candidate Name");
  const [isEditing, setIsEditing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState("modern");

  const loadWorkspace = useCallback(async () => {
    if (!id) return;
    setFetching(true);
    try {
      const [appRes, profileRes] = await Promise.all([
        apiClient.get(`/application/${id}`),
        apiClient.get("/profile"),
      ]);
      setApp(appRes.data);
      setUserName(profileRes.data.fullName);
    } catch {
      toast.error("Failed to load workspace data");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleSave = async () => {
    if (!app) return;
    try {
      await apiClient.patch(`/application/${id}`, app);
      setIsEditing(false);
      toast.success("Changes saved successfully");
    } catch {
      toast.error("Failed to save changes");
    }
  };

  const handleDownload = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setDownloading(true);
    try {
      // Fetch the PDF as a blob to prevent page redirection
      const response = await apiClient.get(
        `/application/download/${id}?template=${template}`,
        {
          responseType: "blob",
        }
      );

      // Create a temporary URL for the downloaded blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Programmatically trigger the browser download
      const link = document.createElement("a");
      link.href = url;

      // Construct filename using company name or default
      const fileName = `CV_${
        app?.companyName?.replace(/\s/g, "_") || "Application"
      }.pdf`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      console.error("PDF download failed", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await apiClient.patch(`/application/${id}/status`, { status: newStatus });

      setApp((prev) => (prev ? { ...prev, status: newStatus } : null));

      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (fetching)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="text-slate-500 font-medium">Preparing Detail...</p>
      </div>
    );

  if (!app)
    return <div className="p-10 text-center">Application not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 md:px-0">
      {/* Responsive Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-20 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 leading-none mb-1 text-sm md:text-base">
              {app.companyName}
            </h2>
            {/* Dropdown for Status Change */}
            <select
              value={app.status}
              onChange={(e) =>
                handleStatusUpdate(e.target.value as ApplicationStatus)
              }
              className={`text-[10px] uppercase font-bold border rounded px-2 py-0.5 cursor-pointer outline-none transition-colors ${getStatusStyles(
                app.status
              )}`}
            >
              <option value={ApplicationStatus.GENERATED}>Generated</option>
              <option value={ApplicationStatus.APPLIED}>Applied</option>
              <option value={ApplicationStatus.INTERVIEWING}>
                Interviewing
              </option>
              <option value={ApplicationStatus.OFFERED}>Offer Received</option>
              <option value={ApplicationStatus.HIRED}>Hired</option>
              <option value={ApplicationStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex-1 sm:flex-none ${
              isEditing
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "text-slate-600"
            }`}
          >
            <Edit3 size={16} className="mr-2" />
            <span className="hidden sm:inline">
              {isEditing ? "Exit" : "Edit"}
            </span>
          </Button>

          {isEditing ? (
            <Button
              onClick={handleSave}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save size={16} className="mr-2" /> Save
            </Button>
          ) : (
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 sm:flex-none bg-slate-900 text-white"
            >
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileDown size={16} className="mr-2" />
              )}
              Download
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Responsive Sidebar - Moves to bottom on mobile, stays left on desktop */}
        <div
          className={`order-2 lg:order-1 lg:col-span-1 space-y-6 print:hidden ${
            isEditing ? "hidden lg:block opacity-40 pointer-events-none" : ""
          }`}
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layout size={18} className="text-emerald-600" /> Template
            </h3>
            <p className="text-xs text-slate-500">
              Select your preferred style.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {["modern", "corporate"].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  template === t
                    ? "border-emerald-500 bg-emerald-50/50 shadow-md"
                    : "border-white bg-white hover:border-slate-200 shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-1.5 ${
                    t === "modern" ? "bg-emerald-500" : "bg-slate-900"
                  } mb-3 rounded-full`}
                />
                <div className="font-bold text-sm capitalize">{t}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Document Pane - Main Focus */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-lg w-full sm:w-fit mb-6">
              <TabsTrigger value="resume" className="flex-1 sm:px-8">
                <FileText size={16} className="mr-2" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="cover-letter" className="flex-1 sm:px-8">
                <Type size={16} className="mr-2" />
                Letter
              </TabsTrigger>
              <TabsTrigger value="job-info" className="flex-1 sm:px-8">
                Job Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume" className="mt-0">
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div
                  className={`bg-white shadow-xl mx-auto min-w-[320px] transition-all duration-300 ${
                    template === "modern"
                      ? "p-6 md:p-12"
                      : "p-8 md:p-16 border-t-[12px] border-slate-900"
                  }`}
                >
                  {isEditing ? (
                    <ResumeEditor app={app} setApp={setApp} />
                  ) : (
                    <ResumeTemplate
                      data={app}
                      template={template}
                      userName={userName}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cover-letter" className="mt-0">
              <div className="bg-white shadow-xl p-8 md:p-16 mx-auto min-h-[500px] sm:min-h-[1123px]">
                {isEditing ? (
                  <Textarea
                    value={app.generatedCoverLetter}
                    onChange={(e) =>
                      setApp({ ...app, generatedCoverLetter: e.target.value })
                    }
                    className="min-h-[400px] md:min-h-[800px] text-base md:text-lg leading-relaxed"
                  />
                ) : (
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base md:text-lg text-slate-800 leading-relaxed">
                    {app.generatedCoverLetter}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="job-info">
              <Card className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {app.jobTitle} at {app.companyName}
                </h3>
                <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                  {app.rawJobDescription}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- TYPE-SAFE EDITOR ---
function ResumeEditor({ app, setApp }: EditorProps) {
  const updateData = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    setApp((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        generatedCvData: { ...prev.generatedCvData, [field]: value },
      };
    });
  };

  const updateArray = (
    section: CVDataArraySections,
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const currentArray = app.generatedCvData[section] || [];
    const newArray = [...currentArray] as any[];
    newArray[index] = { ...newArray[index], [field]: value };
    updateData(section, newArray);
  };

  const removeItem = (section: CVDataArraySections, index: number) => {
    const currentArray = (app.generatedCvData[section] || []) as any[];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateData(section, newArray);
  };

  return (
    <div className="space-y-12 pb-10">
      <section className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2 text-slate-800">
          <UserIcon size={18} /> Professional Summary
        </h3>
        <Textarea
          value={app.generatedCvData.professionalSummary}
          onChange={(e) => updateData("professionalSummary", e.target.value)}
          className="h-32 focus:ring-emerald-500"
        />
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-lg text-slate-800">Experience</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateData("refinedExperience", [
                ...app.generatedCvData.refinedExperience,
                {
                  role: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  highlights: [],
                },
              ])
            }
            className="text-emerald-600 border-emerald-200"
          >
            <Plus size={14} className="mr-1" /> Add Job
          </Button>
        </div>
        {app.generatedCvData.refinedExperience.map((exp, i) => (
          <div
            key={i}
            className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50 relative group"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
              onClick={() => removeItem("refinedExperience", i)}
            >
              <Trash2 size={16} />
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={exp.role}
                onChange={(e) =>
                  updateArray("refinedExperience", i, "role", e.target.value)
                }
                placeholder="Role"
              />
              <Input
                value={exp.company}
                onChange={(e) =>
                  updateArray("refinedExperience", i, "company", e.target.value)
                }
                placeholder="Company"
              />
              <Input
                value={exp.startDate}
                onChange={(e) =>
                  updateArray(
                    "refinedExperience",
                    i,
                    "startDate",
                    e.target.value
                  )
                }
                placeholder="Start Date"
              />
              <Input
                value={exp.endDate}
                onChange={(e) =>
                  updateArray("refinedExperience", i, "endDate", e.target.value)
                }
                placeholder="End Date"
              />
            </div>
            <Textarea
              value={exp.highlights.join("\n")}
              onChange={(e) =>
                updateArray(
                  "refinedExperience",
                  i,
                  "highlights",
                  e.target.value.split("\n")
                )
              }
              placeholder="Highlights (One per line)"
            />
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-slate-800">Education</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateData("education", [
                  ...(app.generatedCvData.education || []),
                  { degree: "", school: "", year: "" },
                ])
              }
            >
              <Plus size={14} />
            </Button>
          </div>
          {app.generatedCvData.education?.map((edu, i) => (
            <div
              key={i}
              className="space-y-2 p-3 border rounded-lg relative group bg-white"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 text-red-400 opacity-0 group-hover:opacity-100"
                onClick={() => removeItem("education", i)}
              >
                <Trash2 size={12} />
              </Button>
              <Input
                value={edu.degree}
                onChange={(e) =>
                  updateArray("education", i, "degree", e.target.value)
                }
                placeholder="Degree"
                className="h-8"
              />
              <Input
                value={edu.school}
                onChange={(e) =>
                  updateArray("education", i, "school", e.target.value)
                }
                placeholder="School"
                className="h-8"
              />
              <Input
                value={edu.year}
                onChange={(e) =>
                  updateArray("education", i, "year", e.target.value)
                }
                placeholder="Year"
                className="h-8"
              />
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-slate-800">Certifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateData("certifications", [
                  ...(app.generatedCvData.certifications || []),
                  { title: "", issuer: "", date: "" },
                ])
              }
            >
              <Plus size={14} />
            </Button>
          </div>
          {app.generatedCvData.certifications?.map((cert, i) => (
            <div
              key={i}
              className="space-y-2 p-3 border rounded-lg relative group bg-white"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 text-red-400 opacity-0 group-hover:opacity-100"
                onClick={() => removeItem("certifications", i)}
              >
                <Trash2 size={12} />
              </Button>
              <Input
                value={cert.title}
                onChange={(e) =>
                  updateArray("certifications", i, "title", e.target.value)
                }
                placeholder="Title"
                className="h-8"
              />
              <Input
                value={cert.issuer}
                onChange={(e) =>
                  updateArray("certifications", i, "issuer", e.target.value)
                }
                placeholder="Issuer"
                className="h-8"
              />
              <Input
                value={cert.date}
                onChange={(e) =>
                  updateArray("certifications", i, "date", e.target.value)
                }
                placeholder="Date"
                className="h-8"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// --- RESUME TEMPLATE ---
function ResumeTemplate({ data, template, userName }: TemplateProps) {
  const {
    professionalSummary,
    refinedExperience,
    relevantSkills,
    education,
    certifications,
  } = data.generatedCvData;
  const isModern = template === "modern";

  return (
    <div className={`${isModern ? "font-sans" : "font-serif"} text-slate-900`}>
      <header
        className={`mb-10 ${
          isModern
            ? "border-b-8 border-emerald-500 pb-8"
            : "text-center border-b-2 pb-10"
        }`}
      >
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
          {userName}
        </h1>
        <p
          className={`${
            isModern
              ? "text-emerald-600 font-black tracking-widest"
              : "text-slate-500 italic"
          } uppercase text-sm`}
        >
          {data.jobTitle}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Profile
            </h2>
            <p className="leading-relaxed text-[15px] text-slate-700">
              {professionalSummary}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-6">
              Experience
            </h2>
            {refinedExperience.map((exp, i) => (
              <div key={i} className="mb-8 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{exp.role}</h3>
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                    <Calendar size={12} /> {exp.startDate} — {exp.endDate}
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-600 uppercase mb-3">
                  {exp.company}
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="text-[14px] text-slate-600 flex gap-2"
                    >
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        <div className="space-y-10">
          <section
            className={
              isModern
                ? "bg-slate-50 p-6 rounded-2xl border border-slate-100"
                : ""
            }
          >
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {relevantSkills.map((s) => (
                <span
                  key={s}
                  className="bg-white border px-2 py-1 text-[10px] rounded font-bold uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Education
            </h2>
            {education?.map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="text-sm font-bold text-slate-900">
                  {edu.degree}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {edu.school} | {edu.year}
                </div>
              </div>
            ))}
          </section>

          <section className="px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Certifications
            </h2>
            {certifications?.map((cert, i) => (
              <div key={i} className="mb-4">
                <div className="text-sm font-bold text-slate-900">
                  {cert.title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {cert.issuer} ({cert.date})
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
