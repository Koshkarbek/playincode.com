import type { ProfileKey } from "../../types";
import {
  applyTemplate,
  createEmptyReport,
  hasAuthoredContent,
  REPORT_LABELS,
  REPORT_TEMPLATES,
} from "../templates";
import {
  LEARNING_STYLE_KEYS,
  OBSERVATION_KEYS,
  SUPPORT_KEYS,
} from "../types";

const profileKeys: ProfileKey[] = [
  "A",
  "B",
  "C",
  "D",
  "AB",
  "AC",
  "AD",
  "BC",
  "BD",
  "CD",
  "AMBIGUOUS",
];

describe("student report templates", () => {
  test("contains complete bilingual copy for all profile results", () => {
    expect(Object.keys(REPORT_TEMPLATES).sort()).toEqual(
      [...profileKeys].sort(),
    );

    for (const key of profileKeys) {
      const template = REPORT_TEMPLATES[key];
      for (const locale of ["ru", "en"] as const) {
        expect(template.profileTitle[locale].trim()).not.toBe("");
        expect(template.profileDescription[locale].trim()).not.toBe("");
        expect(template.lessonSummary[locale].trim()).not.toBe("");
        expect(template.conclusion[locale].trim()).not.toBe("");
        expect(template.taskFormat[locale].trim()).not.toBe("");
        expect(template.feedback[locale].trim()).not.toBe("");
        expect(template.attention[locale].trim()).not.toBe("");
        expect(template.strengths[locale].length).toBeGreaterThan(0);
        expect(template.development[locale].length).toBeGreaterThan(0);
        expect(template.opportunities[locale].length).toBeGreaterThan(0);
        expect(template.risks[locale].length).toBeGreaterThan(0);
      }
    }
  });

  test.each(profileKeys)("fills an editable draft for %s", (profileKey) => {
    const empty = createEmptyReport(profileKey, "ru");
    expect(hasAuthoredContent(empty)).toBe(false);

    const filled = applyTemplate(empty);
    expect(filled.profileKey).toBe(profileKey);
    expect(filled.lessonSummary).not.toBe("");
    expect(filled.conclusion).not.toBe("");
    expect(filled.swot.strengths.length).toBeGreaterThan(0);
    expect(hasAuthoredContent(filled)).toBe(true);
  });

  test("preserves personal and teacher-entered fields when applying hints", () => {
    const draft = createEmptyReport("BC", "en");
    draft.studentName = "Alex";
    draft.age = "12";
    draft.teacherName = "Teacher";
    draft.competencies.logic = 5;
    draft.observationNote = "Observed during the lesson";

    const filled = applyTemplate(draft);
    expect(filled.studentName).toBe("Alex");
    expect(filled.age).toBe("12");
    expect(filled.teacherName).toBe("Teacher");
    expect(filled.competencies.logic).toBe(5);
    expect(filled.observationNote).toBe("Observed during the lesson");
  });

  test("offers ten bilingual learning and support hints", () => {
    expect(LEARNING_STYLE_KEYS).toHaveLength(10);
    expect(SUPPORT_KEYS).toHaveLength(10);

    for (const key of LEARNING_STYLE_KEYS) {
      expect(REPORT_LABELS.learningStyles[key].ru.trim()).not.toBe("");
      expect(REPORT_LABELS.learningStyles[key].en.trim()).not.toBe("");
    }
    for (const key of SUPPORT_KEYS) {
      expect(REPORT_LABELS.supportNeeds[key].ru.trim()).not.toBe("");
      expect(REPORT_LABELS.supportNeeds[key].en.trim()).not.toBe("");
    }
  });

  test("offers ten bilingual teacher observations", () => {
    expect(OBSERVATION_KEYS).toHaveLength(10);

    for (const key of OBSERVATION_KEYS) {
      expect(REPORT_LABELS.observations[key].ru.trim()).not.toBe("");
      expect(REPORT_LABELS.observations[key].en.trim()).not.toBe("");
    }
  });
});
