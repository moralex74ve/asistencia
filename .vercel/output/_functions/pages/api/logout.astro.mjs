export { renderers } from '../../renderers.mjs';

const POST = async ({ cookies, redirect }) => {
  cookies.delete("session", {
    path: "/",
    httpOnly: true,
    secure: true,
    // true en producción, false en desarrollo
    sameSite: "strict"
  });
  return redirect("/login?logout=success");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
