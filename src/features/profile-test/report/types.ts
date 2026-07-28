import type { Locale, ProfileKey } from "../types";

export type ReportLocale = Locale;
export type CourseDirection = "scratch" | "roblox" | "python";

export const COMPETENCY_KEYS = [
  "interest",
  "logic",
  "independence",
  "focus",
  "communication",
  "creativity",
] as const;

export type CompetencyKey = (typeof COMPETENCY_KEYS)[number];
export type CompetencyRatings = Record<CompetencyKey, number>;

export const OBSERVATION_KEYS = [
  "active",
  "questions",
  "initiative",
  "quickLearning",
  "practice",
  "sustainedFocus",
  "independentAttempts",
  "acceptsFeedback",
  "explainsThinking",
  "checksResult",
] as const;

export type ObservationKey = (typeof OBSERVATION_KEYS)[number];
export type TeacherObservations = Record<ObservationKey, boolean>;

export const LEARNING_STYLE_KEYS = [
  "practice",
  "projects",
  "visuals",
  "problems",
  "stepByStep",
  "gameFormat",
  "shortTasks",
  "discussion",
  "experimentation",
  "repetition",
] as const;

export type LearningStyleKey = (typeof LEARNING_STYLE_KEYS)[number];
export type LearningStyles = Record<LearningStyleKey, boolean>;

export const SUPPORT_KEYS = [
  "longInstructions",
  "debugging",
  "planning",
  "focus",
  "taskStart",
  "finishing",
  "pace",
  "theory",
  "confidence",
  "selfChecking",
] as const;

export type SupportKey = (typeof SUPPORT_KEYS)[number];
export type SupportNeeds = Record<SupportKey, boolean>;

export type SwotDraft = {
  strengths: string[];
  development: string[];
  opportunities: string[];
  risks: string[];
};

export type StudentReportDraft = {
  locale: ReportLocale;
  profileKey: ProfileKey;
  studentName: string;
  age: string;
  direction: CourseDirection;
  lessonDate: string;
  teacherName: string;
  lessonSummary: string;
  competencies: CompetencyRatings;
  observations: TeacherObservations;
  observationNote: string;
  swot: SwotDraft;
  learningStyles: LearningStyles;
  supportNeeds: SupportNeeds;
  conclusion: string;
};

export type LocalizedReportText = Record<ReportLocale, string>;

export type ProfileReportTemplate = {
  profileTitle: LocalizedReportText;
  profileDescription: LocalizedReportText;
  lessonSummary: LocalizedReportText;
  strengths: Record<ReportLocale, string[]>;
  development: Record<ReportLocale, string[]>;
  opportunities: Record<ReportLocale, string[]>;
  risks: Record<ReportLocale, string[]>;
  learningStyles: LearningStyleKey[];
  supportNeeds: SupportKey[];
  taskFormat: LocalizedReportText;
  feedback: LocalizedReportText;
  attention: LocalizedReportText;
  conclusion: LocalizedReportText;
};
