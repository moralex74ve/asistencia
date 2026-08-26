/* empty css                                 */
import { e as createAstro, f as createComponent, m as maybeRenderHead, l as renderScript, h as addAttribute, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_XNCnAOZu.mjs';
import 'clsx';
import { p as prisma } from '../chunks/index_DV7qvZ4L.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://moralex74.duckdns.org");
const $$Datos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Datos;
  const { role } = Astro2.props;
  const isUser = role === "usuario";
  const miembrosRaw = await prisma.miembros.findMany({
    include: {
      zonas: true,
      equipo: true,
      asistencia: {
        include: {
          evento: {
            select: { id: true, fecha: true, nombre: true }
          }
        },
        orderBy: { evento: { fecha: "desc" } },
        take: 20
        // Suficiente para ver el historial reciente de cada uno
      },
      _count: {
        select: { asistencia: true }
      }
    },
    orderBy: { nombre: "asc" }
  });
  const miembrosData = miembrosRaw.map((m) => {
    return {
      id: m.id,
      nombre: m.nombre,
      apellido: m.apellido,
      cedula: m.cedula,
      telef: m.telef,
      status: m.status,
      zona_id: m.zona_id,
      equipo_id: m.equipo_id,
      equipo: m.equipo,
      discipulado: m.discipulado,
      bautizado: m.bautizado,
      genero: m.genero,
      zonas: m.zonas,
      // La primera es la más reciente por el orderBy desc en la consulta
      ultima_asistencia: m.asistencia.length > 0 ? m.asistencia[0].evento.fecha : null,
      total_asistencias: m._count.asistencia
    };
  });
  const zonas = await prisma.zonas.findMany({
    where: {
      miembros: { some: {} }
    },
    orderBy: { nombre_zona: "asc" }
  });
  const equipos = await prisma.equipos.findMany({
    orderBy: { des_equipo: "asc" }
  });
  const url = Astro2.url;
  const filtros = {
    search: url.searchParams.get("search") || "",
    status: url.searchParams.get("status") || "",
    zona: url.searchParams.get("zona") || "",
    equipo: url.searchParams.get("equipo") || "",
    inactividad: url.searchParams.get("inactividad") || ""
  };
  const filtrosParams = new URLSearchParams();
  if (filtros.search) filtrosParams.set("search", filtros.search);
  if (filtros.status) filtrosParams.set("status", filtros.status);
  if (filtros.zona) filtrosParams.set("zona", filtros.zona);
  if (filtros.equipo) filtrosParams.set("equipo", filtros.equipo);
  if (filtros.inactividad) filtrosParams.set("inactividad", filtros.inactividad);
  const filtrosQS = filtrosParams.toString();
  return renderTemplate`${maybeRenderHead()}<div class="mb-4 w-full p-4 bg-slate-800 rounded-lg"> <div class="flex flex-wrap items-center gap-x-4 gap-y-3"> <div class="flex-grow flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-3"> <div class="relative flex-grow min-w-[200px]"> <input type="text" id="filter-input" placeholder="Buscar..." class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"> <button id="clear-filter-btn" class="absolute inset-y-0 right-0 items-center pr-3 hidden" aria-label="Limpiar búsqueda"> <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <a href="/crear" class="flex-shrink-0 inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path> </svg>
Nuevo
</a> </div> <!-- Filters --> <div class="flex flex-wrap items-center gap-x-4 gap-y-3"> <div class="flex items-center flex-shrink-0"> <input id="status-filter-checkbox" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <label for="status-filter-checkbox" class="ml-2 text-sm font-medium text-slate-50">Mostrar inactivos</label> </div> <select id="zona-filter-select" class="flex-shrink-0 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto"> <option value="all">Todas las zonas</option> ${zonas.map((zona) => renderTemplate`<option${addAttribute(zona.id, "value")}>${zona.nombre_zona}</option>`)} </select> <select id="equipo-filter-select" class="flex-shrink-0 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto"> <option value="all">Todos los equipos</option> ${equipos.map((equipo) => renderTemplate`<option${addAttribute(equipo.id, "value")}>${equipo.cod_equipo} - ${equipo.des_equipo}</option>`)} </select> <select id="inactividad-filter-select" class="flex-shrink-0 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto"> <option value="all">Todos</option> <option value="sin_registro_15">Sin asistencia últimos 15 días</option> <option value="sin_registro_30">Sin asistencia últimos 30 días</option> <option value="sin_registro_60">Sin asistencia últimos 60 días o más</option> <option value="nunca">Nunca ha asistido</option> </select> </div> <!-- Counter --> <div class="flex flex-wrap items-center gap-x-4 gap-y-3 sm:ml-auto"> <div class="flex-shrink-0 text-sm whitespace-nowrap"> <span id="record-counter-label" class="text-slate-50 font-medium">Registros:</span> <span id="record-counter-value" class="font-bold text-slate-50">${miembrosData.length}</span> </div> </div> </div> </div> <div class="overflow-x-auto rounded-lg border border-gray-700 shadow-md"> <table class="min-w-full divide-y-2 divide-gray-700 bg-slate-800 text-sm" style="table-layout: auto;"> <thead class="bg-slate-900"> <tr> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Nombre y Apellido</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Cédula</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Teléfono</th> <th class="whitespace-nowrap px-1 py-1 font-medium text-center text-slate-50">Sexo</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Status</th> <th class="whitespace-nowrap px-1 py-1 font-medium text-left text-slate-50 text-xs">Zona</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Equipo</th> <th class="whitespace-nowrap px-1 py-1 font-medium text-center text-slate-50">Disc.</th> <th class="whitespace-nowrap px-1 py-1 font-medium text-center text-slate-50">Baut.</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50">Última Asistencia</th> <th class="whitespace-nowrap px-2 py-1 font-medium text-left text-slate-50" style="min-width: 170px;">Acciones</th> </tr> </thead> <tbody id="miembros-table-body" class="divide-y divide-gray-700"> ${miembrosData.map((miembro) => renderTemplate`<tr${addAttribute(miembro.id, "data-miembro-id")}${addAttribute(miembro.status ? "activo" : "inactivo", "data-status")}${addAttribute(miembro.zona_id, "data-zona-id")}${addAttribute(miembro.equipo_id, "data-equipo-id")}${addAttribute(miembro.ultima_asistencia ? new Date(miembro.ultima_asistencia).toISOString() : "", "data-ultima-asistencia")}${addAttribute(miembro.total_asistencias, "data-total-asistencias")} class="text-slate-50"> <td class="px-2 py-1 font-medium"> ${miembro.nombre} ${miembro.apellido} </td> <td class="whitespace-nowrap px-2 py-1 text-gray-400"> ${miembro.cedula} </td> <td class="whitespace-nowrap px-2 py-1 text-gray-400"> ${miembro.telef || "N/A"} </td> <td class="whitespace-nowrap px-1 py-1 text-gray-400 text-center text-xs"> ${miembro.genero} </td> <td class="whitespace-nowrap px-2 py-1 text-gray-400"> <span${addAttribute([
    "px-2 py-1 rounded-full text-xs font-semibold",
    miembro.status ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
  ], "class:list")}> ${miembro.status ? "Activo" : "Inactivo"} </span> </td> <td class="whitespace-nowrap px-1 py-1 text-gray-400 text-xs"> ${miembro.zonas.nombre_zona} </td> <td class="whitespace-nowrap px-2 py-1 text-gray-400"> ${miembro.equipo?.des_equipo || "Sin equipo"} </td> <td class="whitespace-nowrap px-1 py-1 text-gray-400 text-center"> ${miembro.discipulado === "s" ? "S\xED" : miembro.discipulado === "n" ? "No" : miembro.discipulado === "a" ? "Aprobado" : miembro.discipulado === "p" ? "Pendiente" : "N/A"} </td> <td class="whitespace-nowrap px-1 py-1 text-gray-400 text-center"> ${miembro.bautizado ? "S\xED" : "No"} </td> <td class="whitespace-nowrap px-2 py-1 text-gray-400"> ${miembro.ultima_asistencia ? new Date(miembro.ultima_asistencia).toLocaleDateString("es-ES", { timeZone: "UTC" }) : renderTemplate`<span class="text-red-400">Nunca</span>`} </td> <td class="whitespace-nowrap px-2 py-1" style="min-width: 160px;"> <div class="flex items-center gap-2"> <a${addAttribute(`/editar/${miembro.id}${filtrosQS ? `?${filtrosQS}` : ""}`, "href")} class="inline-block rounded bg-yellow-500 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-600">
Editar
</a> <button${addAttribute(miembro.id, "data-id")}${addAttribute(isUser, "disabled")}${addAttribute([
    "delete-btn inline-block rounded px-3 py-1 text-xs font-medium text-white transition-colors",
    isUser ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-red-600 hover:bg-red-700"
  ], "class:list")}>
Eliminar
</button> </div> </td> </tr>`)} </tbody> </table> </div> ${renderScript($$result, "C:/Users/PC/Documents/Dev/Asistencia/src/components/Datos.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/components/Datos.astro", void 0);

const $$Astro = createAstro("https://moralex74.duckdns.org");
const $$Listado = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Listado;
  const { user } = Astro2.locals;
  const userRole = user?.rol || "usuario";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-[98%] mx-auto p-4 text-slate-100 relative"> <a href="/dashboard" class="absolute top-5 left-5 text-blue-400 hover:text-blue-300 transition-colors block" title="Volver al Menú"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path> </svg> </a> <h1 class="text-2xl font-bold mt-4 mb-2 text-center">
Listado de Miembros
</h1> ${renderComponent($$result2, "Datos", $$Datos, { "role": userRole })} </main> ` })}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/listado.astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/listado.astro";
const $$url = "/listado";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Listado,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
