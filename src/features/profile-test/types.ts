export type Locale = "ru" | "en";
export type BaseType = "A" | "B" | "C" | "D";
export type PureProfileKey = BaseType;
export type MixedProfileKey = "AB" | "AC" | "AD" | "BC" | "BD" | "CD";
export type ProfileKey = PureProfileKey | MixedProfileKey | "AMBIGUOUS";
export type ScoreVector = Record<BaseType, number>;

export type LocalizedText = Record<Locale, string>;

export type Question = {
  id: number;
  prompt: LocalizedText;
  answers: Record<BaseType, LocalizedText>;
};

export type ProfileSection = {
  label: LocalizedText;
  text: LocalizedText;
};

export type ProfileContent = {
  key: ProfileKey;
  title: LocalizedText;
  sections: ProfileSection[];
};
