/* empty css                                 */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../chunks/index_DV7qvZ4L.mjs';
import { Prisma } from '@prisma/client';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://moralex74.duckdns.org");
const $$Crear = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Crear;
  let errorMessage = "";
  const zonas = await prisma.zonas.findMany({
    orderBy: { nombre_zona: "asc" }
  });
  const equipos = await prisma.equipos.findMany({
    orderBy: { des_equipo: "asc" }
  });
  const equipoDefault = equipos.find((e) => e.cod_equipo === "eq-09");
  let formData = {
    nombre: "",
    apellido: "",
    cedula: "",
    direccion: "",
    telef: "",
    telf_2: "",
    status: true,
    zonaId: "",
    equipoId: equipoDefault?.id ?? "",
    discipulado: "n",
    bautizado: false,
    genero: "F",
    kids: false
  };
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    formData = {
      nombre: data.get("nombre") ?? "",
      apellido: data.get("apellido") ?? "",
      cedula: data.get("cedula") ?? "",
      direccion: data.get("direccion") ?? "",
      telef: data.get("telef") ?? "",
      telf_2: data.get("telf_2") ?? "",
      status: data.get("status") === "on",
      zonaId: data.get("zonaId") ?? "",
      equipoId: data.get("equipoId") ?? "",
      discipulado: data.get("discipulado") ?? "n",
      bautizado: data.get("bautizado") === "on",
      genero: data.get("genero") ?? "F",
      kids: data.get("kids") === "on"
    };
    try {
      if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.zonaId || !formData.equipoId || !formData.discipulado) {
        throw new Error("Nombre, Apellido, C\xE9dula, Zona, Equipo y Discipulado son campos requeridos.");
      }
      const capitalize = (str) => {
        if (!str) return "";
        return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      };
      await prisma.miembros.create({
        data: {
          nombre: capitalize(formData.nombre),
          apellido: capitalize(formData.apellido),
          cedula: formData.cedula,
          direccion: formData.direccion,
          telef: formData.telef,
          telf_2: formData.telf_2,
          status: formData.status,
          zona_id: formData.zonaId,
          equipo_id: formData.equipoId,
          discipulado: formData.discipulado,
          bautizado: formData.bautizado,
          genero: formData.genero,
          kids: formData.kids
        }
      });
      return Astro2.redirect(
        (() => {
          const u = Astro2.url.searchParams.get("redirect");
          return u?.startsWith("/") && !u.includes("://") ? u : "/listado";
        })()
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        errorMessage = "La c\xE9dula introducida ya existe. Por favor, verif\xEDquela.";
      } else {
        errorMessage = `Error al crear el miembro. Intente de nuevo.`;
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Agregar Miembro" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-xl mx-auto py-10"> <h1 class="text-2xl font-bold mb-6 text-white text-center">Agregar Nuevo Miembro</h1> ${errorMessage && renderTemplate`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> <strong class="font-bold">¡Error! </strong> <span class="block sm:inline">${errorMessage}</span> </div>`} <form method="POST" data-astro-reload class="space-y-4 bg-white p-8 rounded-lg shadow-md"> <input type="hidden" name="_csrf"${addAttribute(Astro2.locals.csrfToken, "value")}> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label> <input type="text" name="nombre" id="nombre" required${addAttribute(formData.nombre, "value")} autofocus class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> <div> <label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label> <input type="text" name="apellido" id="apellido" required${addAttribute(formData.apellido, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="cedula" class="block text-sm font-medium text-gray-700">Cédula</label> <div class="flex gap-2"> <input type="text" name="cedula" id="cedula" required${addAttribute(formData.cedula, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <button type="button" id="buscar-cedula-btn" title="Buscar cédula" class="mt-1 flex-shrink-0 inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> <button type="button" id="clear-cedula-btn" title="Limpiar campos" class="mt-1 flex-shrink-0 inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> </div> <div class="flex items-center mt-6 gap-4 flex-wrap"> <div class="flex items-center"> <input type="checkbox" name="kids" id="kids"${addAttribute(formData.kids, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="kids" class="ml-2 block text-sm text-gray-900">Niño</label> </div> <div class="flex items-center"> <input type="checkbox" name="pendiente" id="pendiente" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="pendiente" class="ml-2 block text-sm text-gray-900">Pendiente</label> </div> <div class="flex items-center gap-3"> <label class="block text-sm font-medium text-gray-700">Sexo</label> <div class="flex items-center"> <input type="radio" name="genero" id="genero-f" value="F"${addAttribute(formData.genero === "F", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-f" class="ml-1 block text-sm text-gray-900">F</label> </div> <div class="flex items-center"> <input type="radio" name="genero" id="genero-m" value="M"${addAttribute(formData.genero === "M", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-m" class="ml-1 block text-sm text-gray-900">M</label> </div> <div class="flex items-center"> <input type="radio" name="genero" id="genero-o" value="O"${addAttribute(formData.genero === "O", "checked")} class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"> <label for="genero-o" class="ml-1 block text-sm text-gray-900">O</label> </div> </div> </div> </div> <div> <label for="zonaId" class="block text-sm font-medium text-gray-700">Zona</label> <select name="zonaId" id="zonaId" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="" disabled${addAttribute(!formData.zonaId, "selected")}>Selecciona una zona</option> ${zonas.map((zona) => renderTemplate`<option${addAttribute(zona.id, "value")}${addAttribute(zona.id === formData.zonaId, "selected")}>${zona.nombre_zona}</option>`)} </select> </div> <div> <label for="equipoId" class="block text-sm font-medium text-gray-700">Equipo</label> <select name="equipoId" id="equipoId" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="" disabled${addAttribute(!formData.equipoId, "selected")}>Selecciona un equipo</option> ${equipos.map((equipo) => renderTemplate`<option${addAttribute(equipo.id, "value")}${addAttribute(equipo.id === formData.equipoId, "selected")}>${equipo.cod_equipo} - ${equipo.des_equipo}</option>`)} </select> </div> <div> <label for="discipulado" class="block text-sm font-medium text-gray-700">Discipulado</label> <select name="discipulado" id="discipulado" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="" disabled>Selecciona una opción</option> <option value="s"${addAttribute(formData.discipulado === "s", "selected")}>Sí</option> <option value="n"${addAttribute(formData.discipulado === "n", "selected")}>No</option> <option value="a"${addAttribute(formData.discipulado === "a", "selected")}>Aprobado</option> <option value="p"${addAttribute(formData.discipulado === "p", "selected")}>Pendiente</option> </select> </div> <div> <label for="bautizado" class="block text-sm font-medium text-gray-700">Bautizado</label> <div class="flex items-center mt-1"> <input type="checkbox" name="bautizado" id="bautizado"${addAttribute(formData.bautizado, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="bautizado" class="ml-2 block text-sm text-gray-900">Sí</label> </div> </div> <div> <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección</label> <textarea name="direccion" id="direccion" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">${formData.direccion}</textarea> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="telef" class="block text-sm font-medium text-gray-700">Celular</label> <input type="text" name="telef" id="telef"${addAttribute(formData.telef, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> <div> <label for="telf_2" class="block text-sm font-medium text-gray-700">Teléfono 2 (Opcional)</label> <input type="text" name="telf_2" id="telf_2"${addAttribute(formData.telf_2, "value")} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> </div> </div> <div class="flex items-center"> <input type="checkbox" name="status" id="status"${addAttribute(formData.status, "checked")} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"> <label for="status" class="ml-2 block text-sm text-gray-900">Activo</label> </div> <div class="flex justify-end gap-4"> <a id="cancel-button" href="/listado" class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancelar</a> <button type="submit" class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Guardar</button> </div> </form> </div> ` })} ${renderScript($$result, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/crear.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/crear.astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/crear.astro";
const $$url = "/crear";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Crear,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
