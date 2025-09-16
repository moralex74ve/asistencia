import { defineMiddleware } from 'astro:middleware';

// Rutas que requieren solo autenticación (no necesariamente admin)
const protectedRoutes = ['/dashboard', '/crear', '/listado', '/eventos', '/editar'];

// Rutas que requieren rol de administrador
const adminRoutes = ['/users'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  const onProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const onAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Si no es una ruta protegida, continuar sin hacer nada.
  if (!onProtectedRoute && !onAdminRoute) {
    return next();
  }

  // Para todas las rutas protegidas (incluidas las de admin), verificar la sesión.
  const sessionCookie = cookies.get('session');
  if (!sessionCookie) {
    // Guardar la URL a la que se intentaba acceder para redirigir después del login
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Si es una ruta de admin, realizar la verificación de rol adicional.
  if (onAdminRoute) {
    const userCookie = cookies.get('user');
    if (!userCookie) {
      return redirect('/dashboard?error=unauthorized');
    }

    try {
      const user = JSON.parse(userCookie.value);
      if (user.rol !== 'admin') {
        return redirect('/dashboard?error=unauthorized');
      }
    } catch (e) {
      // Si la cookie está malformada, denegar acceso.
      return redirect('/dashboard?error=unauthorized');
    }
  }

  // Si pasó todas las verificaciones, continuar.
  return next();
});
