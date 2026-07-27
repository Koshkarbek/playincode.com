import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header Component", () => {
  it("renders logo", () => {
    render(<Header />);
    expect(screen.getByAltText("Play In Code")).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<Header />);
    expect(
      screen.getByRole("link", { name: "Получить урок" }),
    ).toBeInTheDocument();
  });

  it("CTA button links to WhatsApp", () => {
    render(<Header />);
    const button = screen.getByRole("link", { name: "Получить урок" });
    expect(button).toHaveAttribute("href");
    expect(button.getAttribute("href")).toContain("wa.me");
  });

  it("has correct link attributes for WhatsApp", () => {
    render(<Header />);
    const button = screen.getByRole("link", { name: "Получить урок" });
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });
});
