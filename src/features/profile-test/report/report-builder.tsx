"use client";

import { useMemo, useState } from "react";
import type { ProfileKey } from "../types";
import {
  COMPETENCY_KEYS,
  LEARNING_STYLE_KEYS,
  OBSERVATION_KEYS,
  SUPPORT_KEYS,
  type CompetencyKey,
  type ReportLocale,
  type StudentReportDraft,
} from "./types";
import {
  applyTemplate,
  createEmptyReport,
  hasAuthoredContent,
  REPORT_LABELS,
  REPORT_TEMPLATES,
} from "./templates";

const formCopy = {
  ru: {
    title: "Индивидуальный профиль ученика",
    privacy:
      "Данные существуют только в этой форме и в скачанном PDF. Они не сохраняются в базе.",
    locale: "Язык PDF",
    fillHints: "Заполнить подсказками",
    overwrite:
      "Заменить уже заполненные текстовые блоки рекомендациями для этого профиля?",
    studentName: "Имя ученика",
    age: "Возраст",
    direction: "Направление",
    lessonDate: "Дата занятия",
    teacherName: "Преподаватель",
    required: "Заполните обязательные поля и итоговые тексты.",
    lessonSummary: "Итог пробного занятия",
    competencies: "Компетенции — оценка преподавателя",
    observations: "Наблюдения преподавателя",
    note: "Дополнительное наблюдение",
    swot: "Карта развития",
    strengths: "Сильные стороны",
    development: "Зоны развития",
    opportunities: "Возможности",
    risks: "Потенциальные риски",
    onePerLine: "Каждый пункт — с новой строки",
    style: "Лучше всего воспринимает материал",
    support: "Требует дополнительной поддержки",
    conclusion: "Итоговое заключение",
    generate: "Скачать PDF",
    generating: "Создаём PDF…",
    generationError: "Не удалось создать PDF. Проверьте поля и попробуйте ещё раз.",
    close: "Закрыть без сохранения",
    profile: "Результат теста",
  },
  en: {
    title: "Individual Student Profile",
    privacy:
      "The data exists only in this form and the downloaded PDF. It is not stored in the database.",
    locale: "PDF language",
    fillHints: "Fill with suggestions",
    overwrite:
      "Replace the existing text sections with suggestions for this profile?",
    studentName: "Student name",
    age: "Age",
    direction: "Direction",
    lessonDate: "Lesson date",
    teacherName: "Teacher",
    required: "Complete all required fields and final text sections.",
    lessonSummary: "Trial lesson summary",
    competencies: "Competencies — teacher rating",
    observations: "Teacher observations",
    note: "Additional observation",
    swot: "Development map",
    strengths: "Strengths",
    development: "Development areas",
    opportunities: "Opportunities",
    risks: "Potential risks",
    onePerLine: "One item per line",
    style: "Learns best",
    support: "Needs additional support",
    conclusion: "Final recommendation",
    generate: "Download PDF",
    generating: "Creating PDF…",
    generationError: "Could not create the PDF. Check the fields and try again.",
    close: "Close without saving",
    profile: "Test result",
  },
};

function lines(value: string): string[] {
  return value.split("\n");
}

