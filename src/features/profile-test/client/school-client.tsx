"use client";

import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  BaseType,
  Locale,
  ProfileContent,
  ProfileKey,
  Question,
  ScoreVector,
} from "@/features/profile-test/types";
import { ReportBuilder } from "@/features/profile-test/report/report-builder";

type Batch = {
  id: string;
  createdAt: number;
  quantity: number;
};

type StoredAnswer = {
  questionId: number;
  choiceIndex: number;
  baseType: BaseType;
};

type Invitation = {
  id: string;
  batchId: string;
  code: string;
  url: string | null;
  locale: Locale | null;
  status: "ready" | "in_progress" | "completed";
  progress: number;
  scores: ScoreVector | null;
  profileKey: ProfileKey | null;
  createdAt: number;
  completedAt: number | null;
  firstSentAt: number | null;
  lastSentAt: number | null;
  sendCount: number;
  adminNote: string | null;
  adminNoteUpdatedAt: number | null;
  answers: StoredAnswer[];
};

type SchoolData = {
  testUrl: string;
  content: {
    profiles: Record<ProfileKey, ProfileContent>;
    questions: Question[];
  };
  batches: Batch[];
  invitations: Invitation[];
};

type WorkflowFilter =
  | "all"
  | "not_sent"
  | "sent_not_started"
  | "in_progress"
  | "completed";

