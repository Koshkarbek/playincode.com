import { profiles, questions } from "../content";
import { BASE_TYPES } from "../scoring";
import type { ProfileKey } from "../types";

describe("profile-test bilingual content", () => {
  test("contains 15 complete bilingual questions", () => {
    expect(questions).toHaveLength(15);
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    );

    for (const question of questions) {
      expect(question.prompt.ru.trim()).not.toBe("");
      expect(question.prompt.en.trim()).not.toBe("");
      for (const type of BASE_TYPES) {
        expect(question.answers[type].ru.trim()).not.toBe("");
        expect(question.answers[type].en.trim()).not.toBe("");
      }
    }
  });

  test("contains four pure, six mixed, and one ambiguous profile", () => {
    const expected: ProfileKey[] = [
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
    expect(Object.keys(profiles).sort()).toEqual(expected.sort());

    for (const profile of Object.values(profiles)) {
      expect(profile.title.ru.trim()).not.toBe("");
      expect(profile.title.en.trim()).not.toBe("");
      expect(profile.sections.length).toBeGreaterThan(0);
      for (const section of profile.sections) {
        expect(section.label.ru.trim()).not.toBe("");
        expect(section.label.en.trim()).not.toBe("");
        expect(section.text.ru.trim()).not.toBe("");
        expect(section.text.en.trim()).not.toBe("");
      }
    }
  });
});
