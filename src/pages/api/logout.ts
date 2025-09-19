import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Eliminar la cookie de sesión del navegador
  cookies.delete("session", { 
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD, // true en producción, false en desarrollo
    sameSite: "strict"
  });

  // Redirigir a la página de login
  return redirect("/login?logout=success");;
};