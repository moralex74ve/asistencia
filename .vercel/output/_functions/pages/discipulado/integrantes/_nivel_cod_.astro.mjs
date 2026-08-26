/* empty css                                       */
import { e as createAstro, f as createComponent, r as renderTemplate, n as defineScriptVars, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_XNCnAOZu.mjs';
import { p as prisma } from '../../../chunks/index_DV7qvZ4L.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://moralex74.duckdns.org");
const prerender = false;
const $$nivelCod = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$nivelCod;
  const { nivel_cod } = Astro2.params;
  if (!nivel_cod) {
    return Astro2.redirect("/discipulado");
  }
  let mensaje = "";
  let tipoMensaje = "";
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const intent = formData.get("intent")?.toString();
      if (intent === "agregar") {
        const miembroId = formData.get("miembro_id")?.toString();
        if (miembroId && nivel_cod) {
          await prisma.integrantes_discipulado.create({
            data: {
              miembro_id: miembroId,
              nivel_cod
            }
          });
          await prisma.miembros.updateMany({
            where: {
              id: miembroId,
              discipulado: { in: ["n", "p"] }
            },
            data: { discipulado: "s" }
          });
          mensaje = "Integrante agregado correctamente.";
          tipoMensaje = "success";
        }
      } else if (intent === "eliminar") {
        const integranteId = formData.get("integrante_id")?.toString();
        if (integranteId) {
          await prisma.integrantes_discipulado.delete({
            where: { id: integranteId }
          });
          mensaje = "Integrante eliminado correctamente.";
          tipoMensaje = "success";
        }
      }
    } catch (error) {
      console.error("Error:", error);
      mensaje = "Error al procesar la solicitud.";
      tipoMensaje = "error";
    }
  }
  const nivel = await prisma.discipulado.findUnique({
    where: { nivel_cod },
    select: { nivel_cod: true, nombre_nivel: true }
  });
  if (!nivel) {
    return Astro2.redirect("/discipulado");
  }
  const integrantesActuales = await prisma.integrantes_discipulado.findMany({
    where: { nivel_cod },
    include: {
      miembro: {
        select: { id: true, nombre: true, apellido: true, cedula: true }
      }
    },
    orderBy: { miembro: { nombre: "asc" } }
  });
  const idsAsignados = integrantesActuales.map((i) => i.miembro_id);
  const miembrosDisponibles = await prisma.miembros.findMany({
    where: {
      status: true,
      id: { notIn: idsAsignados }
    },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, apellido: true }
  });
  const integrantesJSON = JSON.stringify(
    integrantesActuales.map((i) => ({
      id: i.id,
      miembro_id: i.miembro_id,
      nombre: i.miembro.nombre,
      apellido: i.miembro.apellido,
      cedula: i.miembro.cedula
    }))
  );
  const miembrosJSON = JSON.stringify(miembrosDisponibles);
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", '\n  function initIntegrantes() {\n    const miembros = JSON.parse(miembrosJSON);\n\n    function escapeHtml(str) {\n      const div = document.createElement(\'div\');\n      div.appendChild(document.createTextNode(str));\n      return div.innerHTML;\n    }\n\n    const searchInput = document.querySelector("#miembro-select .search-input");\n    const hiddenInput = document.getElementById("miembro-id-hidden");\n    const dropdown = document.querySelector(\n      "#miembro-select .dropdown-list"\n    );\n    const clearBtn = document.querySelector("#miembro-select .clear-btn");\n    const btnAgregar = document.getElementById("btn-agregar");\n\n    function renderDropdown(search = "") {\n      const searchLower = search.toLowerCase();\n      let html = "";\n\n      const filtrados = miembros.filter((m) => {\n        const nombre = `${m.nombre} ${m.apellido}`.toLowerCase();\n        return nombre.includes(searchLower);\n      });\n\n      if (filtrados.length === 0) {\n        html = `<div class="px-3 py-2 text-sm text-gray-500">No se encontraron miembros</div>`;\n      } else {\n        for (const m of filtrados) {\n          const nombre = escapeHtml(`${m.nombre} ${m.apellido}`);\n          html += `<div class="option-item px-3 py-2 text-sm cursor-pointer hover:bg-blue-600 text-slate-50" data-id="${m.id}" data-nombre="${nombre}">${nombre}</div>`;\n        }\n      }\n\n      dropdown.innerHTML = html;\n    }\n\n    function updateClearBtn() {\n      if (hiddenInput.value) {\n        clearBtn.classList.remove("hidden");\n        clearBtn.classList.add("block");\n      } else {\n        clearBtn.classList.add("hidden");\n        clearBtn.classList.remove("block");\n      }\n    }\n\n    searchInput.addEventListener("focus", () => {\n      renderDropdown(searchInput.value);\n      dropdown.classList.remove("hidden");\n    });\n\n    searchInput.addEventListener("input", () => {\n      renderDropdown(searchInput.value);\n      dropdown.classList.remove("hidden");\n      if (!searchInput.value) {\n        hiddenInput.value = "";\n        btnAgregar.disabled = true;\n        updateClearBtn();\n      }\n    });\n\n    dropdown.addEventListener("click", (e) => {\n      const option = e.target.closest(".option-item");\n      if (!option) return;\n      const id = option.dataset.id || "";\n      const nombre = option.dataset.nombre || "";\n      hiddenInput.value = id;\n      searchInput.value = nombre;\n      dropdown.classList.add("hidden");\n      btnAgregar.disabled = false;\n      updateClearBtn();\n    });\n\n    document.addEventListener("click", (e) => {\n      if (!document.getElementById("miembro-select").contains(e.target)) {\n        dropdown.classList.add("hidden");\n      }\n    });\n\n    clearBtn.addEventListener("click", () => {\n      hiddenInput.value = "";\n      searchInput.value = "";\n      btnAgregar.disabled = true;\n      updateClearBtn();\n      searchInput.focus();\n    });\n\n    updateClearBtn();\n\n    // Eliminar integrante\n    document.querySelectorAll(".delete-btn").forEach((btn) => {\n      btn.addEventListener("click", async () => {\n        const integranteId = btn.dataset.id;\n        if (!confirm("\xBFEst\xE1s seguro de eliminar este integrante del nivel?"))\n          return;\n\n        const formData = new FormData();\n        formData.append("intent", "eliminar");\n        formData.append("integrante_id", integranteId);\n\n        btn.disabled = true;\n        btn.textContent = "...";\n\n        try {\n          const response = await fetch(window.location.href, {\n            method: "POST",\n            body: formData,\n          });\n\n          if (response.ok) {\n            const row = btn.closest("tr");\n            row.remove();\n            // Actualizar contador\n            const tbody = document.getElementById("tbody-integrantes");\n            if (tbody && tbody.children.length === 0) {\n              document.getElementById("lista-integrantes").innerHTML =\n                \'<p class="text-gray-400 text-sm text-center py-4">No hay integrantes registrados en este nivel.</p>\';\n            }\n            // Recargar para reflejar cambios\n            window.location.reload();\n          } else {\n            throw new Error("Error en la respuesta");\n          }\n        } catch (error) {\n          console.error("Error:", error);\n          btn.textContent = "Error";\n          setTimeout(() => {\n            btn.textContent = "Eliminar";\n            btn.disabled = false;\n          }, 2000);\n        }\n      });\n    });\n  }\n\n  document.addEventListener("astro:page-load", initIntegrantes);\n})();<\/script>'], ["", " <script>(function(){", '\n  function initIntegrantes() {\n    const miembros = JSON.parse(miembrosJSON);\n\n    function escapeHtml(str) {\n      const div = document.createElement(\'div\');\n      div.appendChild(document.createTextNode(str));\n      return div.innerHTML;\n    }\n\n    const searchInput = document.querySelector("#miembro-select .search-input");\n    const hiddenInput = document.getElementById("miembro-id-hidden");\n    const dropdown = document.querySelector(\n      "#miembro-select .dropdown-list"\n    );\n    const clearBtn = document.querySelector("#miembro-select .clear-btn");\n    const btnAgregar = document.getElementById("btn-agregar");\n\n    function renderDropdown(search = "") {\n      const searchLower = search.toLowerCase();\n      let html = "";\n\n      const filtrados = miembros.filter((m) => {\n        const nombre = \\`\\${m.nombre} \\${m.apellido}\\`.toLowerCase();\n        return nombre.includes(searchLower);\n      });\n\n      if (filtrados.length === 0) {\n        html = \\`<div class="px-3 py-2 text-sm text-gray-500">No se encontraron miembros</div>\\`;\n      } else {\n        for (const m of filtrados) {\n          const nombre = escapeHtml(\\`\\${m.nombre} \\${m.apellido}\\`);\n          html += \\`<div class="option-item px-3 py-2 text-sm cursor-pointer hover:bg-blue-600 text-slate-50" data-id="\\${m.id}" data-nombre="\\${nombre}">\\${nombre}</div>\\`;\n        }\n      }\n\n      dropdown.innerHTML = html;\n    }\n\n    function updateClearBtn() {\n      if (hiddenInput.value) {\n        clearBtn.classList.remove("hidden");\n        clearBtn.classList.add("block");\n      } else {\n        clearBtn.classList.add("hidden");\n        clearBtn.classList.remove("block");\n      }\n    }\n\n    searchInput.addEventListener("focus", () => {\n      renderDropdown(searchInput.value);\n      dropdown.classList.remove("hidden");\n    });\n\n    searchInput.addEventListener("input", () => {\n      renderDropdown(searchInput.value);\n      dropdown.classList.remove("hidden");\n      if (!searchInput.value) {\n        hiddenInput.value = "";\n        btnAgregar.disabled = true;\n        updateClearBtn();\n      }\n    });\n\n    dropdown.addEventListener("click", (e) => {\n      const option = e.target.closest(".option-item");\n      if (!option) return;\n      const id = option.dataset.id || "";\n      const nombre = option.dataset.nombre || "";\n      hiddenInput.value = id;\n      searchInput.value = nombre;\n      dropdown.classList.add("hidden");\n      btnAgregar.disabled = false;\n      updateClearBtn();\n    });\n\n    document.addEventListener("click", (e) => {\n      if (!document.getElementById("miembro-select").contains(e.target)) {\n        dropdown.classList.add("hidden");\n      }\n    });\n\n    clearBtn.addEventListener("click", () => {\n      hiddenInput.value = "";\n      searchInput.value = "";\n      btnAgregar.disabled = true;\n      updateClearBtn();\n      searchInput.focus();\n    });\n\n    updateClearBtn();\n\n    // Eliminar integrante\n    document.querySelectorAll(".delete-btn").forEach((btn) => {\n      btn.addEventListener("click", async () => {\n        const integranteId = btn.dataset.id;\n        if (!confirm("\xBFEst\xE1s seguro de eliminar este integrante del nivel?"))\n          return;\n\n        const formData = new FormData();\n        formData.append("intent", "eliminar");\n        formData.append("integrante_id", integranteId);\n\n        btn.disabled = true;\n        btn.textContent = "...";\n\n        try {\n          const response = await fetch(window.location.href, {\n            method: "POST",\n            body: formData,\n          });\n\n          if (response.ok) {\n            const row = btn.closest("tr");\n            row.remove();\n            // Actualizar contador\n            const tbody = document.getElementById("tbody-integrantes");\n            if (tbody && tbody.children.length === 0) {\n              document.getElementById("lista-integrantes").innerHTML =\n                \'<p class="text-gray-400 text-sm text-center py-4">No hay integrantes registrados en este nivel.</p>\';\n            }\n            // Recargar para reflejar cambios\n            window.location.reload();\n          } else {\n            throw new Error("Error en la respuesta");\n          }\n        } catch (error) {\n          console.error("Error:", error);\n          btn.textContent = "Error";\n          setTimeout(() => {\n            btn.textContent = "Eliminar";\n            btn.disabled = false;\n          }, 2000);\n        }\n      });\n    });\n  }\n\n  document.addEventListener("astro:page-load", initIntegrantes);\n})();<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "title": `Integrantes - ${nivel.nombre_nivel}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container text-slate-50 mx-auto px-4 py-8 relative"> <a href="/discipulado" class="absolute top-5 left-5 text-blue-400 hover:text-blue-300 transition-colors block" title="Volver a Discipulado"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path> </svg> </a> <h1 class="text-2xl font-bold mb-2 text-center pt-8">
Integrantes - ${nivel.nombre_nivel} </h1> <p class="text-center text-gray-400 mb-6 text-sm"> ${integrantesActuales.length} integrante(s) registrado(s)
</p> ${mensaje && renderTemplate`<div${addAttribute([
    "mb-4 px-4 py-3 rounded text-center text-sm font-medium max-w-xl mx-auto",
    tipoMensaje === "success" ? "bg-green-900 text-green-300 border border-green-700" : "bg-red-900 text-red-300 border border-red-700"
  ], "class:list")}> ${mensaje} </div>`} <!-- Sección para agregar integrante --> <div class="bg-slate-700 text-slate-50 p-6 rounded-lg shadow-md mb-6 max-w-xl mx-auto"> <h2 class="text-lg font-semibold mb-4">Agregar Integrante</h2> <form method="POST" class="flex items-end gap-3"> <input type="hidden" name="intent" value="agregar"> <div class="flex-1"> <label for="miembro-select" class="block text-sm text-gray-400 mb-1">Seleccionar miembro</label> <div class="searchable-select relative" id="miembro-select"> <input type="text" class="search-input w-full bg-slate-800 border border-gray-500 rounded px-3 py-2 text-sm text-slate-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar miembro..." autocomplete="off"> <input type="hidden" name="miembro_id" id="miembro-id-hidden"> <button type="button" class="clear-btn absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 text-sm font-bold hidden" title="Limpiar">
