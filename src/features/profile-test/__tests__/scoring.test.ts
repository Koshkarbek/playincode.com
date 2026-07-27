import { countScores, determineProfile } from "../scoring";
import type { BaseType, MixedProfileKey, ScoreVector } from "../types";

describe("profile-test scoring", () => {
  test("counts all four base scores and keeps a total of 15", () => {
    const answers: BaseType[] = [
      "A",
      "A",
      "A",
      "A",
      "B",
      "B",
      "B",
      "B",
      "B",
      "B",
      "B",
      "B",
      "B",
      "B",
      "C",
    ];
    const scores = countScores(answers);
    expect(scores).toEqual({ A: 4, B: 10, C: 1, D: 0 });
    expect(Object.values(scores).reduce((sum, score) => sum + score, 0)).toBe(
      15,
    );
  });

  test("selects a pure profile when the lead is more than one point", () => {
    expect(determineProfile({ A: 4, B: 10, C: 1, D: 0 })).toBe("B");
    expect(determineProfile({ A: 7, B: 5, C: 2, D: 1 })).toBe("A");
  });

  test("selects a mixed profile for two unique leaders within one point", () => {
    expect(determineProfile({ A: 6, B: 5, C: 3, D: 1 })).toBe("AB");
    expect(determineProfile({ A: 6, B: 6, C: 2, D: 1 })).toBe("AB");
  });

  test("supports every mixed pair", () => {
    const pairs: Array<[BaseType, BaseType, MixedProfileKey]> = [
      ["A", "B", "AB"],
      ["A", "C", "AC"],
      ["A", "D", "AD"],
      ["B", "C", "BC"],
      ["B", "D", "BD"],
      ["C", "D", "CD"],
    ];

    for (const [first, second, expected] of pairs) {
      const scores: ScoreVector = { A: 1, B: 1, C: 1, D: 1 };
      scores[first] = 6;
      scores[second] = 5;
      const remaining = (Object.keys(scores) as BaseType[]).find(
        (key) => key !== first && key !== second,
      );
      if (remaining) scores[remaining] = 3;
      expect(determineProfile(scores)).toBe(expected);
    }
  });

  test("marks results ambiguous when the leading pair is not unique", () => {
    expect(determineProfile({ A: 5, B: 5, C: 5, D: 0 })).toBe("AMBIGUOUS");
    expect(determineProfile({ A: 5, B: 4, C: 4, D: 2 })).toBe("AMBIGUOUS");
    expect(determineProfile({ A: 4, B: 4, C: 4, D: 3 })).toBe("AMBIGUOUS");
  });
});