const translations = {
  ru: {
    title: "Результаты теста",
    password: "Пароль школы",
    signIn: "Войти",
    wrongPassword: "Неверный пароль.",
    rateLimited: "Слишком много попыток. Попробуйте позже.",
    loadError: "Не удалось загрузить данные.",
    signOut: "Выйти",
    createBatch: "Создать пакет ссылок",
    linkCount: "Количество ссылок",
    generate: "Создать",
    generating: "Создание…",
    exportResults: "Скачать результаты CSV",
    batches: "Пакеты",
    results: "Ссылки и прохождения",
    created: "Создан",
    quantity: "Количество",
    actions: "Действия",
    deleteBatch: "Удалить пакет",
    deleteRecord: "Удалить запись",
    confirmBatch:
      "Удалить пакет, все ссылки, ответы и результаты в нём? Это действие нельзя отменить.",
    confirmRecord:
      "Удалить эту ссылку, ответы и результат? Это действие нельзя отменить.",
    code: "Персональный код",
    testAddress: "Общий адрес теста",
    copyLink: "Копировать",
    copied: "Скопировано",
    copyError: "Не удалось скопировать ссылку.",
    linkUnavailable: "Адрес недоступен",
    linkUnavailableHint:
      "Для этой старой записи не сохранён токен. Её прежняя ссылка продолжает работать.",
    shareMessage: (url: string, code: string) =>
      `Тест Play In Code: ${url}\nВаш персональный код: ${code}`,
    status: "Статус",
    delivery: "Отправка",
    language: "Язык",
    progress: "Прогресс",
    completed: "Завершён",
    profile: "Профиль",
    details: "Детали",
    noData: "Данных пока нет.",
    noMatches: "По выбранным фильтрам ничего не найдено.",
    ready: "Не отправлена",
    sentNotStarted: "Отправлена, тест не начат",
    inProgress: "В процессе",
    complete: "Завершён",
    markSent: "Отметить отправленной",
    markResent: "Отметить повторную отправку",
    resetSent: "Снять отметку",
    confirmResetSent:
      "Снять отметку можно только если ссылка фактически не была отправлена. Продолжить?",
    deliveryError: "Не удалось обновить отметку отправки.",
    firstSent: "Первая отправка",
    lastSent: "Последняя отправка",
    sentCount: "Количество отправок",
    filters: "Фильтры",
    allBatches: "Все пакеты",
    allStatuses: "Все статусы",
    searchCode: "Поиск по коду или комментарию",
    batchNotSent: "не отправлено",
    batchWaiting: "ожидают",
    batchInProgress: "в процессе",
    batchCompleted: "завершено",
    ambiguous: "Неоднозначный профиль",
    recommendations: "Описание и рекомендации",
    answers: "Ответы",
    question: "Вопрос",
    answer: "Ответ",
    notSelected: "Не выбран",
    total: "Сумма",
    invalidCount: "Введите число от 1 до 500.",
    createError: "Не удалось создать ссылки.",
    deleteError: "Не удалось удалить запись.",
    testDisclaimer:
      "Результат описывает учебные предпочтения и не является клинической диагностикой.",
    csvCode: "Код",
    csvBatch: "Пакет",
    csvCreated: "Создан",
    csvLanguage: "Язык",
    csvCompleted: "Завершён",
    csvStatus: "Статус",
    csvProfile: "Итоговый профиль",
    csvComment: "Комментарий",
    createReport: "Составить профиль",
    comment: "Комментарий",
    commentPlaceholder: "Имя родителя, что отправлено и договорённости",
    saveComment: "Сохранить",
    savingComment: "Сохранение…",
    commentSaved: "Сохранено",
    commentError: "Не удалось сохранить комментарий.",
    closeDetails: "Закрыть",
    technicalData: "Данные прохождения",
  },
  en: {
    title: "Test Results",
    password: "School password",
    signIn: "Sign in",
    wrongPassword: "Incorrect password.",
    rateLimited: "Too many attempts. Please try again later.",
    loadError: "Could not load the data.",
    signOut: "Sign out",
    createBatch: "Create a link batch",
    linkCount: "Number of links",
    generate: "Create",
    generating: "Creating…",
    exportResults: "Download results CSV",
    batches: "Batches",
    results: "Links and attempts",
    created: "Created",
    quantity: "Quantity",
    actions: "Actions",
    deleteBatch: "Delete batch",
    deleteRecord: "Delete record",
    confirmBatch:
      "Delete this batch and all its links, answers, and results? This cannot be undone.",
    confirmRecord:
      "Delete this link, its answers, and its result? This cannot be undone.",
    code: "Personal code",
    testAddress: "Shared test address",
    copyLink: "Copy",
    copied: "Copied",
    copyError: "Could not copy the link.",
    linkUnavailable: "Address unavailable",
    linkUnavailableHint:
      "This older record has no stored token. Its previous link remains unchanged.",
    shareMessage: (url: string, code: string) =>
      `Play In Code test: ${url}\nYour personal code: ${code}`,
    status: "Status",
    delivery: "Delivery",
    language: "Language",
    progress: "Progress",
    completed: "Completed",
    profile: "Profile",
    details: "Details",
    noData: "There is no data yet.",
    noMatches: "No records match the selected filters.",
    ready: "Not sent",
    sentNotStarted: "Sent, test not started",
    inProgress: "In progress",
    complete: "Completed",
    markSent: "Mark as sent",
    markResent: "Mark as sent again",
    resetSent: "Remove mark",
    confirmResetSent:
      "Only remove the mark if the link was not actually sent. Continue?",
    deliveryError: "Could not update the delivery mark.",
    firstSent: "First sent",
    lastSent: "Last sent",
    sentCount: "Times sent",
    filters: "Filters",
    allBatches: "All batches",
    allStatuses: "All statuses",
    searchCode: "Search by code or comment",
    batchNotSent: "not sent",
    batchWaiting: "waiting",
    batchInProgress: "in progress",
    batchCompleted: "completed",
    ambiguous: "Ambiguous profile",
    recommendations: "Description and recommendations",
    answers: "Answers",
    question: "Question",
    answer: "Answer",
    notSelected: "Not selected",
    total: "Total",
    invalidCount: "Enter a number from 1 to 500.",
    createError: "Could not create the links.",
    deleteError: "Could not delete the record.",
    testDisclaimer:
      "This result describes learning preferences and is not a clinical diagnosis.",
    csvCode: "Code",
    csvBatch: "Batch",
    csvCreated: "Created",
    csvLanguage: "Language",
    csvCompleted: "Completed",
    csvStatus: "Status",
    csvProfile: "Final profile",
    csvComment: "Comment",
    createReport: "Create student profile",
    comment: "Comment",
    commentPlaceholder: "Parent name, what was sent, and agreements",
    saveComment: "Save",
    savingComment: "Saving…",
    commentSaved: "Saved",
    commentError: "Could not save the comment.",
    closeDetails: "Close",
    technicalData: "Attempt data",
  },
} as const;

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename: string, rows: unknown[][]) {
  const content = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function workflowKey(invitation: Invitation): Exclude<WorkflowFilter, "all"> {
  if (invitation.status === "completed") return "completed";
  if (invitation.status === "in_progress") return "in_progress";
  return invitation.sendCount > 0 ? "sent_not_started" : "not_sent";
}

export function SchoolClient() {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<SchoolData | null>(null);
  const [error, setError] = useState("");
  const [count, setCount] = useState(20);
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState("all");
  const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilter>("all");
  const [codeSearch, setCodeSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [noteErrors, setNoteErrors] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    invitationId: string;
    profileKey: ProfileKey;
    locale: Locale;
  } | null>(null);
  const ui = translations[locale];

  function changeLocale(next: Locale) {
    setLocaleState(next);
    document.documentElement.lang = next;
  }

  const loadData = useCallback(async () => {
    const response = await fetch("/api/school", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      setData(null);
      return;
    }
    if (!response.ok) throw new Error("load_failed");
    setData((await response.json()) as SchoolData);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/school/auth", {
          cache: "no-store",
        });
        const result = (await response.json()) as { authenticated: boolean };
        setAuthenticated(result.authenticated);
        if (result.authenticated) await loadData();
      } catch {
        setError(translations.ru.loadError);
      } finally {
        setChecking(false);
      }
    })();
  }, [loadData]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/school/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        setError(
          result.error === "rate_limited" ? ui.rateLimited : ui.wrongPassword,
        );
        return;
      }
      setPassword("");
      setAuthenticated(true);
      await loadData();
    } catch {
      setError(ui.loadError);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/school/auth", { method: "DELETE" });
    setAuthenticated(false);
    setData(null);
    setCopiedId(null);
  }

  async function createBatch() {
    if (!Number.isInteger(count) || count < 1 || count > 500) {
      setError(ui.invalidCount);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_batch", count }),
      });
      if (!response.ok) throw new Error("create_failed");
      await loadData();
    } catch {
      setError(ui.createError);
    } finally {
      setBusy(false);
    }
  }

  async function remove(scope: "batch" | "invitation", id: string) {
    const message = scope === "batch" ? ui.confirmBatch : ui.confirmRecord;
    if (!window.confirm(message)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/school", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, id }),
      });
      if (!response.ok) throw new Error("delete_failed");
      await loadData();
    } catch {
      setError(ui.deleteError);
    } finally {
      setBusy(false);
    }
  }

  function formatDate(timestamp: number | null): string {
    if (!timestamp) return "—";
    return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(timestamp));
  }

  function workflowLabel(invitation: Invitation): string {
    const key = workflowKey(invitation);
    if (key === "completed") return ui.complete;
    if (key === "in_progress") {
      return `${ui.inProgress} — ${invitation.progress}/15`;
    }
    if (key === "sent_not_started") return ui.sentNotStarted;
    return ui.ready;
  }

  async function copyLink(invitation: Invitation) {
    if (!invitation.url || !data?.testUrl) return;
    try {
      await navigator.clipboard.writeText(
        ui.shareMessage(data.testUrl, invitation.code),
      );
      setCopiedId(invitation.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === invitation.id ? null : current));
      }, 1600);
    } catch {
      setError(ui.copyError);
    }
  }

  async function updateDelivery(
    action: "mark_sent" | "reset_sent",
    invitation: Invitation,
  ) {
    if (action === "reset_sent" && !window.confirm(ui.confirmResetSent)) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          invitationId: invitation.id,
        }),
      });
      if (!response.ok) throw new Error("delivery_failed");
      await loadData();
    } catch {
      setError(ui.deliveryError);
    } finally {
      setBusy(false);
    }
  }

  async function saveNote(invitation: Invitation) {
    const note = noteDrafts[invitation.id] ?? invitation.adminNote ?? "";
    setSavingNoteId(invitation.id);
    setSavedNoteId(null);
    setNoteErrors((current) => ({ ...current, [invitation.id]: "" }));
    try {
      const response = await fetch("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_note",
          invitationId: invitation.id,
          note,
        }),
      });
      if (!response.ok) throw new Error("note_failed");
      const result = (await response.json()) as {
        adminNote: string | null;
        adminNoteUpdatedAt: number | null;
      };
      setData((current) =>
        current
          ? {
              ...current,
              invitations: current.invitations.map((item) =>
                item.id === invitation.id
                  ? {
                      ...item,
                      adminNote: result.adminNote,
                      adminNoteUpdatedAt: result.adminNoteUpdatedAt,
                    }
                  : item,
              ),
            }
          : current,
      );
      setSavedNoteId(invitation.id);
      window.setTimeout(() => {
        setSavedNoteId((current) =>
          current === invitation.id ? null : current,
        );
      }, 1600);
    } catch {
      setNoteErrors((current) => ({
        ...current,
        [invitation.id]: ui.commentError,
      }));
    } finally {
      setSavingNoteId(null);
    }
  }

  function downloadResultsCsv() {
    if (!data) return;
    const headers = [
      ui.csvBatch,
      ui.csvCode,
      ui.csvLanguage,
      ui.csvStatus,
      ui.csvCreated,
      ui.csvCompleted,
      "A",
      "B",
      "C",
      "D",
      ui.total,
      ui.csvProfile,
      ui.csvComment,
      ...data.content.questions.map(
        (question) => `${ui.question} ${question.id}`,
      ),
    ];
    const rows = data.invitations.map((invitation) => {
      const profile = invitation.profileKey
        ? (data.content.profiles[invitation.profileKey]?.title[locale] ??
          invitation.profileKey)
        : "";
      const answers = new Map(
        invitation.answers.map((answer) => [
          answer.questionId,
          answer.baseType,
        ]),
      );
      const total = invitation.scores
        ? invitation.scores.A +
          invitation.scores.B +
          invitation.scores.C +
          invitation.scores.D
        : "";
      return [
        invitation.batchId,
        invitation.code,
        invitation.locale?.toUpperCase() ?? "",
        workflowLabel(invitation),
        formatDate(invitation.createdAt),
        formatDate(invitation.completedAt),
        invitation.scores?.A ?? "",
        invitation.scores?.B ?? "",
        invitation.scores?.C ?? "",
        invitation.scores?.D ?? "",
        total,
        profile,
        invitation.adminNote ?? "",
        ...data.content.questions.map(
          (question) => answers.get(question.id) ?? "",
        ),
      ];
    });
    downloadCsv("student-profile-results.csv", [headers, ...rows]);
  }

  const invitationsByBatch = useMemo(() => {
    const map = new Map<string, Invitation[]>();
    for (const invitation of data?.invitations ?? []) {
      const current = map.get(invitation.batchId) ?? [];
      current.push(invitation);
      map.set(invitation.batchId, current);
    }
    return map;
  }, [data]);

  const filteredInvitations = useMemo(() => {
    const normalizedSearch = codeSearch.trim().toUpperCase();
    return (data?.invitations ?? []).filter((invitation) => {
      if (batchFilter !== "all" && invitation.batchId !== batchFilter) {
        return false;
      }
      if (
        workflowFilter !== "all" &&
        workflowKey(invitation) !== workflowFilter
      ) {
        return false;
      }
      return (
        normalizedSearch.length === 0 ||
        invitation.code.toUpperCase().includes(normalizedSearch) ||
        (invitation.adminNote ?? "").toUpperCase().includes(normalizedSearch)
      );
    });
  }, [batchFilter, codeSearch, data, workflowFilter]);

  if (checking) {
    return (
      <main className="simple-page">
        <p>{locale === "ru" ? "Загрузка…" : "Loading…"}</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="school-page">
        <section className="login-card">
          <div className="language-toggle" aria-label="Language">
            <button
              type="button"
              aria-pressed={locale === "ru"}
              onClick={() => changeLocale("ru")}
            >
              RU
            </button>
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
          </div>
          <h1>{ui.title}</h1>
          <form onSubmit={signIn}>
            <label htmlFor="school-password">{ui.password}</label>
            <input
              id="school-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" disabled={busy}>
              {ui.signIn}
            </button>
          </form>
          {error ? (
            <p className="error-message" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="school-dashboard">
      <header className="school-header">
        <div className="school-title">
          <span className="school-eyebrow">Play In Code</span>
          <h1>{ui.title}</h1>
          <p>{ui.testDisclaimer}</p>
        </div>
        <div className="header-actions">
          <div className="language-toggle" aria-label="Language">
            <button
              type="button"
              aria-pressed={locale === "ru"}
              onClick={() => changeLocale("ru")}
            >
              RU
            </button>
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
          </div>
          <button type="button" onClick={signOut}>
            {ui.signOut}
          </button>
        </div>
      </header>

      {error ? (
        <p className="error-message" role="alert">
          {error}
        </p>
      ) : null}

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">01</span>
            <h2>{ui.createBatch}</h2>
          </div>
        </div>
        <div className="inline-form">
          <label htmlFor="link-count">{ui.linkCount}</label>
          <input
            id="link-count"
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
          <button type="button" disabled={busy} onClick={createBatch}>
            {busy ? ui.generating : ui.generate}
          </button>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">02</span>
            <h2>{ui.batches}</h2>
          </div>
        </div>
        {!data?.batches.length ? (
          <p>{ui.noData}</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{ui.created}</th>
                  <th>{ui.quantity}</th>
                  <th>{ui.status}</th>
                  <th>{ui.actions}</th>
                </tr>
              </thead>
              <tbody>
                {data.batches.map((batch) => {
                  const invitations = invitationsByBatch.get(batch.id) ?? [];
                  const notSent = invitations.filter(
                    (item) => workflowKey(item) === "not_sent",
                  ).length;
                  const waiting = invitations.filter(
                    (item) => workflowKey(item) === "sent_not_started",
                  ).length;
                  const inProgress = invitations.filter(
                    (item) => workflowKey(item) === "in_progress",
                  ).length;
                  const completed = invitations.filter(
                    (item) => workflowKey(item) === "completed",
                  ).length;
                  return (
                    <tr key={batch.id}>
                      <td>{formatDate(batch.createdAt)}</td>
                      <td>{batch.quantity}</td>
                      <td>
                        {notSent} {ui.batchNotSent} · {waiting}{" "}
                        {ui.batchWaiting} · {inProgress} {ui.batchInProgress} ·{" "}
                        {completed} {ui.batchCompleted}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="danger-button"
                          disabled={busy}
                          onClick={() => remove("batch", batch.id)}
                        >
                          {ui.deleteBatch}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section results-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">03</span>
            <h2>{ui.results}</h2>
          </div>
          <button
            type="button"
            disabled={!data?.invitations.length}
            onClick={downloadResultsCsv}
          >
            {ui.exportResults}
          </button>
        </div>
        {data ? (
          <div className="test-address">
            <div>
              <span>{ui.testAddress}</span>
              <input
                type="text"
                readOnly
                value={data.testUrl}
                aria-label={ui.testAddress}
                onFocus={(event) => event.currentTarget.select()}
              />
            </div>
          </div>
        ) : null}
        {data?.invitations.length ? (
          <div className="filter-bar" aria-label={ui.filters}>
            <label>
              <span>{ui.batches}</span>
              <select
                value={batchFilter}
                onChange={(event) => setBatchFilter(event.target.value)}
              >
                <option value="all">{ui.allBatches}</option>
                {data.batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {formatDate(batch.createdAt)} · {batch.quantity}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{ui.status}</span>
              <select
                value={workflowFilter}
                onChange={(event) =>
                  setWorkflowFilter(event.target.value as WorkflowFilter)
                }
              >
                <option value="all">{ui.allStatuses}</option>
                <option value="not_sent">{ui.ready}</option>
                <option value="sent_not_started">{ui.sentNotStarted}</option>
                <option value="in_progress">{ui.inProgress}</option>
                <option value="completed">{ui.complete}</option>
              </select>
            </label>
            <label>
              <span>{ui.searchCode}</span>
              <input
                type="search"
                value={codeSearch}
                onChange={(event) => setCodeSearch(event.target.value)}
                placeholder="STU-"
              />
            </label>
          </div>
        ) : null}
        {!data?.invitations.length ? (
          <p>{ui.noData}</p>
        ) : filteredInvitations.length === 0 ? (
          <p>{ui.noMatches}</p>
        ) : (
          <div className="table-scroll">
            <table className="results-table">
              <colgroup>
                <col className="results-code-column" />
                <col className="results-status-column" />
                <col className="results-delivery-column" />
                <col className="results-comment-column" />
                <col className="results-profile-column" />
                <col className="results-actions-column" />
              </colgroup>
              <thead>
                <tr>
                  <th>{ui.code}</th>
                  <th>{ui.status}</th>
                  <th>{ui.delivery}</th>
                  <th>{ui.comment}</th>
                  <th>{ui.profile}</th>
                  <th>{ui.details}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvitations.map((invitation) => {
                  const profile =
                    invitation.profileKey && data.content.profiles
                      ? data.content.profiles[invitation.profileKey]
                      : null;
                  const workflow = workflowKey(invitation);
                  const noteValue =
                    noteDrafts[invitation.id] ?? invitation.adminNote ?? "";
                  const noteChanged =
                    noteValue !== (invitation.adminNote ?? "");
                  return (
                    <Fragment key={invitation.id}>
                      <tr>
                        <td>
                          {invitation.url ? (
                            <div className="code-cell">
                              <code>{invitation.code}</code>
                              <button
                                type="button"
                                className="copy-code-button"
                                onClick={() => copyLink(invitation)}
                              >
                                {copiedId === invitation.id
                                  ? ui.copied
                                  : ui.copyLink}
                              </button>
                            </div>
                          ) : (
                            <div className="unavailable-link">
                              <code>{invitation.code}</code>
                              <strong>{ui.linkUnavailable}</strong>
                              <small>{ui.linkUnavailableHint}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="status-badge" data-status={workflow}>
                            {workflowLabel(invitation)}
                          </span>
                        </td>
                        <td>
                          <div className="delivery-cell compact-delivery-cell">
                            {invitation.sendCount > 0 ? (
                              <span className="delivery-summary">
                                <strong>{invitation.sendCount}×</strong>{" "}
                                {formatDate(invitation.lastSentAt)}
                              </span>
                            ) : (
                              <span>—</span>
                            )}
                            {invitation.url &&
                            invitation.status === "ready" &&
                            invitation.progress === 0 ? (
                              <div className="delivery-actions">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    updateDelivery("mark_sent", invitation)
                                  }
                                >
                                  {invitation.sendCount > 0
                                    ? ui.markResent
                                    : ui.markSent}
                                </button>
                                {invitation.sendCount > 0 ? (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      updateDelivery("reset_sent", invitation)
                                    }
                                  >
                                    {ui.resetSent}
                                  </button>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <div className="admin-note-cell">
                            <textarea
                              rows={2}
                              maxLength={1000}
                              aria-label={`${ui.comment}: ${invitation.code}`}
                              placeholder={ui.commentPlaceholder}
                              value={noteValue}
                              onChange={(event) =>
                                setNoteDrafts((current) => ({
                                  ...current,
                                  [invitation.id]: event.target.value,
                                }))
                              }
                            />
                            <div className="admin-note-actions">
                              <button
                                type="button"
                                disabled={
                                  !noteChanged || savingNoteId === invitation.id
                                }
                                onClick={() => saveNote(invitation)}
                              >
                                {savingNoteId === invitation.id
                                  ? ui.savingComment
                                  : savedNoteId === invitation.id
                                    ? ui.commentSaved
                                    : ui.saveComment}
                              </button>
                              <small>{noteValue.length}/1000</small>
                            </div>
                            {noteErrors[invitation.id] ? (
                              <small className="admin-note-error" role="alert">
                                {noteErrors[invitation.id]}
                              </small>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span className="profile-name">
                            {profile?.title[locale] ?? "—"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="details-button"
                            aria-expanded={expandedId === invitation.id}
                            onClick={() =>
                              setExpandedId((current) =>
                                current === invitation.id
                                  ? null
                                  : invitation.id,
                              )
                            }
                          >
                            {expandedId === invitation.id
                              ? ui.closeDetails
                              : ui.details}
                          </button>
                        </td>
                      </tr>
                      {expandedId === invitation.id ? (
                        <tr className="details-row">
                          <td colSpan={6}>
                            <div className="result-details">
                              <h3>{ui.technicalData}</h3>
                              <dl className="attempt-meta">
                                <div>
                                  <dt>{ui.language}</dt>
                                  <dd>
                                    {invitation.locale?.toUpperCase() ?? "—"}
                                  </dd>
                                </div>
                                <div>
                                  <dt>{ui.completed}</dt>
                                  <dd>{formatDate(invitation.completedAt)}</dd>
                                </div>
                                <div>
                                  <dt>{ui.sentCount}</dt>
                                  <dd>{invitation.sendCount}</dd>
                                </div>
                                <div>
                                  <dt>{ui.firstSent}</dt>
                                  <dd>{formatDate(invitation.firstSentAt)}</dd>
                                </div>
                                <div>
                                  <dt>{ui.lastSent}</dt>
                                  <dd>{formatDate(invitation.lastSentAt)}</dd>
                                </div>
                              </dl>
                              {invitation.scores ? (
                                <p className="score-line">
                                  A: {invitation.scores.A}, B:{" "}
                                  {invitation.scores.B}, C:{" "}
                                  {invitation.scores.C}, D:{" "}
                                  {invitation.scores.D}
                                </p>
                              ) : null}
                              {profile ? (
                                <>
                                  <h3>{profile.title[locale]}</h3>
                                  <h4>{ui.recommendations}</h4>
                                  {profile.sections.map((section) => (
                                    <p key={section.label.en}>
                                      <strong>{section.label[locale]}:</strong>{" "}
                                      {section.text[locale]}
                                    </p>
                                  ))}
                                </>
                              ) : null}
                              {invitation.answers.length > 0 ? (
                                <>
                                  <h4>{ui.answers}</h4>
                                  <ol>
                                    {invitation.answers.map((answer) => {
                                      const question =
                                        data.content.questions[
                                          answer.questionId - 1
                                        ];
                                      const answerLocale =
                                        invitation.locale ?? locale;
                                      return (
                                        <li key={answer.questionId}>
                                          <strong>
                                            {question.prompt[answerLocale]}
                                          </strong>
                                          <br />
                                          {answer.baseType}:{" "}
                                          {
                                            question.answers[answer.baseType][
                                              answerLocale
                                            ]
                                          }
                                        </li>
                                      );
                                    })}
                                  </ol>
                                </>
                              ) : null}
                              {invitation.status === "completed" &&
                              invitation.profileKey ? (
                                <button
                                  type="button"
                                  className="primary-button"
                                  onClick={() =>
                                    setReportTarget({
                                      invitationId: invitation.id,
                                      profileKey:
                                        invitation.profileKey as ProfileKey,
                                      locale: invitation.locale ?? locale,
                                    })
                                  }
                                >
                                  {ui.createReport}
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="danger-button"
                                disabled={busy}
                                onClick={() =>
                                  remove("invitation", invitation.id)
                                }
                              >
                                {ui.deleteRecord}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {reportTarget ? (
        <div
          className="report-builder-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-builder-title"
        >
          <div className="report-builder-dialog">
            <ReportBuilder
              key={reportTarget.invitationId}
              profileKey={reportTarget.profileKey}
              initialLocale={reportTarget.locale}
              onClose={() => setReportTarget(null)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
