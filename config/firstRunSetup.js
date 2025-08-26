import { createUser } from "../src/usecases/users/CreateUser.js";
import { getUserByEmail } from "../src/usecases/users/GetUserByEmail.js";
import { getUsers } from "../src/usecases/users/GetUsers.js";

export const firstRunSetup = async () => {

    const usersData = await getUsers({ page: "1", limit: "10" });
    const { users } = usersData;

    const initialUserData = {
        name: "Administrador",
        dni: "00000000",
        email: "administrador@authservice.com",
        password: "Password-inicial-1@",
        role: "administrator",
        isActive: true
    };

    if (users.length === 0) {
        console.log("Ejecutando configuración de primer inicio...");
        await createUser(initialUserData);
        console.log("Configuración Inicial ~ Cuenta de Administración:", {
            email: initialUserData.email,
            password: initialUserData.password
        });
        console.log("‼️ Por seguridad utiliza estas credenciales para crear otra cuenta de administración, luego elimina esta cuenta.‼️");
    } else if (users.length === 1) {
        const initialUser = await getUserByEmail("administrador@authservice.com");
        if (initialUser && !initialUser.error) {
            console.log("Se ha detectado la configuración Inicial ~ Cuenta de Administración:", {
                email: initialUserData.email,
                password: initialUserData.password
            });
            console.log("‼️ Por seguridad utiliza estas credenciales para crear otra cuenta de administración, luego elimina esta cuenta.‼️");
        }
    }
};