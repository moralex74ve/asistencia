import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C4Z-FiOs.mjs';
import { manifest } from './manifest_DB-lp2Ao.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page2 = () => import('./pages/api/asistencia/_id_.astro.mjs');
const _page3 = () => import('./pages/api/logout.astro.mjs');
const _page4 = () => import('./pages/api/miembros/check-cedula.astro.mjs');
const _page5 = () => import('./pages/api/miembros/_id_.astro.mjs');
const _page6 = () => import('./pages/crear.astro.mjs');
const _page7 = () => import('./pages/dashboard.astro.mjs');
const _page8 = () => import('./pages/discipulado/integrantes/_nivel_cod_.astro.mjs');
const _page9 = () => import('./pages/discipulado.astro.mjs');
const _page10 = () => import('./pages/editar/_id_.astro.mjs');
const _page11 = () => import('./pages/eventos/_id_/llegadas.astro.mjs');
const _page12 = () => import('./pages/eventos/_id_.astro.mjs');
const _page13 = () => import('./pages/eventos.astro.mjs');
const _page14 = () => import('./pages/listado.astro.mjs');
const _page15 = () => import('./pages/login.astro.mjs');
const _page16 = () => import('./pages/users.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/astro/dist/actions/runtime/route.js", _page1],
    ["src/pages/api/asistencia/[id].ts", _page2],
    ["src/pages/api/logout.ts", _page3],
    ["src/pages/api/miembros/check-cedula.ts", _page4],
    ["src/pages/api/miembros/[id].ts", _page5],
    ["src/pages/crear.astro", _page6],
    ["src/pages/dashboard.astro", _page7],
    ["src/pages/discipulado/integrantes/[nivel_cod].astro", _page8],
    ["src/pages/discipulado.astro", _page9],
    ["src/pages/editar/[id].astro", _page10],
    ["src/pages/eventos/[id]/llegadas.astro", _page11],
    ["src/pages/eventos/[id].astro", _page12],
    ["src/pages/eventos.astro", _page13],
    ["src/pages/listado.astro", _page14],
    ["src/pages/login.astro", _page15],
    ["src/pages/users/index.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_astro-internal_actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "f0b3af6f-3ccd-43d2-8a97-201994bbba69",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
