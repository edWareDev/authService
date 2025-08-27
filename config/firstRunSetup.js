import { createSystem } from "../src/usecases/systems/CreateSystem.js";
import { getSystems } from "../src/usecases/systems/GetSystems.js";
import { createUser } from "../src/usecases/users/CreateUser.js";
import { getUserByEmail } from "../src/usecases/users/GetUserByEmail.js";
import { getUsers } from "../src/usecases/users/GetUsers.js";
import { createUserSystemLink } from "../src/usecases/userSystemLink/CreateUserSystemLink.js";

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

        // GENERANDO CONFIGURACION INICIAL DEL SISTEMA
        const createdAuthService = await createSystem({
            name: 'Auth-Service',
            isActive: true
        });
        if (createdAuthService.error) console.error(new Date(), `Error creando registro del sistema: ${createdAuthService.error}`);

        //GENERANDO CONFIGURACIÓN INICIAL DE USUARIO
        const createdAdminUser = await createUser(initialUserData);
        if (createdAdminUser.error) console.error(new Date(), `Error creando usuario inical: ${createdAdminUser.error}`);

        //REALIZANDO LA VINCULACIÓN INICIAL ENTRE USUARIO Y SISTEMA
        const linkUserSystem = await createUserSystemLink(
            { user: createdAdminUser.id, system: createdAuthService.id, isActive: true }
        );
        if (linkUserSystem.error) console.error(new Date(), `Error vinculando usuario inical a sistema: ${linkUserSystem.error}`);

        //MOSTRANDO LA INFORMACIÓN EN LA TERMINAL
        console.log("Configuración Inicial ~ Cuenta de Administración:", {
            email: initialUserData.email,
            password: initialUserData.password,
            secret: createdAuthService.systemSecret,
        });

        console.log("‼️ Por seguridad utiliza estas credenciales para crear otra cuenta de administración, no olvides vincularlo con el sistema de autenticación para que pueda iniciar sesión, luego elimina esta cuenta.‼️");
    } else if (users.length === 1) {

        const initialUser = await getUserByEmail("administrador@authservice.com");
        if (initialUser && !initialUser.error) {

            // OBTENIENDO INFORMACIÓN INICIAL DE SISTEMA
            const allSystems = await getSystems({ page: "1", limit: "100" });
            if (allSystems.error) console.error(new Date(), `Error buscando los sistemas: ${allSystems.error}`);

            const authService = allSystems.systems.find((system) => system.systemName === "Auth-Service");
            if (authService.error) console.error(new Date(), `Error buscando el servicio de autenticación: ${authService.error}`);

            //MOSTRANDO LA INFORMACIÓN EN LA TERMINAL
            console.log("Se ha detectado la configuración Inicial ~ Cuenta de Administración:", {
                email: initialUserData.email,
                password: initialUserData.password,
                secret: authService.systemSecret
            });
            console.log("‼️ Por seguridad utiliza estas credenciales para crear otra cuenta de administración, no olvides vincularlo con el sistema de autenticación para que pueda iniciar sesión, luego elimina esta cuenta.‼️");
        }
    }
};