✕
</button> <div class="dropdown-list absolute z-20 w-full mt-1 bg-slate-800 border border-gray-500 rounded shadow-lg max-h-48 overflow-y-auto hidden"></div> </div> </div> <button type="submit" id="btn-agregar" class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
Agregar
</button> </form> </div> <!-- Lista de integrantes actuales --> <div class="bg-slate-700 text-slate-50 p-6 rounded-lg shadow-md max-w-xl mx-auto"> <h2 class="text-lg font-semibold mb-4">Integrantes Registrados</h2> <div id="lista-integrantes"> ${integrantesActuales.length === 0 ? renderTemplate`<p class="text-gray-400 text-sm text-center py-4">
No hay integrantes registrados en este nivel.
</p>` : renderTemplate`<table class="min-w-full divide-y divide-gray-600"> <thead class="bg-slate-800"> <tr> <th class="px-4 py-2 text-left text-sm font-semibold text-slate-50">
Nombre
</th> <th class="px-4 py-2 text-left text-sm font-semibold text-slate-50">
Cédula
</th> <th class="px-4 py-2 text-center text-sm font-semibold text-slate-50">
Acción
</th> </tr> </thead> <tbody class="divide-y divide-gray-600" id="tbody-integrantes"> ${integrantesActuales.map((i) => renderTemplate`<tr${addAttribute(i.id, "data-integrante-id")} class="hover:bg-slate-600/50"> <td class="px-4 py-2 text-sm"> ${i.miembro.nombre} ${i.miembro.apellido} </td> <td class="px-4 py-2 text-sm text-gray-400"> ${i.miembro.cedula} </td> <td class="px-4 py-2 text-center"> <button type="button" class="delete-btn bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1 rounded transition-colors"${addAttribute(i.id, "data-id")} title="Eliminar integrante">
Eliminar
</button> </td> </tr>`)} </tbody> </table>`} </div> </div> </div> ` }), defineScriptVars({ miembrosJSON, integrantesJSON }));
}, "C:/Users/PC/Documents/Dev/Asistencia/src/pages/discipulado/integrantes/[nivel_cod].astro", void 0);

const $$file = "C:/Users/PC/Documents/Dev/Asistencia/src/pages/discipulado/integrantes/[nivel_cod].astro";
const $$url = "/discipulado/integrantes/[nivel_cod]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$nivelCod,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
