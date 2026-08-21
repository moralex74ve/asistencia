import { SignJWT, jwtVerify } from "jose";

const CSRF_SECRET = new TextEncoder().encode(
  import.meta.env.CSRF_SECRET || import.meta.env.JWT_SECRET,
);
const CSRF_COOKIE_NAME = "csrf_session";

export async function generateCsrfToken(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(CSRF_SECRET);
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, CSRF_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function setCsrfCookie(cookies: any, token: string) {
  cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
}

export function getCsrfToken(cookies: any): string | undefined {
  return cookies.get(CSRF_COOKIE_NAME)?.value;
}

export function deleteCsrfCookie(cookies: any) {
  cookies.delete(CSRF_COOKIE_NAME, { path: "/" });
}
