import { normalizeAccessCode } from "@/features/profile-test/access-code";

describe("profile-test code access", () => {
  it("normalizes casing and surrounding whitespace", () => {
    expect(normalizeAccessCode("  stu-a1b2c3d4 \n")).toBe(
      "STU-A1B2C3D4",
    );
  });

  it("rejects non-string values without coercing them", () => {
    expect(normalizeAccessCode(12345678)).toBe("");
    expect(normalizeAccessCode(null)).toBe("");
  });
});
