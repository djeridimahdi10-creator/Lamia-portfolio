"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "LaAk124mia";
}

/**
 * Derives a cryptographically secure, deterministic session token from the admin password.
 */
function getExpectedSessionToken(): string {
  const adminPassword = getAdminPassword();
  return crypto
    .createHash("sha256")
    .update(`studio_admin_session_salt_${adminPassword}`)
    .digest("hex");
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function safeCompareStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function validateAdminPassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const adminPassword = getAdminPassword();

  if (!safeCompareStrings(password, adminPassword)) {
    return { success: false, error: "wrongPassword" };
  }

  const expectedToken = getExpectedSessionToken();

  // Set HTTP-only cookie on success
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, expectedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function checkAdminAuth(): Promise<boolean> {
  const expectedToken = getExpectedSessionToken();

  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  if (!session?.value) return false;

  return safeCompareStrings(session.value, expectedToken);
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
