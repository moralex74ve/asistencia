/* empty css                                 */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../chunks/index_DV7qvZ4L.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const usuario = await prisma.usuarios.findUnique({
    where: { id: user.id },
    select: {
      nombre: true,
      correo: true,
      rol: true
    }
  });
  if (!usuario) {
    Astro2.cookies.delete("session", { path: "/" });
    return Astro2.redirect("/login?error=user_not_found");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-center min-h-screen text-white"> <div class="border border-gray-600 rounded-lg p-8 bg-gray-800 shadow-lg"> <h1 class="text-3xl font-bold mb-6 text-center text-slate-100">Menu</h1> <div class="flex flex-col space-y-4 w-64"> <a href="/listado" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition-colors duration-300">
Listado de Miembros
</a> <a href="/eventos" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-center transition-colors duration-300">
Eventos
</a> <a href="/discipulado" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded text-center transition-colors duration-300">
Discipulado
</a> <div class="mt-8 pt-6 text-center"> <form action="/api/logout" method="POST" class="mt-8 space-y-4"> <button type="submit" class="w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
Cerrar sesión
</button> </form> <h2 class="pt-4">Bienvenido ${usuario.nombre}</h2> <!-- {userData.correo}
          {userData.rol} --> </div> </div> </div> </div> ` })}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
