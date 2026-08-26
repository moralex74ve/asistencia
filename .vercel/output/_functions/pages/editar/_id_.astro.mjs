/* empty css                                    */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../../chunks/index_DV7qvZ4L.mjs';
import { Prisma } from '@prisma/client';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  let errorMessage = "";
  const { id } = Astro2.params;
  const filtrosParams = new URLSearchParams();
  for (const [key, value] of Astro2.url.searchParams) {
    if (["search", "status", "zona", "equipo", "inactividad"].includes(key) && value) {
      filtrosParams.set(key, value);
    }
  }
  const filtrosQS = filtrosParams.toString();
  const listadoUrl = filtrosQS ? `/listado?${filtrosQS}` : "/listado";
  const [miembro, zonas, equipos] = await Promise.all([
    prisma.miembros.findUnique({
      where: { id }
    }),
    prisma.zonas.findMany({ orderBy: { nombre_zona: "asc" } }),
    prisma.equipos.findMany({ orderBy: { des_equipo: "asc" } })
  ]);
  if (!miembro) {
    return Astro2.redirect("/404");
  }
  const isPendiente = miembro.cedula?.startsWith("Pend-") ?? false;
  if (Astro2.request.method === "POST") {
    try {
      const data = await Astro2.request.formData();
      const nombre = data.get("nombre") ?? "";
      const apellido = data.get("apellido") ?? "";
      const cedula = data.get("cedula") ?? "";
      const direccion = data.get("direccion") ?? "";
      const telef = data.get("telef") ?? "";
      const telf_2 = data.get("telf_2") ?? "";
      const status = data.get("status") === "on";
      const zonaId = data.get("zonaId") ?? "";
      const equipoId = data.get("equipoId") ?? "";
      const discipulado = data.get("discipulado") ?? "";
      const bautizado = data.get("bautizado") === "on";
      const genero = data.get("genero") ?? "F";
      const kids = data.get("kids") === "on";
      if (!nombre || !apellido || !cedula || !zonaId || !equipoId || !discipulado) {
        throw new Error("Nombre, Apellido, C\xE9dula, Zona, Equipo y Discipulado son campos requeridos.");
      }
      const capitalize = (str) => {
        if (!str) return "";
        return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      };
      await prisma.miembros.update({
        where: { id },
        data: {
          nombre: capitalize(nombre),
          apellido: capitalize(apellido),
          cedula,
          direccion,
          telef,
          telf_2,
          status,
          zona_id: zonaId,
          equipo_id: equipoId,
          discipulado,
          bautizado,
          genero,
          kids
        }
      });
      return Astro2.redirect(listadoUrl);
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        errorMessage = "La c\xE9dula introducida ya existe. Por favor, verif\xEDquela.";
      } else {
        errorMessage = `Error al actualizar el miembro. Intente de nuevo.`;
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Editar Miembro - ${miembro.nombre}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto py-10"> <h1 class="text-2xl font-bold mb-6 text-white text-center">Editar Miembro</h1> ${errorMessage && renderTemplate`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> <strong class="font-bold">¡Error! </strong> <span class="block sm:inline">${errorMessage}</span> </div>`} <form method="POST" data-astro-reload class="space-y-6 bg-white p-8 rounded-lg shadow-md"> <input type="hidden" name="_csrf"${addAttribute(Astro2.locals.csrfToken, "value")}> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label> <input type="text" name="nombre" id="nombre"${addAttribute(miembro.nombre, "value")} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> <div> <label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label> <input type="text" name="apellido" id="apellido"${addAttribute(miembro.apellido, "value")} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="cedula" class="block text-sm font-medium text-gray-700">Cédula</label> <div class="flex gap-2"> <input type="text" name="cedula" id="cedula"${addAttribute(miembro.cedula, "value")} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <button type="button" id="buscar-cedula-btn" title="Buscar cédula" class="mt-1 flex-shrink-0 inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> <button type="button" id="clear-cedula-btn" title="Limpiar campos" class="mt-1 flex-shrink-0 inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> </div> <div class="flex items-center mt-6 gap-4 flex-wrap"> <div class="flex items-center"> <input type="checkbox" name="kids" id="kids"${addAttribute(miembro.kids, "checked")}${addAttribute(miembro.id, "data-miembro-id")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="kids" class="ml-2 block text-sm text-gray-900">Niño</label> </div> <div class="flex items-center"> <input type="checkbox" name="pendiente" id="pendiente"${addAttribute(isPendiente, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="pendiente" class="ml-2 block text-sm text-gray-900">Pendiente</label> </div> <div class="flex items-center gap-3"> <label class="block text-sm font-medium text-gray-700">Sexo</label> <div class="flex items-center"> <input type="radio" name="genero" id="genero-f" value="F"${addAttribute(miembro.genero === "F", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-f" class="ml-1 block text-sm text-gray-900">F</label> </div> <div class="flex items-center"> <input type="radio" name="genero" id="genero-m" value="M"${addAttribute(miembro.genero === "M", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-m" class="ml-1 block text-sm text-gray-900">M</label> </div> <div class="flex items-center"> <input type="radio" name="genero" id="genero-o" value="O"${addAttribute(miembro.genero === "O", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-o" class="ml-1 block text-sm text-gray-900">O</label> </div> </div> </div> </div> <div> <label for="zonaId" class="block text-sm font-medium text-gray-700">Zona</label> <select name="zonaId" id="zonaId" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> ${zonas.map((zona) => renderTemplate`<option${addAttribute(zona.id, "value")}${addAttribute(zona.id === miembro.zona_id, "selected")}>${zona.nombre_zona}</option>`)} </select> </div> <div> <label for="equipoId" class="block text-sm font-medium text-gray-700">Equipo</label> <select name="equipoId" id="equipoId" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="" disabled${addAttribute(!miembro.equipo_id, "selected")}>Selecciona un equipo</option> ${equipos.map((equipo) => renderTemplate`<option${addAttribute(equipo.id, "value")}${addAttribute(equipo.id === miembro.equipo_id, "selected")}>${equipo.cod_equipo} - ${equipo.des_equipo}</option>`)} </select> </div> <div> <label for="discipulado" class="block text-sm font-medium text-gray-700">Discipulado</label> <select name="discipulado" id="discipulado" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="s"${addAttribute(miembro.discipulado === "s", "selected")}>Sí</option> <option value="n"${addAttribute(miembro.discipulado === "n", "selected")}>No</option> <option value="a"${addAttribute(miembro.discipulado === "a", "selected")}>Aprobado</option> <option value="p"${addAttribute(miembro.discipulado === "p", "selected")}>Pendiente</option> </select> </div> <div> <label for="bautizado" class="block text-sm font-medium text-gray-700">Bautizado</label> <div class="flex items-center mt-1"> <input type="checkbox" name="bautizado" id="bautizado"${addAttribute(miembro.bautizado, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="bautizado" class="ml-2 block text-sm text-gray-900">Sí</label> </div> </div> <div> <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección</label> <textarea name="direccion" id="direccion" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">${miembro.direccion}</textarea> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label for="telef" class="block text-sm font-medium text-gray-700">Celular</label> <input type="text" name="telef" id="telef"${addAttribute(miembro.telef, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> <div> <label for="telf_2" class="block text-sm font-medium text-gray-700">Teléfono 2 (Opcional)</label> <input type="text" name="telf_2" id="telf_2"${addAttribute(miembro.telf_2, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> </div> <div class="flex items-center"> <input type="checkbox" name="status" id="status"${addAttribute(miembro.status, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="status" class="ml-2 block text-sm text-gray-900">Activo</label> </div> <div class="flex justify-end gap-4"> <a${addAttribute(listadoUrl, "href")} class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancelar</a> <button type="submit" class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Actualizar</button> </div> </form> </div> ` })} ${renderScript($$result, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/editar/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/editar/[id].astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/editar/[id].astro";
const $$url = "/editar/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
