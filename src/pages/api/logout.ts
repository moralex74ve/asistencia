import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Eliminar la cookie de sesión
  cookies.delete("session", {
    path: "/"
  });
  
  // Redireccionar al login
  return redirect("/login");
};