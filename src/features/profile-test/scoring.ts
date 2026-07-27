import type { BaseType, ProfileKey, ScoreVector } from "./types.ts";

export const BASE_TYPES: BaseType[] = ["A", "B", "C", "D"];

export function countScores(answers: BaseType[]): ScoreVector {
  return answers.reduce<ScoreVector>(
    (scores, answer) => {
      scores[answer] += 1;
      return scores;
    },
    { A: 0, B: 0, C: 0, D: 0 },
  );
}

export function determineProfile(scores: ScoreVector): ProfileKey {
  const ranked = BASE_TYPES.map((type) => ({ type, score: scores[type] })).sort(
    (left, right) =>
      right.score - left.score || BASE_TYPES.indexOf(left.type) - BASE_TYPES.indexOf(right.type),
  );

  const first = ranked[0];
  const second = ranked[1];
  if (first.score - second.score > 1) return first.type;

  if (ranked[2].score === second.score) return "AMBIGUOUS";

  return [first.type, second.type].sort().join("") as ProfileKey;
}
