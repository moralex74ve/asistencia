/* empty css                                       */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, l as renderScript, u as unescapeHTML, h as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../../../chunks/index_DV7qvZ4L.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$Llegadas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Llegadas;
  const { id: eventoId } = Astro2.params;
  if (!eventoId) {
    return new Response("No se proporcion\xF3 un ID de evento", { status: 400 });
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
            status: true,
            zona_id: true,
            zonas: true,
            equipo: true
          }
        }
      },
      orderBy: [
        { hora_llegada: { sort: "asc", nulls: "last" } },
        { miembros: { nombre: "asc" } }
      ]
    }),
    prisma.zonas.findMany({ orderBy: { nombre_zona: "asc" } })
  ]);
  if (!evento) {
    return new Response("Evento no encontrado", { status: 404 });
  }
  const zonasUsadas = todasZonas.filter(
    (z) => miembrosEnAsistencia.some((a) => a.miembros.zona_id === z.id)
  );
  const esNino = (a) => a.miembros.cedula.toLowerCase().startsWith("kids-");
  const adultos = miembrosEnAsistencia.filter((a) => !esNino(a));
  const ninos = miembrosEnAsistencia.filter((a) => esNino(a));
  const generoDe = (a) => (a.miembros.genero || "F").toUpperCase();
  const datosExportPdf = {
    eventoId,
    eventoNombre: evento.nombre,
    totalAsistentes: miembrosEnAsistencia.length,
    totalLlegados: miembrosEnAsistencia.filter((a) => a.hora_llegada).length,
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
      equipo: a.miembros.equipo?.des_equipo || "",
      hora_llegada: a.hora_llegada ? a.hora_llegada.toISOString() : null
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Llegadas a ${evento.nombre}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="container mx-auto px-4 py-2 text-slate-50"> <a', ' class="text-blue-400 hover:underline mb-4 inline-block">&larr; Volver al evento</a> <h1 class="sm:text-xs lg:text-4xl font-bold">', '</h1> <p class="sm:text-xs lg:text-lg text-gray-400 mb-2"> ', ' </p> <div class="text-md text-gray-300 mb-6 flex flex-wrap items-center gap-3"> <span class="sm:text-xs lg:text-lg font-semibold">Registro de Llegadas:</span> <span id="llegadas-count" class="bg-green-900 text-green-200 text-sm font-bold px-2.5 py-0.5 rounded-full">', '</span> <button id="llegadas-export-pdf-btn" type="button" title="Exportar listado de llegadas a PDF" class="inline-flex items-center gap-1.5 rounded-lg bg-red-700 hover:bg-red-600 px-3 py-2 text-xs font-medium text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg>\nExportar PDF\n</button> </div> <h2 class="sm:text-xs lg:text-xl font-semibold mb-2">\nListado de Llegadas\n</h2> <div class="mb-1 flex flex-wrap items-center justify-between lg:gap-3 sm:gap-2 p-4 bg-base-200 rounded-lg"> <div class="relative"> <input type="text" id="llegadas-filter-input" placeholder="Buscar..." class="text-xs w-full max-w-xs pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"> <button id="llegadas-clear-filter-btn" type="button" class="absolute inset-y-0 right-0 items-center pr-3 hidden" aria-label="Limpiar b\xFAsqueda"> <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> </button> </div> <div class="flex flex-wrap items-center justify-start gap-4"> <div class="flex items-center"> <input id="llegadas-status-filter-checkbox" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <label for="llegadas-status-filter-checkbox" class="ml-2 text-sm font-medium">Mostrar inactivos</label> </div> <select id="llegadas-zona-filter-select" class="block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto sm:max-w-xs"> <option value="all">Todas las zonas</option> ', ' </select> </div> </div> <div class="overflow-x-auto rounded-lg border border-gray-700 shadow-md"> <table class="table-fixed min-w-full divide-y-2 divide-gray-700 bg-slate-800 text-sm"> <thead class="bg-slate-900"> <tr> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Nombre y Apellido</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">C\xE9dula</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Tel\xE9fono</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Zona</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Equipo</th> <th class="whitespace-nowrap px-4 py-2 font-medium text-left">Hora de Llegada</th> </tr> </thead> <tbody id="llegadas-table-body" class="divide-y divide-gray-700"> ', " </tbody> </table> </div> ", ' </div> <script id="llegadas-export-data" type="application/json">', "<\/script> ", " "])), maybeRenderHead(), addAttribute(`/eventos/${eventoId}`, "href"), evento.nombre, new Date(evento.fecha).toLocaleDateString("es-ES", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }), miembrosEnAsistencia.filter((a) => a.hora_llegada).length, zonasUsadas.map((zona) => renderTemplate`<option${addAttribute(zona.id, "value")}>${zona.nombre_zona}</option>`), miembrosEnAsistencia.map((asistencia) => renderTemplate`<tr${addAttribute(
    asistencia.miembros.status ? "activo" : "inactivo",
    "data-status"
  )}${addAttribute(asistencia.miembros.zona_id, "data-zona-id")}${addAttribute(!asistencia.miembros.status ? "display: none;" : void 0, "style")}> <td class="whitespace-nowrap px-4 py-2 font-medium"> ${asistencia.miembros.nombre} ${asistencia.miembros.apellido} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${asistencia.miembros.cedula} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${asistencia.miembros.telef} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${asistencia.miembros.zonas.nombre_zona} </td> <td class="whitespace-nowrap px-4 py-2 text-gray-400"> ${asistencia.miembros.equipo?.des_equipo} </td> <td class="whitespace-nowrap px-4 py-2"${addAttribute(
    asistencia.hora_llegada ? asistencia.hora_llegada.toISOString() : null,
    "data-llegada-iso"
  )}> ${asistencia.hora_llegada ? renderTemplate`<span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-300">...</span>` : renderTemplate`<span class="text-gray-500">—</span>`} </td> </tr>`), miembrosEnAsistencia.length === 0 && renderTemplate`<div class="text-center py-10 mt-4 bg-base-200 rounded-lg"> <p class="mb-4">No hay miembros en este evento.</p> </div>`, unescapeHTML(JSON.stringify(datosExportPdf)), renderScript($$result2, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id]/llegadas.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id]/llegadas.astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/eventos/[id]/llegadas.astro";
const $$url = "/eventos/[id]/llegadas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Llegadas,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
