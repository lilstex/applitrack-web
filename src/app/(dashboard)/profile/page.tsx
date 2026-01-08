"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Save,
  GraduationCap,
  Award,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Experience } from "@/types";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  phoneNumber: z.string().optional(),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  summary: z.string().optional(),
  skills: z.string().optional(),
  workExperience: z.array(
    z.object({
      company: z.string().min(1, "Required"),
      role: z.string().min(1, "Required"),
      startDate: z.string().min(1, "Required"),
      endDate: z.string().min(1, "Required"),
      highlights: z.string(),
      technologiesUsed: z.string(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().optional(),
      school: z.string().optional(),
      year: z.string().optional(),
    })
  ),
  certifications: z.array(
    z.object({
      title: z.string().optional(),
      issuer: z.string().optional(),
      date: z.string().optional(),
    })
  ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [fetching, setFetching] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      workExperience: [],
      education: [],
      certifications: [],
    },
  });

  const expArray = useFieldArray({ control, name: "workExperience" });
  const eduArray = useFieldArray({ control, name: "education" });
  const certArray = useFieldArray({ control, name: "certifications" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await apiClient.get("/profile");

        const formattedData: Partial<ProfileFormValues> = {
          ...data,
          skills: data.skills?.join(", ") || "",
          workExperience:
            data.workExperience?.map((exp: Experience) => ({
              ...exp,
              highlights: exp.highlights?.join("\n") || "",
              technologiesUsed: exp.technologiesUsed?.join(", ") || "",
            })) || [],
        };
        reset(formattedData as ProfileFormValues);
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    const payload = {
      ...data,
      skills: data.skills
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      workExperience: data.workExperience.map((exp) => ({
        ...exp,
        highlights: exp.highlights
          ?.split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
        technologiesUsed: exp.technologiesUsed
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })),
    };

    try {
      await apiClient.patch("/profile/basic", payload);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  if (fetching)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading Profile...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
      {/* Sticky Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border sticky top-0 z-20 shadow-sm gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
          Master Profile
        </h1>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 size={18} className="mr-2 animate-spin" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          <span className="hidden sm:inline">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </span>
          <span className="sm:hidden">{isSubmitting ? "..." : "Save"}</span>
        </Button>
      </div>

      <form className="space-y-6 md:space-y-8">
        {/* Basic Info */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <Input {...register("fullName")} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <Input {...register("phoneNumber")} placeholder="+234..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                LinkedIn URL
              </label>
              <Input
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Summary
              </label>
              <Textarea
                {...register("summary")}
                className="h-32 md:h-24 resize-none"
                placeholder="Briefly describe your professional background..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Skills (Comma separated)
              </label>
              <Input
                {...register("skills")}
                placeholder="NodeJS, PHP, NestJS, Docker..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase size={20} className="text-emerald-600" /> Experience
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() =>
                expArray.append({
                  company: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  highlights: "",
                  technologiesUsed: "",
                })
              }
            >
              <Plus size={16} className="mr-1" />{" "}
              <span className="hidden sm:inline">Add Job</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100">
            {expArray.fields.map((field, index) => (
              <div key={field.id} className="py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Company
                    </label>
                    <Input
                      {...register(`workExperience.${index}.company`)}
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Role
                    </label>
                    <Input
                      {...register(`workExperience.${index}.role`)}
                      placeholder="e.g. Backend Engineer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Start Date
                    </label>
                    <Input
                      {...register(`workExperience.${index}.startDate`)}
                      placeholder="YYYY-MM"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      End Date
                    </label>
                    <Input
                      {...register(`workExperience.${index}.endDate`)}
                      placeholder="YYYY-MM or Present"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Key Highlights
                  </label>
                  <Textarea
                    {...register(`workExperience.${index}.highlights`)}
                    placeholder="Describe your achievements (one per line)..."
                    className="h-24 md:h-20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Stack
                  </label>
                  <Input
                    {...register(`workExperience.${index}.technologiesUsed`)}
                    placeholder="e.g. React, AWS, Go"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                  onClick={() => expArray.remove(index)}
                >
                  <Trash2 size={14} className="mr-1" /> Remove Experience
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap size={20} className="text-emerald-600" /> Education
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() =>
                eduArray.append({ degree: "", school: "", year: "" })
              }
            >
              <Plus size={16} className="mr-1" />{" "}
              <span className="hidden sm:inline">Add Education</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0">
            {eduArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-end bg-white relative group"
              >
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Degree / Course
                  </label>
                  <Input
                    {...register(`education.${index}.degree`)}
                    placeholder="B.Sc Computer Science"
                  />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    School
                  </label>
                  <Input
                    {...register(`education.${index}.school`)}
                    placeholder="University of Lagos"
                  />
                </div>
                <div className="w-full md:w-32 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Year
                  </label>
                  <Input
                    {...register(`education.${index}.year`)}
                    placeholder="2020"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 md:static text-slate-300 hover:text-red-500"
                  onClick={() => eduArray.remove(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award size={20} className="text-emerald-600" /> Certifications
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() =>
                certArray.append({ title: "", issuer: "", date: "" })
              }
            >
              <Plus size={16} className="mr-1" />{" "}
              <span className="hidden sm:inline">Add Certificate</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0">
            {certArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-end bg-white relative group"
              >
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Certificate Title
                  </label>
                  <Input
                    {...register(`certifications.${index}.title`)}
                    placeholder="AWS Certified Developer"
                  />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Issuer
                  </label>
                  <Input
                    {...register(`certifications.${index}.issuer`)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div className="w-full md:w-32 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Date
                  </label>
                  <Input
                    {...register(`certifications.${index}.date`)}
                    placeholder="2023"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 md:static text-slate-300 hover:text-red-500"
                  onClick={() => certArray.remove(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
