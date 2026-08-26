import { d as defineMiddleware, s as sequence } from './chunks/index_BIYxzCP0.mjs';
import jwt from 'jsonwebtoken';
import { p as prisma } from './chunks/index_DV7qvZ4L.mjs';
import { g as generateCsrfToken, s as setCsrfCookie, a as getCsrfToken, v as validateCsrfToken } from './chunks/csrf_uqab3ft7.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_qUG21trQ.mjs';
import 'kleur/colors';
import './chunks/astro/server_BGMrdG95.mjs';
import 'clsx';
import 'cookie';

const protectedRoutes = [
  "/dashboard",
  "/listado",
  "/eventos",
  "/crear",
  "/editar"
];
const adminRoutes = ["/users"];
const csrfProtectedRoutes = ["/crear", "/editar", "/eventos", "/users"];
const csrfGenerateRoutes = [
  "/login",
  "/crear",
  "/editar",
  "/eventos",
  "/users",
  "/dashboard",
  "/listado"
];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, locals, request } = context;
  const pathname = url.pathname;
  const method = request.method;
  const onProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  );
  const onAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const needsCsrf = csrfProtectedRoutes.some((route) => pathname.startsWith(route)) && method === "POST";
  const isLoginPost = pathname === "/login" && method === "POST";
  const shouldGenerateCsrf = csrfGenerateRoutes.some((route) => pathname.startsWith(route)) && method === "GET";
  if (shouldGenerateCsrf) {
    const csrfToken2 = await generateCsrfToken();
    setCsrfCookie(cookies, csrfToken2);
    locals.csrfToken = csrfToken2;
  }
  if (needsCsrf || isLoginPost) {
    const formData = await request.clone().formData();
    const submittedToken = formData.get("_csrf");
    const cookieToken = getCsrfToken(cookies);
    if (!submittedToken || !cookieToken || !await validateCsrfToken(submittedToken)) {
      return new Response("Token CSRF inválido", { status: 403 });
    }
  }
  if (!onProtectedRoute && !onAdminRoute) {
    const response2 = await next();
    response2.headers.set("X-Frame-Options", "DENY");
    response2.headers.set("X-Content-Type-Options", "nosniff");
    response2.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response2.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    return response2;
  }
  const token = cookies.get("session")?.value;
  if (!token) {
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
  try {
    const decoded = jwt.verify(token, "5fe5ddf412dfa8dfe085d4cab58525b7", {
      algorithms: ["HS256"]
    });
    if (typeof decoded !== "object" || decoded === null || !("id" in decoded) || !("rol" in decoded)) {
      throw new Error("Token con formato inválido");
    }
    const user = await prisma.usuarios.findUnique({
      where: { id: decoded.id },
      select: { id: true, rol: true, activo: true }
    });
    if (!user || !user.activo) {
      cookies.delete("session", { path: "/" });
      return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    locals.user = {
      id: user.id,
      rol: user.rol
    };
  } catch (error) {
    cookies.delete("session", { path: "/" });
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
  if (onAdminRoute) {
    if (locals.user.rol !== "admin") {
      return redirect("/dashboard?error=unauthorized");
    }
  }
  const csrfToken = await generateCsrfToken();
  setCsrfCookie(cookies, csrfToken);
  locals.csrfToken = csrfToken;
  const response = await next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
