import { defineAction } from "astro:actions";
import { prisma } from "../../db";
import { z } from "astro:schema";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// --- Inicio: Lógica de Rate Limiting ---
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutos

// Almacén en memoria para los intentos de login. Se reinicia con el servidor.
const loginAttempts = new Map<string, { count: number; expiry: number }>();

// --- Fin: Lógica de Rate Limiting ---

export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    correo: z.string().email(),
    clave: z.string(),
  }),
  handler: async ({ correo, clave }, { cookies, clientAddress }) => {
    const ip = clientAddress;

    // --- Verificación de Rate Limiting ---
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.count >= MAX_ATTEMPTS && Date.now() < attempt.expiry) {
      const timeLeft = Math.ceil((attempt.expiry - Date.now()) / 60000);
      return {
        status: 429, // Too Many Requests
        body: {
          message: `Demasiados intentos fallidos. Por favor, inténtelo de nuevo en ${timeLeft} minutos.`
        }
      };
    }
    // --- Fin de Verificación ---

    console.log(`Intentando login con: ${correo} desde IP: ${ip}`);
    try {
      const user = await prisma.usuarios.findUnique({
        where: {
          correo: correo,
        },
      });

      // Si el usuario no existe, o si la contraseña no es válida, devuelve el mismo error.
      if (!user || !(await bcrypt.compare(clave, user.clave))) {
        // --- Registrar intento fallido ---
        const now = Date.now();
        const newAttempt = {
          count: (attempt?.count || 0) + 1,
          expiry: now + LOCKOUT_TIME_MS,
        };
        loginAttempts.set(ip, newAttempt);
        // --- Fin de registro ---

        const message = newAttempt.count >= MAX_ATTEMPTS 
          ? `Demasiados intentos fallidos. Por favor, inténtelo de nuevo en 15 minutos.`
          : "Credenciales inválidas";

        return {
          status: 401,
          body: { message }
        };
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        return {
          status: 403,
          body: {
            message: "Usuario desactivado. Contacte al administrador."
          }
        };
      }

      // --- Limpiar intentos en caso de éxito ---
      loginAttempts.delete(ip);
      // --- Fin de limpieza ---

      // Actualizar último login
      await prisma.usuarios.update({
        where: { id: user.id },
        data: { 
          ultimo_login: new Date()
        }
      });

      // --- Inicio: Generación de JWT ---
      const sessionExpires = new Date(Date.now() + 60 * 60 * 24 * 1000); // 24 horas
      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol,
        },
        import.meta.env.JWT_SECRET, // Cargar la clave secreta desde las variables de entorno
        { expiresIn: '24h' } // El token expira en 24 horas
      );

      // Establecer el token JWT en la cookie
      cookies.set("session", token, {
        httpOnly: true,
        secure: import.meta.env.PROD, // true en producción, false en desarrollo
        sameSite: "strict",
        path: "/",
        expires: sessionExpires,
      });

      return {
        status: 200,
        body: {
          message: "Login exitoso",
        }
      };
    } catch (error) {
      console.error("Error durante el login:", error);
      return {
        status: 500,
        body: {
          message: "Error interno del servidor"
        }
      };
    }
  },
});
