import type { Metadata } from "next";
import { SchoolClient } from "@/features/profile-test/client/school-client";

export const metadata: Metadata = {
  title: "Школьная панель | Play In Code",
  description: "Защищённая панель результатов теста.",
  robots: { index: false, follow: false },
};

export default function SchoolPage() {
  return (
    <div className="profile-test-root">
      <SchoolClient />
    </div>
  );
}
