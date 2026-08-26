/* empty css                                 */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../chunks/index_DV7qvZ4L.mjs';
import jwt from 'jsonwebtoken';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://moralex74.duckdns.org");
const $$Eventos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Eventos;
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const intent = formData.get("intent")?.toString();
      if (intent === "crear") {
        const nombre = formData.get("nombre")?.toString();
        const fechaStr = formData.get("fecha")?.toString();
        if (nombre && fechaStr) {
          const eventDate = /* @__PURE__ */ new Date(`${fechaStr}T00:00:00Z`);
          await prisma.evento.create({
            data: {
              nombre,
              fecha: eventDate
            }
          });
          return Astro2.redirect("/eventos");
        }
      } else if (intent === "actualizar") {
        const id = formData.get("id")?.toString();
        const nombre = formData.get("nombre")?.toString();
        const fechaStr = formData.get("fecha")?.toString();
        if (id && nombre && fechaStr) {
          const eventDate = /* @__PURE__ */ new Date(`${fechaStr}T00:00:00Z`);
          await prisma.evento.update({
            where: { id },
            data: {
              nombre,
              fecha: eventDate
            }
          });
          return Astro2.redirect("/eventos");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  if (Astro2.request.method === "DELETE") {
    const token = Astro2.cookies.get("session")?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      jwt.verify(token, "5fe5ddf412dfa8dfe085d4cab58525b7", { algorithms: ["HS256"] });
    } catch {
      return new Response(JSON.stringify({ success: false, message: "Sesión inválida" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = new URL(Astro2.request.url);
    const id = url.searchParams.get("id");
    if (id) {
      try {
        const asistenciaCount = await prisma.asistencia.count({
          where: { evento_id: id }
        });
        if (asistenciaCount > 0) {
          return new Response(JSON.stringify({
            success: false,
            message: "No se puede eliminar un evento con registros de asistencia"
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        await prisma.evento.delete({ where: { id } });
        return new Response(JSON.stringify({
          success: true,
          message: "Evento eliminado"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({
          success: false,
          message: "Error al eliminar"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }
  const eventos = await prisma.evento.findMany({
    orderBy: { fecha: "desc" },
    include: {
      _count: {
        select: { asistencia: true }
      }
    }
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Administración de Eventos" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container text-slate-50 mx-auto px-4 py-8 relative"> <a href="/dashboard" class="absolute top-5 left-5 text-blue-400 hover:text-blue-300 transition-colors block" title="Volver al Menú"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path> </svg> </a> <h1 class="text-2xl font-bold mb-6 text-center pt-8">
Administración de Eventos
</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-12"> <!-- Formulario para crear nuevo evento --> <section class="bg-slate-700 text-slate-50 p-6 rounded-lg shadow-md"> <h2 class="text-2xl font-semibold mb-4">Crear Nuevo Evento</h2> <form method="POST" class="space-y-4"> <input type="hidden" name="intent" value="crear"> <div> <label for="nombre" class="block text-sm font-medium mb-1">Nombre del Evento</label> <input type="text" id="nombre" name="nombre" required class="text-black input input-bordered w-full"> </div> <div> <label for="fecha" class="block text-sm font-medium mb-1">Fecha del Evento</label> <input type="date" id="fecha" name="fecha" required class="text-black input input-bordered w-full"> </div> <button type="submit" class="w-full inline-block rounded bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring">Crear Evento</button> </form> </section> <!-- Listado de eventos existentes --> <section class="bg-slate-700 text-slate-50 p-6 rounded-lg shadow-md"> <h2 class="text-2xl font-semibold mb-4">Eventos Existentes</h2> <div class="space-y-4"> ${eventos.length > 0 ? renderTemplate`<ul class="list-none space-y-2"> ${eventos.map((evento) => renderTemplate`<li class="flex justify-between items-center p-2 bg-slate-600 rounded"> <div> <a${addAttribute(`/eventos/${evento.id}`, "href")} class="text-lg hover:underline"> ${evento.nombre} - ${new Date(evento.fecha).toLocaleDateString("es-ES", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" })} </a> <span class="text-gray-400 text-sm ml-2">(${evento._count.asistencia} registros)</span> </div> <div class="flex gap-2"> <button type="button" class="edit-event-btn p-2 bg-blue-600 hover:bg-blue-500 rounded text-white"${addAttribute(evento.id, "data-id")}${addAttribute(evento.nombre, "data-nombre")}${addAttribute(new Date(evento.fecha).toISOString().split("T")[0], "data-fecha")} title="Editar evento"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path> </svg> </button> <button type="button" class="delete-event-btn p-2 bg-red-600 hover:bg-red-500 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"${addAttribute(evento.id, "data-id")}${addAttribute(evento._count.asistencia, "data-count")}${addAttribute(evento._count.asistencia > 0 ? "No se puede eliminar - tiene registros" : "Eliminar evento", "title")}${addAttribute(evento._count.asistencia > 0, "disabled")}> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </div> </li>`)} </ul>` : renderTemplate`<p class="text-center text-gray-500 mt-8">No hay eventos creados todavía.</p>`} </div> </section> </div> </div>  <div id="edit-event-modal" class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 hidden"> <div class="bg-slate-800 text-slate-50 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"> <div class="flex justify-between items-center mb-4 border-b border-slate-600 pb-2"> <h3 class="text-xl font-bold">Editar Evento</h3> <button id="close-edit-modal-btn" type="button" class="text-2xl font-bold p-1 hover:text-red-500">&times;</button> </div> <form method="POST"> <input type="hidden" name="intent" value="actualizar"> <input type="hidden" id="edit-event-id" name="id"> <div class="space-y-4"> <div> <label for="edit-nombre" class="block text-sm font-medium mb-1">Nombre del Evento</label> <input type="text" id="edit-nombre" name="nombre" required class="text-black input input-bordered w-full"> </div> <div> <label for="edit-fecha" class="block text-sm font-medium mb-1">Fecha del Evento</label> <input type="date" id="edit-fecha" name="fecha" required class="text-black input input-bordered w-full"> </div> <button type="submit" class="w-full inline-block rounded bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">Guardar Cambios</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos.astro", void 0);
const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos.astro";
const $$url = "/eventos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Eventos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
