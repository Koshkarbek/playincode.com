import type { Locale, LocalizedText } from "./types.ts";

const t = (ru: string, en: string): LocalizedText => ({ ru, en });

export const publicCopy = {
  rootRequired: t(
    "Для прохождения теста нужна персональная ссылка.",
    "A personal link is required to take the test.",
  ),
  chooseLanguage: t("Выберите язык", "Choose a language"),
  question: t("Вопрос", "Question"),
  of: t("из", "of"),
  thankYou: t("СПАСИБО, ЧТО ПРОШЛИ ТЕСТ", "THANK YOU FOR COMPLETING THE TEST"),
  invalidLink: t(
    "Ссылка недействительна. Обратитесь в школу за новой ссылкой.",
    "This link is invalid. Please ask the school for a new link.",
  ),
  loading: t("Загрузка…", "Loading…"),
  retry: t("Повторить", "Try again"),
  networkError: t(
    "Не удалось сохранить ответ. Проверьте подключение и попробуйте ещё раз.",
    "We could not save your answer. Check your connection and try again.",
  ),
};

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale];
}
