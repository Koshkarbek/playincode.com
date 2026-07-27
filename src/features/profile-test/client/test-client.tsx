"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { localize, publicCopy } from "@/features/profile-test/public-copy";
import type { Locale } from "@/features/profile-test/types";

type QuestionState = {
  status: "question";
  locale: Locale;
  progress: number;
  total: number;
  question: {
    id: number;
    prompt: string;
    answers: Array<{ id: number; text: string }>;
  };
};

type TestState =
  | { status: "loading" }
  | { status: "choose_locale" }
  | { status: "completed"; locale: Locale }
  | { status: "invalid" }
  | QuestionState;

const labels: Record<Locale, string[]> = {
  ru: ["А", "Б", "В", "Г"],
  en: ["A", "B", "C", "D"],
};

export function TestClient() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [state, setState] = useState<TestState>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(`/api/test/${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as TestState;
      setState(response.status === 404 ? { status: "invalid" } : data);
    } catch {
      setError(publicCopy.networkError.ru);
    }
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/test/${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => ({
        response,
        data: (await response.json()) as TestState,
      }))
      .then(({ response, data }) => {
        setState(response.status === 404 ? { status: "invalid" } : data);
      })
      .catch((requestError: unknown) => {
        if (
          !(requestError instanceof DOMException) ||
          requestError.name !== "AbortError"
        ) {
          setError(publicCopy.networkError.ru);
        }
      });
    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    if ("locale" in state) document.documentElement.lang = state.locale;
  }, [state]);

  async function submit(body: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/test/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as TestState;
      setState(response.status === 404 ? { status: "invalid" } : data);
    } catch {
      const locale = "locale" in state ? state.locale : "ru";
      setError(localize(publicCopy.networkError, locale));
    } finally {
      setBusy(false);
    }
  }

  if (state.status === "loading") {
    return (
      <main className="simple-page" aria-live="polite">
        <p>{publicCopy.loading.ru}</p>
        <p lang="en">{publicCopy.loading.en}</p>
      </main>
    );
  }

  if (state.status === "invalid") {
    return (
      <main className="simple-page">
        <p>{publicCopy.invalidLink.ru}</p>
        <p lang="en">{publicCopy.invalidLink.en}</p>
      </main>
    );
  }

  if (state.status === "choose_locale") {
    return (
      <main className="test-page">
        <section className="test-card" aria-labelledby="language-title">
          <h1 id="language-title">
            {publicCopy.chooseLanguage.ru} / {publicCopy.chooseLanguage.en}
          </h1>
          <div className="language-buttons">
            <button
              type="button"
              disabled={busy}
              onClick={() => submit({ action: "set_locale", locale: "ru" })}
            >
              Русский
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => submit({ action: "set_locale", locale: "en" })}
            >
              English
            </button>
          </div>
          {error ? <p className="error-message">{error}</p> : null}
        </section>
      </main>
    );
  }

  if (state.status === "completed") {
    return (
      <main className="simple-page">
        <h1>{localize(publicCopy.thankYou, state.locale)}</h1>
      </main>
    );
  }

  const locale = state.locale;
  return (
    <main className="test-page">
      <section className="test-card" aria-labelledby="question-title">
        <p className="progress">
          {localize(publicCopy.question, locale)} {state.progress + 1}{" "}
          {localize(publicCopy.of, locale)} {state.total}
        </p>
        <h1 id="question-title">{state.question.prompt}</h1>
        <div className="answer-list">
          {state.question.answers.map((answer) => (
            <button
              key={answer.id}
              type="button"
              disabled={busy}
              onClick={() =>
                submit({
                  action: "answer",
                  questionId: state.question.id,
                  answerIndex: answer.id,
                })
              }
            >
              <span aria-hidden="true">{labels[locale][answer.id]})</span>{" "}
              {answer.text}
            </button>
          ))}
        </div>
        {error ? (
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button type="button" onClick={load}>
              {localize(publicCopy.retry, locale)}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
