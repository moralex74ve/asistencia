import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import {
  generateCsrfToken,
  setCsrfCookie,
  getCsrfToken,
  validateCsrfToken,
} from "./utils/csrf";

// Rutas que requieren solo autenticación
const protectedRoutes = [
  "/dashboard",
  "/listado",
  "/eventos",
  "/crear",
  "/editar",
];

// Rutas que requieren rol de administrador
const adminRoutes = ["/users"];

// Rutas que requieren validación CSRF (POST mutantes) - /login excluido (no requiere auth previa)
const csrfProtectedRoutes = ["/crear", "/editar", "/eventos", "/users"];

// Rutas donde generar CSRF token (GET para formularios)
const csrfGenerateRoutes = [
  "/login",
  "/crear",
  "/editar",
  "/eventos",
  "/users",
  "/dashboard",
  "/listado",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, locals, request } = context;
  const pathname = url.pathname;
  const method = request.method;

  const onProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const onAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const needsCsrf =
    csrfProtectedRoutes.some((route) => pathname.startsWith(route)) &&
    method === "POST";
  const isLoginPost = pathname === "/login" && method === "POST";
  const shouldGenerateCsrf =
    csrfGenerateRoutes.some((route) => pathname.startsWith(route)) &&
    method === "GET";

  // 1. Generar/renovar CSRF token para rutas con formularios (GET)
  if (shouldGenerateCsrf) {
    const csrfToken = await generateCsrfToken();
    setCsrfCookie(cookies, csrfToken);
    locals.csrfToken = csrfToken;
  }

  // 2. Validar CSRF para POST mutantes (incluye /login POST, no requiere auth)
  if (needsCsrf || isLoginPost) {
    const formData = await request.clone().formData();
    const submittedToken = formData.get("_csrf");
    const cookieToken = getCsrfToken(cookies);

    if (
      !submittedToken ||
      !cookieToken ||
      !(await validateCsrfToken(submittedToken as string))
    ) {
      return new Response("Token CSRF inválido", { status: 403 });
    }
  }

  // 3. Si no es ruta protegida ni admin, continuar (login, logout, etc.)
  if (!onProtectedRoute && !onAdminRoute) {
    const response = await next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    return response;
  }

  // 4. Rutas protegidas: verificar JWT y usuario en BD
  const token = cookies.get("session")?.value;
  if (!token) {
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  try {
    const decoded = jwt.verify(token, import.meta.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("id" in decoded) ||
      !("rol" in decoded)
    ) {
      throw new Error("Token con formato inválido");
    }

    const user = await prisma.usuarios.findUnique({
      where: { id: decoded.id },
      select: { id: true, rol: true, activo: true },
    });

    if (!user || !user.activo) {
      cookies.delete("session", { path: "/" });
      return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }

    locals.user = {
      id: user.id,
      rol: user.rol,
    };
  } catch (error) {
    cookies.delete("session", { path: "/" });
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // 5. Verificar rol admin
  if (onAdminRoute) {
    if (locals.user.rol !== "admin") {
      return redirect("/dashboard?error=unauthorized");
    }
  }

  // 6. Renovar CSRF token
  const csrfToken = await generateCsrfToken();
  setCsrfCookie(cookies, csrfToken);
  locals.csrfToken = csrfToken;

  // 7. Continuar
  const response = await next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
});
