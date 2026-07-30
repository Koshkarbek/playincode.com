import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CodeAccessClient } from "../code-access-client";

describe("code access page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits the entered code and shows a generic invalid-code error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "invalid_code" }),
    }) as jest.Mock;

    render(<CodeAccessClient />);
    fireEvent.change(screen.getByLabelText("Персональный код"), {
      target: { value: "stu-a1b2c3d4" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Открыть тест" }));

    expect(
      await screen.findByText(/Код не найден/),
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/test/access",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ code: "STU-A1B2C3D4" }),
      }),
    );
  });

  it('shows "contact your manager" after rate limiting', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: "rate_limited",
        contactManager: true,
      }),
    }) as jest.Mock;

    render(<CodeAccessClient />);
    fireEvent.change(screen.getByLabelText("Персональный код"), {
      target: { value: "STU-WRONG123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Открыть тест" }));

    await waitFor(() =>
      expect(
        screen.getByText(/Обратитесь к менеджеру/),
      ).toBeInTheDocument(),
    );
  });

  it("switches the access form to English", () => {
    render(<CodeAccessClient />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(
      screen.getByRole("heading", {
        name: "Enter your personal code",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open the test" }),
    ).toBeDisabled();
  });
});
