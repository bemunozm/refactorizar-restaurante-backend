# 🚀 **API RESTFUL AUTO RESTRO** 🥂

Este es el backend de un sistema diseñado para optimizar la gestión de restaurantes, manejando pedidos, mesas, pagos y delivery. El proyecto está desplegado utilizando **DigitalOcean App Platform**.

---

## 📚 **Tabla de Contenidos**
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Despliegue en DigitalOcean App Platform](#-despliegue-en-digitalocean-app-platform)

---

## ✨ **Características**
- Gestión de usuarios (clientes, garzones, administradores y repartidores).
- Pedidos organizados por mesas y priorizados por tiempo.
- Soporte para pagos en efectivo y transferencias integradas con **Transbank API**.
- Seguimiento en tiempo real de pedidos con **Google Maps API**.
- Arquitectura **MVC** basada en **Node.js** y **Express**.
- Integración de autenticación segura con **JWT**.

---

## 🛠 **Tecnologías**
- **Node.js**: Servidor backend rápido y escalable.
- **Express**: Framework minimalista y flexible para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos.
- **JWT**: Autenticación basada en tokens.
- **Axios**: Cliente HTTP para consumo de APIs.
- **DigitalOcean App Platform**: Plataforma de despliegue automatizado en la nube.

---

## ✅ **Requisitos Previos**
Antes de instalar localmente o desplegar, asegúrate de tener:
1. **Node.js** y **npm** instalados.
   - [Descargar Node.js](https://nodejs.org/)
2. **Git** instalado para clonar el repositorio.
   - [Descargar Git](https://git-scm.com/)
3. Una cuenta en [DigitalOcean](https://www.digitalocean.com/).

---

## ⚙️ **Instalación Local**

### 1. Clona el repositorio
```bash
git clone https://github.com/tuusuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instala las dependencias
```bash
npm install
```
### 3. Configura las variables de entorno
Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```.env
VITE_API_URL=http://localhost:4000/api
VITE_API_IMAGE_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
VITE_MAPS_API_KEY=tu_api_key_google_maps
```
### 4. Ejecuta el servidor localmente
Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
El servidor estará disponible en http://localhost:3000.

# ☁️ Despliegue en DigitalOcean App Platform
### 1. Configura tu repositorio en GitHub
Asegúrate de que tu código esté en un repositorio público o privado en GitHub.

### 2. Crea una App en DigitalOcean
* Ve a la plataforma de Apps de DigitalOcean.
* Haz clic en Create App y selecciona GitHub como fuente de tu código.
* Autoriza a DigitalOcean a acceder a tu repositorio y selecciona el repositorio correspondiente.

### 3. Configura el entorno en DigitalOcean
* Selecciona la rama a desplegar (por ejemplo, main).

* Configura el runtime como Node.js.

* En la sección de variables de entorno, agrega las siguientes claves desde tu archivo .env:
```.env
PORT

MONGO_URI

JWT_SECRET

TRANSACTION_API_KEY

MAPS_API_KEY
```

Nota: DigitalOcean gestiona las variables de entorno de manera segura.

* Define el comando de inicio en Run Command:
```bash
npm start
```
### 4. Configura un dominio personalizado (opcional)
* Si tienes un dominio personalizado, puedes asignarlo en la sección Domains.
* DigitalOcean configurará automáticamente un certificado SSL.
