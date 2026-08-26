import { jwtVerify, SignJWT } from 'jose';

const CSRF_SECRET = new TextEncoder().encode(
  "5fe5ddf412dfa8dfe085d4cab58525b7"
);
const CSRF_COOKIE_NAME = "csrf_session";
async function generateCsrfToken() {
  return new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h").sign(CSRF_SECRET);
}
async function validateCsrfToken(token) {
  try {
    await jwtVerify(token, CSRF_SECRET);
    return true;
  } catch {
    return false;
  }
}
function setCsrfCookie(cookies, token) {
  cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60
    // 1 hour
  });
}
function getCsrfToken(cookies) {
  return cookies.get(CSRF_COOKIE_NAME)?.value;
}

export { getCsrfToken as a, generateCsrfToken as g, setCsrfCookie as s, validateCsrfToken as v };
