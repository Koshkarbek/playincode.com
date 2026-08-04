import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SchoolClient } from "../school-client";

const testUrl = "https://playincode.example/profile-test";

function mockSchoolData(invitations: Array<Record<string, unknown>> = []) {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        testUrl,
        content: { profiles: {}, questions: [] },
        batches: [],
        invitations,
      }),
    }) as jest.Mock;
}

function invitation(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: "invite-1",
    batchId: "batch-1",
    code: "STU-A1B2C3D4",
    url: testUrl,
    locale: null,
    status: "ready",
    progress: 0,
    scores: null,
    profileKey: null,
    createdAt: 1,
    completedAt: null,
    firstSentAt: null,
    lastSentAt: null,
    sendCount: 0,
    adminNote: null,
    adminNoteUpdatedAt: null,
    answers: [],
    ...overrides,
  };
}

describe("school dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the shared test address when no batches exist", async () => {
    mockSchoolData();

    render(<SchoolClient />);

    expect(await screen.findByDisplayValue(testUrl)).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: "Общий адрес теста",
      }),
    ).not.toBeInTheDocument();
  });

  it("copies the shared address and personal code from the code cell", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    mockSchoolData([invitation()]);

    render(<SchoolClient />);
    fireEvent.click(await screen.findByRole("button", { name: "Копировать" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `Тест Play In Code: ${testUrl}\nВаш персональный код: STU-A1B2C3D4`,
      ),
    );
    expect(
      await screen.findByRole("button", { name: "Скопировано" }),
    ).toBeInTheDocument();
  });

  it("saves an edited internal comment explicitly", async () => {
    mockSchoolData([invitation()]);
    render(<SchoolClient />);

    const input = await screen.findByLabelText("Комментарий: STU-A1B2C3D4");
    fireEvent.change(input, {
      target: { value: "Мама Айдана — отправлен PDF" },
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        invitationId: "invite-1",
        adminNote: "Мама Айдана — отправлен PDF",
        adminNoteUpdatedAt: 123,
      }),
    });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenLastCalledWith("/api/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_note",
          invitationId: "invite-1",
          note: "Мама Айдана — отправлен PDF",
        }),
      }),
    );
    expect(
      await screen.findByRole("button", { name: "Сохранено" }),
    ).toBeDisabled();
  });

  it("keeps the draft visible when comment saving fails", async () => {
    mockSchoolData([invitation()]);
    render(<SchoolClient />);

    const input = await screen.findByLabelText("Комментарий: STU-A1B2C3D4");
    fireEvent.change(input, { target: { value: "Не потерять этот текст" } });
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(
      await screen.findByText("Не удалось сохранить комментарий."),
    ).toBeInTheDocument();
    expect(input).toHaveValue("Не потерять этот текст");
  });

  it("finds records by their internal comment", async () => {
    mockSchoolData([
      invitation({ adminNote: "Отправили презентацию маме" }),
      invitation({
        id: "invite-2",
        code: "STU-Z9Y8X7W6",
        adminNote: "Ждём ответа папы",
      }),
    ]);
    render(<SchoolClient />);

    fireEvent.change(await screen.findByRole("searchbox"), {
      target: { value: "презентацию" },
    });

    expect(screen.getByText("STU-A1B2C3D4")).toBeInTheDocument();
    expect(screen.queryByText("STU-Z9Y8X7W6")).not.toBeInTheDocument();
  });

  it("includes the internal comment in CSV export", async () => {
    const createObjectURL = jest.fn().mockReturnValue("blob:test");
    const revokeObjectURL = jest.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation();
    mockSchoolData([
      invitation({ adminNote: "Отправлен индивидуальный профиль" }),
    ]);
    render(<SchoolClient />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Скачать результаты CSV",
      }),
    );

    const blob = createObjectURL.mock.calls[0][0] as Blob;
    const csv = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blob);
    });
    expect(csv).toContain('"Комментарий"');
    expect(csv).toContain('"Отправлен индивидуальный профиль"');
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });
});
