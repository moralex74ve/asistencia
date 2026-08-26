/* empty css                                 */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_XNCnAOZu.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = Astro2.cookies.get("session");
  if (session) {
    return Astro2.redirect("/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-center min-h-screen text-white"> <div class="text-center"> <h1 class="text-5xl font-bold mb-4">Bienvenido</h1> <p class="text-xl mb-8">Por favor, inicia sesión para continuar.</p> <a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300">
Login
</a> </div> </div> ` })}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/index.astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
