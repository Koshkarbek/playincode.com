import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TestClient } from "../test-client";

jest.mock("next/navigation", () => ({
  useParams: () => ({ token: "test-token" }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("@gsap/react", () => ({
  useGSAP: () => undefined,
}));

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    timeline: jest.fn(() => ({ to: jest.fn().mockReturnThis() })),
  },
}));

const questionState = {
  status: "question",
  locale: "ru",
  progress: 0,
  total: 15,
  question: {
    id: 1,
    prompt: "Как ты начнёшь?",
    answers: [
      { id: 0, text: "По инструкции" },
      { id: 1, text: "Придумаю своё" },
      { id: 2, text: "Попробую наугад" },
      { id: 3, text: "Позову друзей" },
    ],
  },
} as const;

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: reducedMotion,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

describe("public profile test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia(true);
  });

  it("renders a localized question and its 15-step progress route", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => questionState,
    }) as jest.Mock;

    render(<TestClient />);

    expect(
      await screen.findByRole("heading", { name: "Как ты начнёшь?" })
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "15"
    );
    expect(
      screen.getByRole("button", { name: /По инструкции/ })
    ).toBeInTheDocument();
  });

  it("submits once immediately in reduced-motion mode and opens completion", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => questionState,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: "completed", locale: "ru" }),
      }) as jest.Mock;

    render(<TestClient />);
    const answer = await screen.findByRole("button", {
      name: /По инструкции/,
    });

    fireEvent.click(answer);
    fireEvent.click(answer);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Тест завершён")).toBeInTheDocument();

    const postCall = (global.fetch as jest.Mock).mock.calls[1];
    expect(postCall[1]).toMatchObject({ method: "POST" });
    expect(JSON.parse(postCall[1].body)).toEqual({
      action: "answer",
      questionId: 1,
      answerIndex: 0,
    });
  });

  it("keeps the selected answer and retries the same payload after an error", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => questionState,
      })
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: "completed", locale: "ru" }),
      }) as jest.Mock;

    render(<TestClient />);
    const answer = await screen.findByRole("button", {
      name: /По инструкции/,
    });
    fireEvent.click(answer);

    expect(
      await screen.findByText(/Не удалось сохранить ответ/)
    ).toBeInTheDocument();
    expect(answer).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Повторить" }));

    expect(await screen.findByText("Тест завершён")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect((global.fetch as jest.Mock).mock.calls[1][1].body).toBe(
      (global.fetch as jest.Mock).mock.calls[2][1].body
    );
  });
});
