import { NextResponse } from "next/server";
import { checkAdminPassword, createSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body as { password?: string };

  if (!password || typeof password !== "string" || !checkAdminPassword(password)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
