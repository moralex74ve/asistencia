import { defineAction } from "astro:actions";

import { prisma } from "../../db";


export const getUsers = defineAction({
    accept: "json",
    handler: async () => {
        try {
            const users = await prisma.usuarios.findMany();
            return users;
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener los usuarios");
        }

        return;
    },
});

