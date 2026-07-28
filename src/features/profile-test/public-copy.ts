import type { Locale, LocalizedText } from "./types.ts";

const t = (ru: string, en: string): LocalizedText => ({ ru, en });

export const publicCopy = {
  rootRequired: t(
    "Для прохождения теста нужна персональная ссылка.",
    "A personal link is required to take the test."
  ),
  chooseLanguage: t("Выберите язык", "Choose a language"),
  languageHint: t(
    "Тест займёт около пяти минут. Выберите язык, на котором будет удобнее отвечать.",
    "The test takes about five minutes. Choose the language you are most comfortable answering in."
  ),
  privacyNote: t(
    "Ответы сохраняются автоматически",
    "Answers are saved automatically"
  ),
  question: t("Вопрос", "Question"),
  of: t("из", "of"),
  chooseAnswer: t(
    "Выбери вариант, который больше похож на тебя",
    "Choose the answer that sounds most like you"
  ),
  autoSave: t(
    "После выбора откроется следующий вопрос",
    "The next question opens after your choice"
  ),
  thankYou: t("Тест завершён", "Test complete"),
  completedEyebrow: t("Все 15 шагов пройдены", "All 15 steps complete"),
  completedHint: t(
    "Спасибо за ответы. Результаты сохранены и уже доступны школе.",
    "Thank you for your answers. Your results have been saved and are now available to the school."
  ),
  invalidTitle: t("Ссылка не работает", "This link does not work"),
  invalidLink: t(
    "Ссылка недействительна. Обратитесь в школу за новой ссылкой.",
    "This link is invalid. Please ask the school for a new link."
  ),
  loading: t("Загрузка…", "Loading…"),
  retry: t("Повторить", "Try again"),
  networkError: t(
    "Не удалось сохранить ответ. Проверьте подключение и попробуйте ещё раз.",
    "We could not save your answer. Check your connection and try again."
  ),
  footer: t("Тест учебных предпочтений", "Learning preferences test"),
};

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale];
}
