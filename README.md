<!-- # 📡 eStreamPanel – Guía de Instalación y Despliegue

## 🧩 Descripción General
**eStreamPanel** es un sistema middleware desarrollado como una API REST que se integra con **Flussonic** para gestionar suscriptores, streams, categorías, paquetes, planes, dispositivos, y servidores peer. Está diseñado para optimizar el control y distribución de contenido multimedia en plataformas de streaming.

Este proyecto no incluye aún una interfaz Front-End, pero su arquitectura permite que pueda ser consumido por clientes externos a través de endpoints REST seguros y estructurados.

## ⚙️ Tecnologías Empleadas

- **Back End:** Node.js
- **Base de Datos:** MongoDB
- **Gestión de Procesos:** PM2
- **Documentación de API:** Swagger (`/api-docs`)
- **Control de Versiones:** Git

## 📋 Requisitos del Sistema

### 🔧 Hardware Mínimo Recomendado

| Componente | API (Backend) | Base de Datos (MongoDB) |
| ---------- | ------------- | ----------------------- |
| RAM        | 4 GB          | 2 GB                    |
| CPU        | 4 vCPU        | 4 vCPU                  |
| HDD        | 20 GB         | 50 GB                   |

### 🧰 Software Necesario

- Ubuntu 20.04 o superior (Recomendado)
- Node.js 20 o superior (instalado con NVM)
- MongoDB 7 o superior (Atlas o instancia local/remota)
- PM2
- Git

## 📦 Instalación del Sistema

### Clonación del Repositorio

```bash
git clone -b remake https://github.com/edWareDev/eStreamPanel-backend.git
cd eStreamPanel-backend
```
### Instalacion de dependencias
En la carpeta raiz del sistema ejecutar el siguiente comando:
```bash
npm install
```
### Configuración del archivo ENV
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
# CONFIGURACIONES DE DESPLIEGUE
NODE_ENV=development # Opciones: development, production

# CONFIGURACIONES DE SEGURIDAD
JWT_SECRET_KEY=key
JWT_REFRESH_SECRET_KEY=otherKey
JWT_ALGORITHM=HS512

# CONFIGURACIÓN DE LA API
API_PORT=3333
MONGODB_CNX_STR=mongodb+srv://urlBaseDeDatos/eStreamPanel

# CONFIGURACION FLUSSONIC PRINCIPAL
FLUSSONIC_URL_STR="urlFlussonicPrincipal"
FLUSSONIC_USER="userFlussonic"
FLUSSONIC_PASSWORD="passFlussonic"
FLUSSONIC_TEMPLATE_NAME="nombreDePlantillaDeStreams"

# CONFIGURACIONES FUNCIONALES
UPLOADED_IMAGES_FOLDER=./uploads
IMAGES_FORMAT=webp # Opciones: jpeg, jpg, png, webp

# CONFIGURACIÓN DE REPRODUCCIÓN
VIDEO_TIME_AUTH=30 # Tiempo en segundos para autorización de reproducción

# CONFIGURACIONES DE LOGGING
SAVE_LOGS=1
```

### Creación de carpeta de almacenamiento de logos de streams

```bash
mkdir uploads
```

## 🚀 Despliegue en Producción

### Recomendaciones de entorno
* Usar servidores separados para la base de datos y backend según los recursos recomendados.
* Mantener actualizado Node.js y dependencias del proyecto.
* Establecer entorno de producción en .env (NODE_ENV=production).

### 1. Instalar PM2

```bash
npm install -g pm2
```


### 2. Iniciar el servicio
Inicia la aplicación con PM2 usando:

```
pm2 start npm --name "eStreamPanel-API" -- run start
```

### 3. Supervisar el estado

```bash
pm2 list
```

> 💡 Se recomienda configurar PM2 para reinicio automático en caso de reinicio del servidor:
>
> ```bash
> pm2 startup
> pm2 save
> ```

#### Reinicio y Suprevisión
Para reiniciar la aplicación después de cambios en configuración o código:
```
pm2 restart eStreamPanel-API
```
Para visualizar logs en tiempo real:
```
pm2 logs eStreamPanel-API
```

### 4. Configuración opcional de dominio y SSL
Actualmente no es necesario, pero puede agregarse configurando un proxy inverso con Nginx y certificados SSL (Let's Encrypt).

---

# 📡 Uso del Sistema
## 🔁 Flujo funcional para creación de suscriptores
* Crear categorías para streams.
* Crear streams, asignándoles una categoría.
* Crear paquetes que contengan uno o varios streams.
* Crear planes que agrupen paquetes.
* Crear peers (servidores desde donde el suscriptor reproducirá).
* Finalmente, crear suscriptores asignándoles un plan y un peer.

## 🔁 Dependencias lógicas entre categorías, streams, paquetes y planes
* Cada stream debe estar asociado a una categoría.
* Los paquetes están formados por streams.
* Los planes están formados por paquetes.
* El suscriptor debe tener asignado un plan y un peer.

---

## 🧪 Pruebas y Validación
Puedes verificar el estado de los servicios en:
```
[host]/health
```

---

## 📖 Documentación de la API

La documentación completa de la API REST está disponible vía Swagger en:

```
[host]/api-docs
```

Desde allí se puede:

* Visualizar todos los endpoints disponibles.
* Probar las solicitudes directamente.
* Consultar ejemplos de respuestas.

---

## 📝 Mantenimiento y Logs
### Almacenamiento y consulta de logs
* Los logs se almacenan en la base de datos MongoDB.
* Se pueden consultar a través de los endpoints disponibles.

### Comandos útiles con PM2
Muestra estado de procesos.
```
pm2 status
```


### Consideraciones al hacer cambios de configuración
* Siempre reiniciar la aplicación para aplicar cambios.
* Verificar logs para detectar posibles errores.

### Recomendaciones
* Realizar backups regulares de la base de datos.
* Supervisión continua con PM2.


## 📌 Contacto Técnico
Responsable del mantenimiento:

Edward Espinoza Tito | edward.espinoza@globalfiber.com.pe -->
