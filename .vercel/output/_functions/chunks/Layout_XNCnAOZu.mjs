import { e as createAstro, f as createComponent, h as addAttribute, l as renderScript, r as renderTemplate, k as renderComponent, p as renderHead, q as renderSlot } from './astro/server_BGMrdG95.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro$1 = createAstro("https://moralex74.duckdns.org");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/PC/Documents/Dev/Asistencia/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/PC/Documents/Dev/Asistencia/node_modules/astro/components/ClientRouter.astro", void 0);

const SITE_TITLE = "Control de Asistencia";
const SITE_DESCRIPTION = "App para el control de asistencia de empleados.";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://moralex74.duckdns.org");
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const { title, description, image = "../img/Logo1.png" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<!-- Global Metadata --><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/../../img/logo1.png"><meta name="generator"', '><!-- Font preloads --><!-- Google fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet"><!-- Canonical URL --><!-- <link rel="canonical" href={canonicalURL} /> --><!-- Primary Meta Tags --><title>', '</title><meta name="title"', '><meta name="description"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', `><!-- css librerias/ cdn --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer"><!-- Iconify CDN --><!-- <script src="https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js"
is:inline
><\/script> --><!--esto es para el youtube-lite --><!-- <script is:inline type="module" src="https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1/lite-youtube.min.js"><\/script>
 --><!-- Flowbite CSS --><!-- <script is:inline src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"><\/script> --><!-- Esto es de la radio --><!-- <script id='sonic_js' data-port='8126' src='https://control.voztream.com/cp/widgets.js?r=203'><\/script>
 -->`])), addAttribute(Astro2.generator, "content"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.url), "content"));
}, "C:/Users/PC/Documents/Dev/Asistencia/src/components/BaseHead.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION })}${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead()}</head> <body class="bg-zinc-800"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/PC/Documents/Dev/Asistencia/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
