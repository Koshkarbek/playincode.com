import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/600.css";
import { TestClient } from "@/features/profile-test/client/test-client";

export const metadata: Metadata = {
  title: "Тест профиля ребёнка | Play In Code",
  description: "Двуязычный тест учебных предпочтений ребёнка.",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return <TestClient />;
}
