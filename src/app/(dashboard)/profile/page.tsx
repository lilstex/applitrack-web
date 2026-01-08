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
      <div className="p-10 text-center animate-pulse">Loading Profile...</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Master Profile</h1>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={isSubmitting}
        >
          <Save size={18} className="mr-2" />{" "}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input {...register("fullName")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input {...register("phoneNumber")} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary</label>
              <Textarea {...register("summary")} className="h-24" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Skills (Comma separated)
              </label>
              <Input
                {...register("skills")}
                placeholder="NodeJS, PHP, NestJS..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={20} className="text-slate-600" /> Experience
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
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
              <Plus size={16} className="mr-2" /> Add Job
            </Button>
          </CardHeader>
          <CardContent className="divide-y">
            {expArray.fields.map((field, index) => (
              <div key={field.id} className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register(`workExperience.${index}.company`)}
                    placeholder="Company"
                  />
                  <Input
                    {...register(`workExperience.${index}.role`)}
                    placeholder="Role"
                  />
                  <Input
                    {...register(`workExperience.${index}.startDate`)}
                    placeholder="Start Date (e.g. 2020-01)"
                  />
                  <Input
                    {...register(`workExperience.${index}.endDate`)}
                    placeholder="End Date (or 'Present')"
                  />
                </div>
                <Textarea
                  {...register(`workExperience.${index}.highlights`)}
                  placeholder="Highlights (One per line)"
                  className="h-20"
                />
                <Input
                  {...register(`workExperience.${index}.technologiesUsed`)}
                  placeholder="Technologies used (Comma separated)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 text-xs"
                  onClick={() => expArray.remove(index)}
                >
                  <Trash2 size={14} className="mr-1" /> Remove Job
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap size={20} className="text-slate-600" /> Education
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                eduArray.append({ degree: "", school: "", year: "" })
              }
            >
              <Plus size={16} className="mr-2" /> Add Education
            </Button>
          </CardHeader>
          <CardContent className="divide-y">
            {eduArray.fields.map((field, index) => (
              <div key={field.id} className="py-4 flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-xs">Degree</label>
                  <Input {...register(`education.${index}.degree`)} />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs">School</label>
                  <Input {...register(`education.${index}.school`)} />
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-xs">Year</label>
                  <Input {...register(`education.${index}.year`)} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => eduArray.remove(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2">
              <Award size={20} className="text-slate-600" /> Certifications
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                certArray.append({ title: "", issuer: "", date: "" })
              }
            >
              <Plus size={16} className="mr-2" /> Add Cert
            </Button>
          </CardHeader>
          <CardContent className="divide-y">
            {certArray.fields.map((field, index) => (
              <div key={field.id} className="py-4 flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-xs">Title</label>
                  <Input {...register(`certifications.${index}.title`)} />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs">Issuer</label>
                  <Input {...register(`certifications.${index}.issuer`)} />
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-xs">Date</label>
                  <Input {...register(`certifications.${index}.date`)} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
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
