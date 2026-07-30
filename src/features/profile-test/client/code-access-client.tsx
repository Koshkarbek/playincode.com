"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import styles from "./code-access-client.module.css";

type Locale = "ru" | "en";
type ErrorState = "" | "invalid" | "blocked" | "network";

const copy = {
  ru: {
    language: "English",
    eyebrow: "Тест профиля ребёнка",
    title: "Введите личный код",
    description:
      "Код указан в сообщении от менеджера Play In Code.",
    label: "Персональный код",
    placeholder: "STU-XXXXXXXX",
    submit: "Открыть тест",
    loading: "Проверяем код…",
    invalid: "Код не найден. Проверьте написание и попробуйте ещё раз.",
    blocked:
      "Слишком много неправильных попыток. Обратитесь к менеджеру.",
    network: "Не удалось проверить код. Проверьте интернет и повторите.",
  },
  en: {
    language: "Русский",
    eyebrow: "Student profile test",
    title: "Enter your personal code",
    description:
      "You can find the code in the message from your Play In Code manager.",
    label: "Personal code",
    placeholder: "STU-XXXXXXXX",
    submit: "Open the test",
    loading: "Checking the code…",
    invalid: "Code not found. Check it and try again.",
    blocked: "Too many incorrect attempts. Please contact your manager.",
    network: "Could not check the code. Check your connection and try again.",
  },
} as const;

export function CodeAccessClient() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorState>("");
  const ui = copy[locale];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/test/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await response.json()) as {
        redirectTo?: string;
        error?: string;
      };
      if (response.status === 429) {
        setError("blocked");
      } else if (!response.ok || !data.redirectTo) {
        setError("invalid");
      } else {
        window.location.assign(data.redirectTo);
        return;
      }
    } catch {
      setError("network");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="access-title">
        <div className={styles.topline}>
          <span className={styles.brand}>Play In Code</span>
          <button
            type="button"
            className={styles.language}
            onClick={() => {
              const next = locale === "ru" ? "en" : "ru";
              setLocale(next);
              document.documentElement.lang = next;
              setError("");
            }}
          >
            {ui.language}
          </button>
        </div>

        <div className={styles.icon} aria-hidden="true">
          <KeyRound />
        </div>
        <p className={styles.eyebrow}>{ui.eyebrow}</p>
        <h1 id="access-title">{ui.title}</h1>
        <p className={styles.description}>{ui.description}</p>

        <form onSubmit={submit} className={styles.form}>
          <label htmlFor="student-code">{ui.label}</label>
          <input
            id="student-code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder={ui.placeholder}
            autoComplete="one-time-code"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={64}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "code-error" : undefined}
            autoFocus
          />
          {error ? (
            <p id="code-error" className={styles.error} role="alert">
              {ui[error]}
            </p>
          ) : null}
          <button type="submit" disabled={busy || !code.trim()}>
            <span>{busy ? ui.loading : ui.submit}</span>
            {!busy ? <ArrowRight aria-hidden="true" /> : null}
          </button>
        </form>
      </section>
    </main>
  );
}
