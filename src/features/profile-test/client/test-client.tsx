"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Globe2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { localize, publicCopy } from "@/features/profile-test/public-copy";
import type { Locale } from "@/features/profile-test/types";
import styles from "./test-client.module.css";

gsap.registerPlugin(useGSAP);

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

type SubmitBody = Record<string, unknown>;

const labels: Record<Locale, string[]> = {
  ru: ["А", "Б", "В", "Г"],
  en: ["A", "B", "C", "D"],
};

function Brand() {
  return (
    <div className={styles.brand}>
      <Image
        src="/logo.svg"
        alt="Play In Code"
        width={258}
        height={54}
        priority
        className={cn(styles.logo, styles.desktopLogo)}
      />
      <Image
        src="/frame-48095626.svg"
        alt="Play In Code"
        width={1024}
        height={1024}
        priority
        className={cn(styles.logo, styles.mobileLogo)}
      />
      <span className={styles.brandDivider} aria-hidden="true" />
      <span className={styles.brandLabel}>Profile test</span>
    </div>
  );
}

function Card({
  children,
  labelledBy,
  className,
}: {
  children: React.ReactNode;
  labelledBy: string;
  className?: string;
}) {
  return (
    <section
      className={cn(styles.card, className)}
      aria-labelledby={labelledBy}
      data-test-card
    >
      {children}
    </section>
  );
}

function Alert({
  message,
  action,
  actionLabel,
  busy = false,
}: {
  message: string;
  action?: () => void;
  actionLabel?: string;
  busy?: boolean;
}) {
  return (
    <div className={styles.alert} role="alert">
      <AlertCircle aria-hidden="true" />
      <div className={styles.alertContent}>
        <p>{message}</p>
        {action && actionLabel ? (
          <button
            type="button"
            className={styles.textButton}
            onClick={action}
            disabled={busy}
          >
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <Card labelledBy="loading-title" className={styles.loadingCard}>
      <div className={styles.cardHeader}>
        <div className={cn(styles.skeleton, styles.skeletonBadge)} />
        <h1 id="loading-title" className={styles.srOnly}>
          {publicCopy.loading.ru} / {publicCopy.loading.en}
        </h1>
        <div className={cn(styles.skeleton, styles.skeletonTitle)} />
        <div className={cn(styles.skeleton, styles.skeletonText)} />
      </div>
      <div className={styles.skeletonList} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={cn(styles.skeleton, styles.skeletonAnswer)}
          />
        ))}
      </div>
      <p className={styles.loadingText} aria-live="polite">
        {publicCopy.loading.ru} <span lang="en">/ {publicCopy.loading.en}</span>
      </p>
    </Card>
  );
}

function LanguageScreen({
  busy,
  error,
  onChoose,
}: {
  busy: boolean;
  error: string;
  onChoose: (locale: Locale) => void;
}) {
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);

  function choose(locale: Locale) {
    setSelectedLocale(locale);
    onChoose(locale);
  }

  return (
    <Card labelledBy="language-title">
      <div className={styles.cardHeader}>
        <span className={styles.eyebrow}>
          <Globe2 aria-hidden="true" />
          Play In Code
        </span>
        <h1 id="language-title">
          {publicCopy.chooseLanguage.ru}
          <span lang="en">{publicCopy.chooseLanguage.en}</span>
        </h1>
        <p className={styles.description}>
          {publicCopy.languageHint.ru}
          <span lang="en">{publicCopy.languageHint.en}</span>
        </p>
      </div>
      <div className={styles.languageButtons}>
        <button
          type="button"
          className={cn(
            styles.languageButton,
            selectedLocale === "ru" && styles.languageButtonSelected
          )}
          disabled={busy}
          aria-pressed={selectedLocale === "ru"}
          onClick={() => choose("ru")}
        >
          Русский
          <span aria-hidden="true">RU</span>
        </button>
        <button
          type="button"
          className={cn(
            styles.languageButton,
            selectedLocale === "en" && styles.languageButtonSelected
          )}
          disabled={busy}
          aria-pressed={selectedLocale === "en"}
          onClick={() => choose("en")}
        >
          English
          <span aria-hidden="true">EN</span>
        </button>
      </div>
      {error ? <Alert message={error} /> : null}
      <p className={styles.privacyNote}>
        {publicCopy.privacyNote.ru}{" "}
        <span lang="en">/ {publicCopy.privacyNote.en}</span>
      </p>
    </Card>
  );
}

