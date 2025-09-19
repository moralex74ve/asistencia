import { defineMiddleware } from "astro:middleware";
import jwt from 'jsonwebtoken';

// Rutas que requieren solo autenticación
const protectedRoutes = ["/dashboard"];

// Rutas que requieren rol de administrador
const adminRoutes = ["/users"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, locals } = context;
  const pathname = url.pathname;

  const onProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const onAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Si no es una ruta protegida, continuar.
  if (!onProtectedRoute && !onAdminRoute) {
    return next();
  }

  // 1. Obtener el token de la cookie
  const token = cookies.get("session")?.value;
  if (!token) {
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  try {
    // 2. Verificar el token JWT
    const decoded = jwt.verify(token, import.meta.env.JWT_SECRET);
    
    // 3. Almacenar los datos del usuario en context.locals
    // Aseguramos que el payload decodificado tiene la estructura esperada
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'rol' in decoded) {
      locals.user = {
        id: decoded.id,
        rol: decoded.rol,
      };
    } else {
      throw new Error("Token con formato inválido");
    }

  } catch (error) {
    // Si el token es inválido o ha expirado, borrar la cookie y redirigir al login
    cookies.delete("session", { path: "/" });
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // 4. Verificar el rol para rutas de administrador
  if (onAdminRoute) {
    if (locals.user.rol !== "admin") {
      // Redirigir si el usuario no es admin
      return redirect("/dashboard?error=unauthorized");
    }
  }

  // 5. Si todo es correcto, continuar con la solicitud
  return next();
});
