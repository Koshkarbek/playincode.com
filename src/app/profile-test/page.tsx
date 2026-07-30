import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/unbounded/500.css";
import { CodeAccessClient } from "@/features/profile-test/client/code-access-client";

export const metadata: Metadata = {
  title: "Вход в тест | Play In Code",
  description: "Вход в тест профиля ребёнка по персональному коду.",
  robots: { index: false, follow: false },
};

export default function ProfileTestAccessPage() {
  return <CodeAccessClient />;
}