function CodeRoute({
  progress,
  total,
  locale,
}: {
  progress: number;
  total: number;
  locale: Locale;
}) {
  const current = progress + 1;
  return (
    <div
      className={styles.route}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`${localize(publicCopy.question, locale)} ${current} ${localize(publicCopy.of, locale)} ${total}`}
    >
      <div className={styles.routeMeta}>
        <span>
          {localize(publicCopy.question, locale)}{" "}
          <strong>{String(current).padStart(2, "0")}</strong>
        </span>
        <span>
          {Math.round((progress / total) * 100)}
          <small>%</small>
        </span>
      </div>
      <div className={styles.routeTrack} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              styles.routeStep,
              index < progress && styles.routeStepDone,
              index === progress && styles.routeStepCurrent
            )}
          >
            {index < progress ? <Check /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuestionScreen({
  state,
  selected,
  busy,
  error,
  onAnswer,
  onRetry,
}: {
  state: QuestionState;
  selected: number | null;
  busy: boolean;
  error: string;
  onAnswer: (answerId: number) => void;
  onRetry: () => void;
}) {
  const locale = state.locale;
  return (
    <Card labelledBy="question-title">
      <CodeRoute
        progress={state.progress}
        total={state.total}
        locale={locale}
      />
      <div className={styles.questionHeader}>
        <p className={styles.questionHint}>
          {localize(publicCopy.chooseAnswer, locale)}
        </p>
        <h1 id="question-title">{state.question.prompt}</h1>
      </div>
      <div
        className={styles.answerList}
        role="group"
        aria-labelledby="question-title"
      >
        {state.question.answers.map((answer) => {
          const isSelected = selected === answer.id;
          return (
            <button
              key={answer.id}
              type="button"
              className={cn(
                styles.answerButton,
                isSelected && styles.answerSelected
              )}
              disabled={busy || selected !== null}
              aria-pressed={isSelected}
              onClick={() => onAnswer(answer.id)}
              data-answer={answer.id}
            >
              <span className={styles.answerLabel} aria-hidden="true">
                {isSelected ? <Check /> : labels[locale][answer.id]}
              </span>
              <span>{answer.text}</span>
            </button>
          );
        })}
      </div>
      {error ? (
        <Alert
          message={error}
          action={onRetry}
          actionLabel={localize(publicCopy.retry, locale)}
          busy={busy}
        />
      ) : null}
      <p className={styles.autoSave}>
        <Sparkles aria-hidden="true" />
        {localize(publicCopy.autoSave, locale)}
      </p>
    </Card>
  );
}

function CompletedScreen({ locale }: { locale: Locale }) {
  return (
    <Card labelledBy="completed-title" className={styles.completedCard}>
      <div className={styles.successMark} data-success-mark>
        <CheckCircle2 aria-hidden="true" />
      </div>
      <div className={styles.cardHeader}>
        <p className={styles.eyebrow}>
          {localize(publicCopy.completedEyebrow, locale)}
        </p>
        <h1 id="completed-title">{localize(publicCopy.thankYou, locale)}</h1>
        <p className={styles.description}>
          {localize(publicCopy.completedHint, locale)}
        </p>
      </div>
      <div className={styles.completedRoute} aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => (
          <span key={index}>
            <Check />
          </span>
        ))}
      </div>
    </Card>
  );
}

function InvalidScreen() {
  return (
    <Card labelledBy="invalid-title" className={styles.messageCard}>
      <span className={styles.messageIcon}>
        <AlertCircle aria-hidden="true" />
      </span>
      <div className={styles.cardHeader}>
        <p className={styles.eyebrow}>Play In Code</p>
        <h1 id="invalid-title">
          {publicCopy.invalidTitle.ru}
          <span lang="en">{publicCopy.invalidTitle.en}</span>
        </h1>
        <p className={styles.description}>
          {publicCopy.invalidLink.ru}
          <span lang="en">{publicCopy.invalidLink.en}</span>
        </p>
      </div>
    </Card>
  );
}

export function TestClient() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const shellRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<TestState>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [pendingBody, setPendingBody] = useState<SubmitBody | null>(null);

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

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;
      gsap.fromTo(
        "[data-test-card]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );
      if (state.status === "completed") {
        gsap.fromTo(
          "[data-success-mark]",
          { scale: 0.72, rotate: -8 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(1.8)",
            delay: 0.12,
          }
        );
      }
    },
    {
      scope: shellRef,
      dependencies: [
        state.status,
        state.status === "question" ? state.question.id : 0,
      ],
      revertOnUpdate: true,
    }
  );

  async function submit(body: SubmitBody) {
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
      if (!response.ok && response.status !== 404 && !("status" in data)) {
        throw new Error("Request failed");
      }
      setSelected(null);
      setPendingBody(null);
      setState(response.status === 404 ? { status: "invalid" } : data);
    } catch {
      const locale = "locale" in state ? state.locale : "ru";
      setError(localize(publicCopy.networkError, locale));
    } finally {
      setBusy(false);
    }
  }

  function chooseAnswer(answerId: number) {
    if (busy || selected !== null || state.status !== "question") return;
    const body = {
      action: "answer",
      questionId: state.question.id,
      answerIndex: answerId,
    };
    setSelected(answerId);
    setPendingBody(body);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      void submit(body);
      return;
    }

    const selectedButton = shellRef.current?.querySelector(
      `[data-answer="${answerId}"]`
    );
    if (!selectedButton) {
      void submit(body);
      return;
    }
    const timeline = gsap.timeline({
      onComplete: () => void submit(body),
    });
    timeline
      .to(selectedButton, {
        scale: 1.012,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(selectedButton, {
        scale: 1,
        duration: 0.18,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.14 });
  }

  const retryPending = () => {
    if (pendingBody) void submit(pendingBody);
    else void load();
  };

  let screen: React.ReactNode;
  if (state.status === "loading") {
    screen = <LoadingScreen />;
  } else if (state.status === "invalid") {
    screen = <InvalidScreen />;
  } else if (state.status === "choose_locale") {
    screen = (
      <LanguageScreen
        busy={busy}
        error={error}
        onChoose={(locale) => void submit({ action: "set_locale", locale })}
      />
    );
  } else if (state.status === "completed") {
    screen = <CompletedScreen locale={state.locale} />;
  } else {
    screen = (
      <QuestionScreen
        state={state}
        selected={selected}
        busy={busy}
        error={error}
        onAnswer={chooseAnswer}
        onRetry={retryPending}
      />
    );
  }

  return (
    <main className={styles.page} ref={shellRef}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span>{"{"}</span>
        <span>{"</>"}</span>
        <span>{"()"}</span>
      </div>
      <header className={styles.header}>
        <Brand />
      </header>
      <div className={styles.stage}>{screen}</div>
      <footer className={styles.footer}>
        <span>Play In Code</span>
        <span>{publicCopy.footer.ru}</span>
        <span lang="en">{publicCopy.footer.en}</span>
      </footer>
    </main>
  );
}
