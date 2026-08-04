/** @jest-environment node */

import { NextRequest } from "next/server";
import { getDb } from "@/db";
import {
  isAdmin,
  isSameOrigin,
} from "@/features/profile-test/server/admin-auth";
import { POST } from "../route";

jest.mock("@/db", () => ({
  getDb: jest.fn(),
  runDbBatch: jest.fn(),
}));

jest.mock("@/features/profile-test/server/admin-auth", () => ({
  isAdmin: jest.fn(),
  isSameOrigin: jest.fn(),
}));

const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;
const mockedIsSameOrigin = isSameOrigin as jest.MockedFunction<
  typeof isSameOrigin
>;

function request(body: unknown) {
  return new NextRequest("https://playincode.example/api/school", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://playincode.example",
    },
    body: JSON.stringify(body),
  });
}

function mockUpdateResult(
  rows: Array<{
    id: string;
    adminNote: string | null;
    adminNoteUpdatedAt: number | null;
  }>,
) {
  const returning = jest.fn().mockResolvedValue(rows);
  const where = jest.fn(() => ({ returning }));
  const set = jest.fn(() => ({ where }));
  const update = jest.fn(() => ({ set }));
  mockedGetDb.mockResolvedValue({ update } as never);
  return { update, set, where, returning };
}

describe("POST /api/school update_note", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsSameOrigin.mockReturnValue(true);
    mockedIsAdmin.mockResolvedValue(true);
  });

  it("rejects cross-origin requests", async () => {
    mockedIsSameOrigin.mockReturnValue(false);
    const response = await POST(
      request({ action: "update_note", invitationId: "invite-1", note: "x" }),
    );
    expect(response.status).toBe(403);
    expect(mockedGetDb).not.toHaveBeenCalled();
  });

  it("requires an authenticated school administrator", async () => {
    mockedIsAdmin.mockResolvedValue(false);
    const response = await POST(
      request({ action: "update_note", invitationId: "invite-1", note: "x" }),
    );
    expect(response.status).toBe(401);
    expect(mockedGetDb).not.toHaveBeenCalled();
  });

  it.each([
    [{ action: "update_note", invitationId: "invite-1", note: 42 }],
    [
      {
        action: "update_note",
        invitationId: "invite-1",
        note: "x".repeat(1001),
      },
    ],
  ])("rejects an invalid note payload", async (body) => {
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_note" });
    expect(mockedGetDb).not.toHaveBeenCalled();
  });

  it("returns 404 when the invitation does not exist", async () => {
    mockUpdateResult([]);
    const response = await POST(
      request({ action: "update_note", invitationId: "missing", note: "x" }),
    );
    expect(response.status).toBe(404);
  });

  it("saves newlines and returns the updated note", async () => {
    const note = "Мама Айдана\nОтправлен PDF";
    const db = mockUpdateResult([
      {
        id: "invite-1",
        adminNote: note,
        adminNoteUpdatedAt: 123,
      },
    ]);
    const response = await POST(
      request({ action: "update_note", invitationId: "invite-1", note }),
    );

    expect(response.status).toBe(200);
    expect(db.set).toHaveBeenCalledWith(
      expect.objectContaining({ adminNote: note }),
    );
    await expect(response.json()).resolves.toEqual({
      invitationId: "invite-1",
      adminNote: note,
      adminNoteUpdatedAt: 123,
    });
  });

  it("clears an empty note and its update timestamp", async () => {
    const db = mockUpdateResult([
      { id: "invite-1", adminNote: null, adminNoteUpdatedAt: null },
    ]);
    const response = await POST(
      request({ action: "update_note", invitationId: "invite-1", note: "" }),
    );

    expect(response.status).toBe(200);
    expect(db.set).toHaveBeenCalledWith({
      adminNote: null,
      adminNoteUpdatedAt: null,
    });
  });
});