function safeFilename(value: string): string {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

export function ReportBuilder({
  profileKey,
  initialLocale,
  onClose,
}: {
  profileKey: ProfileKey;
  initialLocale: ReportLocale;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<StudentReportDraft>(() =>
    createEmptyReport(profileKey, initialLocale),
  );
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const ui = formCopy[draft.locale];
  const template = REPORT_TEMPLATES[profileKey];

  const requiredComplete = useMemo(
    () =>
      Boolean(
        draft.studentName.trim() &&
          draft.age.trim() &&
          draft.teacherName.trim() &&
          draft.lessonDate &&
          draft.lessonSummary.trim() &&
          draft.conclusion.trim(),
      ),
    [draft],
  );

  function update<K extends keyof StudentReportDraft>(
    key: K,
    value: StudentReportDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function fillSuggestions() {
    if (hasAuthoredContent(draft) && !window.confirm(ui.overwrite)) return;
    setDraft((current) => applyTemplate(current));
    setError("");
  }

  async function downloadPdf() {
    if (!requiredComplete) {
      setError(ui.required);
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const [{ pdf }, { StudentReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./report-pdf"),
      ]);
      const blob = await pdf(
        <StudentReportDocument
          draft={draft}
          logoUrl={`${window.location.origin}/report-logo.png`}
          fontBaseUrl={`${window.location.origin}/fonts`}
        />,
      ).toBlob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = `PlayInCode_Profile_${safeFilename(draft.studentName)}_${draft.lessonDate}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      setError(ui.generationError);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="report-builder" aria-labelledby="report-builder-title">
      <div className="report-builder-header">
        <div>
          <h2 id="report-builder-title">{ui.title}</h2>
          <p className="report-privacy">{ui.privacy}</p>
        </div>
        <button type="button" onClick={onClose}>
          {ui.close}
        </button>
      </div>

      <div className="report-toolbar">
        <label>
          {ui.locale}
          <select
            value={draft.locale}
            onChange={(event) =>
              update("locale", event.target.value as ReportLocale)
            }
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
        <div className="report-profile">
          <span>{ui.profile}</span>
          <strong>{template.profileTitle[draft.locale]}</strong>
        </div>
        <button type="button" onClick={fillSuggestions}>
          {ui.fillHints}
        </button>
      </div>

      <div className="report-form-grid report-meta-grid">
        <label>
          {ui.studentName} *
          <input
            required
            maxLength={80}
            value={draft.studentName}
            onChange={(event) => update("studentName", event.target.value)}
          />
        </label>
        <label>
          {ui.age} *
          <input
            required
            inputMode="numeric"
            maxLength={20}
            value={draft.age}
            onChange={(event) => update("age", event.target.value)}
          />
        </label>
        <label>
          {ui.direction}
          <select
            value={draft.direction}
            onChange={(event) =>
              update(
                "direction",
                event.target.value as StudentReportDraft["direction"],
              )
            }
          >
            {Object.entries(REPORT_LABELS.directions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ui.lessonDate} *
          <input
            required
            maxLength={80}
            type="date"
            value={draft.lessonDate}
            onChange={(event) => update("lessonDate", event.target.value)}
          />
        </label>
        <label>
          {ui.teacherName} *
          <input
            required
            value={draft.teacherName}
            onChange={(event) => update("teacherName", event.target.value)}
          />
        </label>
      </div>

      <label className="report-block">
        <span>{ui.lessonSummary} *</span>
        <textarea
          rows={6}
          maxLength={700}
          value={draft.lessonSummary}
          onChange={(event) => update("lessonSummary", event.target.value)}
        />
      </label>

      <fieldset className="report-block">
        <legend>{ui.competencies}</legend>
        <div className="competency-editor">
          {COMPETENCY_KEYS.map((key: CompetencyKey) => (
            <label key={key}>
              <span>{REPORT_LABELS.competencies[key][draft.locale]}</span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={draft.competencies[key]}
                onChange={(event) =>
                  update("competencies", {
                    ...draft.competencies,
                    [key]: Number(event.target.value),
                  })
                }
              />
              <output>{draft.competencies[key]}/5</output>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="report-block">
        <legend>{ui.observations}</legend>
        <div className="report-check-grid">
          {OBSERVATION_KEYS.map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={draft.observations[key]}
                onChange={(event) =>
                  update("observations", {
                    ...draft.observations,
                    [key]: event.target.checked,
                  })
                }
              />
              {REPORT_LABELS.observations[key][draft.locale]}
            </label>
          ))}
        </div>
        <label>
          {ui.note}
          <textarea
            rows={3}
            maxLength={350}
            value={draft.observationNote}
            onChange={(event) => update("observationNote", event.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="report-block">
        <legend>{ui.swot}</legend>
        <div className="report-form-grid">
          {(
            [
              ["strengths", ui.strengths],
              ["development", ui.development],
              ["opportunities", ui.opportunities],
              ["risks", ui.risks],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <small>{ui.onePerLine}</small>
              <textarea
                rows={4}
                maxLength={220}
                value={draft.swot[key].join("\n")}
                onChange={(event) =>
                  update("swot", {
                    ...draft.swot,
                    [key]: lines(event.target.value),
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="report-form-grid">
        <fieldset className="report-block">
          <legend>{ui.style}</legend>
          <div className="report-check-grid">
            {LEARNING_STYLE_KEYS.map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={draft.learningStyles[key]}
                  onChange={(event) =>
                    update("learningStyles", {
                      ...draft.learningStyles,
                      [key]: event.target.checked,
                    })
                  }
                />
                {REPORT_LABELS.learningStyles[key][draft.locale]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="report-block">
          <legend>{ui.support}</legend>
          <div className="report-check-grid">
            {SUPPORT_KEYS.map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={draft.supportNeeds[key]}
                  onChange={(event) =>
                    update("supportNeeds", {
                      ...draft.supportNeeds,
                      [key]: event.target.checked,
                    })
                  }
                />
                {REPORT_LABELS.supportNeeds[key][draft.locale]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="report-block">
        <span>{ui.conclusion} *</span>
        <textarea
          rows={6}
          maxLength={700}
          value={draft.conclusion}
          onChange={(event) => update("conclusion", event.target.value)}
        />
      </label>

      {error ? (
        <p className="error-message" role="alert">
          {error}
        </p>
      ) : null}
      <div className="report-actions">
        <button
          type="button"
          className="primary-button"
          disabled={generating}
          onClick={downloadPdf}
        >
          {generating ? ui.generating : ui.generate}
        </button>
      </div>
    </section>
  );
}
