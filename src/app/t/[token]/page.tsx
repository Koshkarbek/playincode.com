import type { Metadata } from "next";
import { TestClient } from "@/features/profile-test/client/test-client";

export const metadata: Metadata = {
  title: "Тест профиля ребёнка | Play In Code",
  description: "Двуязычный тест учебных предпочтений ребёнка.",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <div className="profile-test-root">
      <TestClient />
    </div>
  );
}
