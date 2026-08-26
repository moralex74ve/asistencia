import { p as prisma } from '../../../chunks/index_DV7qvZ4L.mjs';
import jwt from 'jsonwebtoken';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ params, request: _request, cookies }) => {
  const { id } = params;
  const token = cookies.get("session")?.value;
  if (!token) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    jwt.verify(token, "5fe5ddf412dfa8dfe085d4cab58525b7", { algorithms: ["HS256"] });
  } catch {
    cookies.delete("session", { path: "/" });
    return new Response(JSON.stringify({ message: "Sesión inválida" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(
      JSON.stringify({ message: "Se requiere el ID del miembro" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    await prisma.miembros.delete({
      where: { id }
    });
    return new Response(
      JSON.stringify({ message: "Miembro eliminado correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ message: "El registro no existe." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ message: "Error al eliminar el miembro" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
