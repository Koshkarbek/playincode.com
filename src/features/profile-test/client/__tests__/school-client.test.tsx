import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SchoolClient } from "../school-client";

const testUrl = "https://playincode.example/profile-test";

function mockSchoolData(
  invitations: Array<Record<string, unknown>> = [],
) {
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

describe("school dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the shared test address when no batches exist", async () => {
    mockSchoolData();

    render(<SchoolClient />);

    expect(
      await screen.findByDisplayValue(testUrl),
    ).toBeInTheDocument();
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
    mockSchoolData([
      {
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
        answers: [],
      },
    ]);

    render(<SchoolClient />);
    fireEvent.click(
      await screen.findByRole("button", { name: "Копировать" }),
    );

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `Тест Play In Code: ${testUrl}\nВаш персональный код: STU-A1B2C3D4`,
      ),
    );
    expect(
      await screen.findByRole("button", { name: "Скопировано" }),
    ).toBeInTheDocument();
  });
});
