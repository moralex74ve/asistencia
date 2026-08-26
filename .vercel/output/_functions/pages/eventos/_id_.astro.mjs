/* empty css                                    */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, l as renderScript, u as unescapeHTML, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../../chunks/index_DV7qvZ4L.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id: eventoId } = Astro2.params;
  if (!eventoId) {
    return new Response("No se proporcion\xF3 un ID de evento", { status: 400 });
  }
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const miembroIdsToAdd = formData.getAll("miembroIds").map((id) => id.toString());
    if (miembroIdsToAdd.length > 0) {
      try {
        const ahora = /* @__PURE__ */ new Date();
        await prisma.asistencia.createMany({
          data: miembroIdsToAdd.map((miembroId) => ({
            evento_id: eventoId,
            miembro_id: miembroId,
            presente: true,
            hora_llegada: ahora
          })),
          skipDuplicates: true
        });
      } catch (error) {
        console.error("Error al agregar miembros a la asistencia:", error);
      }
    }
    return Astro2.redirect(`/eventos/${eventoId}`);
  }
  const [evento, miembrosEnAsistencia, todasZonas] = await Promise.all([
    prisma.evento.findUnique({ where: { id: eventoId } }),
    prisma.asistencia.findMany({
      where: { evento_id: eventoId },
      include: {
        miembros: {
          select: {
            nombre: true,
            apellido: true,
            cedula: true,
            telef: true,
            genero: true,
            zonas: true,
            equipo: true
          }
        }
      },
      orderBy: {
        miembros: {
          nombre: "asc"
        }
      }
    }),
    prisma.zonas.findMany({ orderBy: { nombre_zona: "asc" } })
  ]);
  if (!evento) {
    return new Response("Evento no encontrado", { status: 404 });
  }
  const idsMiembrosEnAsistencia = miembrosEnAsistencia.map((a) => a.miembro_id);
  const miembros = await prisma.miembros.findMany({
    where: {
      id: {
        notIn: idsMiembrosEnAsistencia
      }
    },
    include: {
      zonas: true
    },
    orderBy: { nombre: "asc" }
  });
  const zonaIdsEnLista = [...new Set(miembros.map((m) => m.zona_id))];
  const zonas = todasZonas.filter((z) => zonaIdsEnLista.includes(z.id));
  const esNino = (a) => a.miembros.cedula.toLowerCase().startsWith("kids-");
  const adultos = miembrosEnAsistencia.filter((a) => !esNino(a));
  const ninos = miembrosEnAsistencia.filter((a) => esNino(a));
  const generoDe = (a) => (a.miembros.genero || "F").toUpperCase();
  const datosExportPdf = {
    eventoId,
    eventoNombre: evento.nombre,
    totalAsistentes: miembrosEnAsistencia.length,
    totalNinos: ninos.length,
    totalHombresAdultos: adultos.filter((a) => generoDe(a) === "M").length,
    totalMujeresAdultas: adultos.filter((a) => generoDe(a) === "F").length,
    totalNinosHombres: ninos.filter((a) => generoDe(a) === "M").length,
    totalNinosMujeres: ninos.filter((a) => generoDe(a) === "F").length,
    asistentesPorEquipo: Array.from(
      miembrosEnAsistencia.reduce((map, a) => {
        const equipo = a.miembros.equipo?.des_equipo || "Sin equipo";
        map.set(equipo, (map.get(equipo) || 0) + 1);
        return map;
      }, /* @__PURE__ */ new Map()).entries()
    ).map(([equipo, total]) => ({ equipo, total })).sort((a, b) => a.equipo.localeCompare(b.equipo)),
    asistentes: miembrosEnAsistencia.map((a) => ({
      nombre: `${a.miembros.nombre} ${a.miembros.apellido}`,
      cedula: a.miembros.cedula,
      telef: a.miembros.telef || "",
      zona: a.miembros.zonas?.nombre_zona || "",
      equipo: a.miembros.equipo?.des_equipo || ""
    })),
    asistentesSinNinos: adultos.map((a) => ({
      nombre: `${a.miembros.nombre} ${a.miembros.apellido}`,
      cedula: a.miembros.cedula,
      telef: a.miembros.telef || ""
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Agregar Miembros a ${evento.nombre}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="container mx-auto px-4 py-2 text-slate-50"> <a id="back-to-events-link" href="/eventos" class="text-blue-400 hover:underline mb-4 inline-block">&larr; Volver a todos los eventos</a> <h1 class="text-xl sm:text-xs lg:text-4xl font-bold break-words">', '</h1> <p class="hidden sm:block sm:text-xs lg:text-lg text-gray-400 mb-2"> ', ' </p> <div class="text-md text-gray-300 mb-6 flex flex-wrap items-center gap-2 sm:gap-3"> <span class="sm:hidden sm:text-xs lg:text-lg font-semibold">Total:</span> <span class="hidden sm:inline sm:text-xs lg:text-lg font-semibold">Miembros en este evento:</span> <span id="attendee-count" class="bg-blue-900 text-blue-200 text-sm font-bold px-2.5 py-0.5 rounded-full">', "</span> <a", ' title="Agregar Miembro" class="p-2 bg-blue-600 hover:bg-blue-500 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path> </svg> </a> <button id="event-show-attendees-btn" type="button" title="Ver lista de miembros" class="p-2 bg-slate-700 hover:bg-slate-600 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path> </svg> </button> <button id="event-export-pdf-btn" type="button" title="Exportar listado a PDF" class="inline-flex items-center gap-1.5 rounded-lg bg-red-700 hover:bg-red-600 px-3 py-2 text-xs font-medium text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> <span class="hidden sm:inline">Exportar PDF</span> </button> <button id="event-export-asistentes-pdf-btn" type="button" title="Exportar listado de asistentes a PDF" class="inline-flex items-center gap-1.5 rounded-lg bg-red-700 hover:bg-red-600 px-3 py-2 text-xs font-medium text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> <span class="hidden sm:inline">Listado de Asistentes</span> </button> <a', ' class="inline-flex items-center gap-1.5 rounded-lg bg-green-700 hover:bg-green-600 px-3 py-2 text-xs font-medium text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path> </svg> <span class="hidden sm:inline">Ver Llegadas</span> </a> </div> <h2 class="sm:text-xs sm:mb-0 lg:text-xl font-semibold mb-1">\nAgregar Miembros al Evento\n</h2> <form method="POST"> <input type="hidden" name="_csrf"', '> <div class="mb-1 flex flex-wrap items-center justify-between lg:gap-3 sm:gap-1 sm:p-2 lg:p-4 bg-base-200 rounded-lg"> <!-- Search --> <div class="flex w-full items-center gap-3 sm:w-auto"> <div class="relative"> <input type="text" id="event-filter-input" placeholder="Buscar..." class="text-xs w-full max-w-xs pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"> <button id="event-clear-filter-btn" type="button" class="absolute inset-y-0 right-0 items-center pr-3 hidden" aria-label="Limpiar b\xFAsqueda"> <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> </button> </div> <div class="flex items-center flex-shrink-0"> <input id="event-status-filter-checkbox" type="checkbox" class="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <label for="event-status-filter-checkbox" class="ml-2 text-xs sm:text-sm font-medium text-slate-300">Mostrar inactivos</label> </div> </div> <!-- Filters and Action --> <div class="flex flex-wrap items-center justify-start gap-2 sm:gap-4"> <select id="event-zona-filter-select" class="block w-full rounded-md border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto sm:max-w-xs"> <option value="all">Todas las zonas</option> ', ' </select> <button type="submit" class="inline-block w-full rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 sm:w-auto">\nIncluir Seleccionados\n</button> </div> </div> <div class="overflow-x-auto rounded-lg border border-gray-700 shadow-md"> <table class="table-fixed min-w-full divide-y-2 divide-gray-700 bg-slate-800 text-sm"> <thead class="bg-slate-900"> <tr> <th class="w-12 px-4 py-2"></th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Nombre y Apellido</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">C\xE9dula</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Tel\xE9fono</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Status</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Zona</th> </tr> </thead> <tbody id="event-miembros-table-body" class="divide-y divide-gray-700"> ', " </tbody> </table> </div> ", ' </form> </div>  <div id="event-attendee-modal" class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" style="display: none;"> <div class="bg-slate-800 text-slate-50 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"> <div class="flex justify-between items-center mb-4 border-b border-slate-600 pb-2"> <h3 class="text-sm lg:text-xl font-bold">Miembros en el Evento</h3> <button id="event-close-modal-btn" type="button" class="text-2xl font-bold p-1 hover:text-red-500">&times;</button> </div> <ul id="attendee-list" class="space-y-2 max-h-96 overflow-y-auto"> ', " ", ' </ul> </div> </div> <script id="event-export-data" type="application/json">', "<\/script> ", " "])), maybeRenderHead(), evento.nombre, new Date(evento.fecha).toLocaleDateString("es-ES", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }), miembrosEnAsistencia.length, addAttribute(`/crear?redirect=/eventos/${eventoId}`, "href"), addAttribute(`/eventos/${eventoId}/llegadas`, "href"), addAttribute(Astro2.locals.csrfToken, "value"), zonas.map((zona) => renderTemplate`<option${addAttribute(zona.id, "value")}>${zona.nombre_zona}</option>`), miembros.map((miembro) => renderTemplate`<tr${addAttribute(miembro.status ? "activo" : "inactivo", "data-status")}${addAttribute(miembro.zona_id, "data-zona-id")}${addAttribute(!miembro.status ? "display: none;" : void 0, "style")} class="cursor-pointer"> <td class="px-4 py-2"> <input type="checkbox" name="miembroIds"${addAttribute(miembro.id, "value")} class="member-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"> </td> <td class="whitespace-nowrap px-4 py-2 font-medium"> ${miembro.nombre} ${miembro.apellido} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${miembro.cedula} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${miembro.telef} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> <span${addAttribute([
    "px-2 py-1 rounded-full text-xs font-semibold",
    miembro.status ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
  ], "class:list")}> ${miembro.status ? "Activo" : "Inactivo"} </span> </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${miembro.zonas.nombre_zona} </td> </tr>`), miembros.length === 0 && renderTemplate`<div class="text-center py-10 mt-4 bg-base-200 rounded-lg"> <p class="mb-4">No hay más miembros para agregar a este evento.</p> <p>
Todos los miembros registrados ya están en la lista de asistencia.
</p> </div>`, miembrosEnAsistencia.map((asistencia) => renderTemplate`<li class="bg-slate-700 p-3 rounded-md text-xs lg:text-md flex justify-between items-center"> <div class="flex flex-col min-w-0"> <span class="truncate"> ${asistencia.miembros.nombre} ${asistencia.miembros.apellido} </span> ${asistencia.hora_llegada && renderTemplate`<span class="text-green-400 text-xs">
Llegó:${" "} ${new Date(asistencia.hora_llegada).toLocaleTimeString(
    "es-ES",
    { hour: "2-digit", minute: "2-digit" }
  )} </span>`} </div> <button type="button" class="remove-attendee-btn text-red-400 hover:text-red-300 p-1"${addAttribute(asistencia.id, "data-asistencia-id")} title="Quitar del evento"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </button> </li>`), miembrosEnAsistencia.length === 0 && renderTemplate`<li id="no-attendees-msg" class="text-gray-400 text-center p-4">
Aún no hay miembros en este evento.
</li>`, unescapeHTML(JSON.stringify(datosExportPdf)), renderScript($$result2, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id].astro?astro&type=script&index=0&lang.ts")) })}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id].astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id].astro";
const $$url = "/eventos/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
