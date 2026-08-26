import { p as prisma } from '../../../chunks/index_DV7qvZ4L.mjs';
import jwt from 'jsonwebtoken';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ url, cookies }) => {
  const cedula = url.searchParams.get("cedula");
  const excludeId = url.searchParams.get("excludeId");
  if (!cedula) {
    return new Response(
      JSON.stringify({ exists: false, message: "Cédula requerida" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const token = cookies.get("session")?.value;
  if (!token) {
    return new Response(
      JSON.stringify({ exists: false, message: "No autorizado" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    jwt.verify(token, "5fe5ddf412dfa8dfe085d4cab58525b7", { algorithms: ["HS256"] });
  } catch {
    return new Response(
      JSON.stringify({ exists: false, message: "Sesión inválida" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    const existing = await prisma.miembros.findFirst({
      where: {
        cedula,
        ...excludeId ? { id: { not: excludeId } } : {}
      },
      select: { id: true }
    });
    return new Response(JSON.stringify({ exists: !!existing }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ exists: false, message: "Error al verificar cédula" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
