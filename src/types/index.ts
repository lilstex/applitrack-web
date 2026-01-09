export enum ApplicationStatus {
  GENERATED = "generated",
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  OFFERED = "offered",
  HIRED = "hired",
  REJECTED = "rejected",
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologiesUsed?: string[];
}

export interface Education {
  degree?: string;
  school?: string;
  year?: string;
}

export interface Certification {
  title?: string;
  issuer?: string;
  date?: string;
}

export interface CVData {
  professionalSummary: string;
  refinedExperience: Experience[];
  relevantSkills: string[];
  coverLetter?: string;
  education?: Education[];
  certifications?: Certification[];
}

export interface Application {
  _id: string;
  jobTitle: string;
  companyName: string;
  createdAt: string;
  generatedCvData: CVData;
  generatedCoverLetter: string;
  status: string;
  rawJobDescription: string;
}
