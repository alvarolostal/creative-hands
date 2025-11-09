# 🎨 Creative Hands

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**Portal de productos artesanales con autenticación JWT y chat en tiempo real**  
_Trabajo práctico para Desarrollo Web I_

[🌐 Ver Demo en Vivo](https://creative-hands-cjzg.onrender.com) | [📁 Ver Repositorio](https://github.com/lostal/creative-hands)

</div>

---

## 📋 Descripción

Aplicación web full-stack para la venta de productos artesanales que permite a usuarios navegar por catálogos organizados por categorías, mientras que los administradores gestionan productos, categorías y se comunican con clientes mediante un sistema de chat en tiempo real.

## 🎯 Funcionalidades y Cumplimientos
Resumen de lo implementado (mapa con los requisitos de la Práctica 1):

- Autenticación con JWT: registro y login implementados; middleware valida tokens para rutas privadas y sockets.
- Roles y permisos: usuarios (ver productos) y administradores (CRUD completo de productos).
- Gestión de productos: listar, crear, ver detalle, editar y eliminar; subida de imágenes a Cloudinary.
- Chat en tiempo real: integración con Socket.IO; solo usuarios autenticados pueden acceder; los mensajes incluyen nombre de usuario. Historial persistente disponible en la base de datos.
- Persistencia: usuarios, productos y mensajes en MongoDB (modelos en `server/models`).
- PWA: soporte básico (manifest + service worker) para instalación y offline.
- Tests: suites automatizadas con Jest, Supertest y MongoDB Memory Server para probar autenticación, productos y chat.

## 🚀 Ejecutar y probar (rápido)

Hay una demo pública en Render: https://creative-hands-cjzg.onrender.com

Resumen mínimo para ejecutar localmente:

```powershell
# Instalar dependencias (desde la raíz)
npm install

# Desarrollo (server + client en modo dev)
npm run dev

# Para simular producción:
npm run build
npm start
```

Variables de entorno: copia `.env.example` a `.env` y configura al menos `MONGO_URI`, `JWT_SECRET` y las claves de Cloudinary si quieres subir imágenes.

## 🧪 Tests

Ejecución rápida de la suite de tests:

```powershell
npm test
```

Las suites usan Jest, Supertest y MongoDB Memory Server para probar autenticación, productos y chat.

## 🛠️ Stack Tecnológico

**Frontend**
- React 18 + React Router
- Vite
- TailwindCSS + Framer Motion
- Socket.io Client
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT + bcrypt
- Multer + Cloudinary (almacenamiento de imágenes en la nube)

## 📁 Estructura

```
creative-hands/
├── client/               # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Vistas principales
│   │   ├── context/     # Context API (Auth, Socket, Theme)
│   │   └── utils/       # Configuración Axios
│   └── public/
└── server/              # API REST + WebSockets
    ├── models/          # Esquemas Mongoose
    ├── routes/          # Endpoints API
    ├── middleware/      # Autenticación JWT
    ├── config/          # Conexión MongoDB
    └── tests/           # Tests unitarios
```

<!-- Sección de funcionalidades fusionada arriba -->

## 💡 Decisiones de Desarrollo

### Arquitectura
- **Separación cliente-servidor**: Facilita el despliegue independiente y escalabilidad
- **Autenticación con JWT**: Tokens en cookies httpOnly para mayor seguridad contra XSS
- **Socket.io**: Elegido por su simplicidad y soporte nativo para rooms/namespaces

### Frontend
- **Context API vs Redux**: Optamos por Context API dado el tamaño moderado del estado
- **Vite**: Build más rápido que Create React App y mejor DX
- **TailwindCSS**: Desarrollo ágil con utility classes y tema oscuro integrado
- **Lazy loading**: Admin y ChatWidget cargados bajo demanda para optimizar performance

### Backend
- **Mongoose**: ODM que simplifica validaciones y relaciones entre modelos
- **Estructura modular**: Routes, controllers y models separados para escalabilidad
- **Middleware de autenticación**: Reutilizable en todas las rutas protegidas
- **MongoDB Atlas + Render**: BD en la nube y hosting con auto-deploy desde GitHub

### Despliegue
- **Render**: Elegido por su plan gratuito, integración Git y soporte WebSockets
- **MongoDB Atlas**: Cluster M0 gratuito con 512MB de almacenamiento
- **Cloudinary**: Almacenamiento CDN para imágenes (evita pérdida en redeploys de Render)
- **Variables de entorno**: Configuradas en dashboard de Render para seguridad
- **Build automatizado**: Deploy automático en cada push a rama `main`

### Testing
- **Jest + Supertest**: Stack probado para testing de APIs REST
- **MongoDB Memory Server**: Evita dependencias de BD externas en tests
- **Tests aislados**: Cada suite crea y limpia su propia data

### Seguridad
- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens JWT con expiración de 7 días
- CORS configurado para orígenes específicos
- Validación de roles en rutas administrativas
- Variables sensibles en .env (excluido de Git)

### UX
- **ErrorBoundary**: Captura errores de React sin romper la app
- **Loading states**: Feedback visual en operaciones asíncronas
- **Responsive design**: Mobile-first approach con TailwindCSS
- **Animaciones sutiles**: Framer Motion para transiciones fluidas

---

<div align="center">

**Álvaro Lostal**  
_Ingeniería Informática | Universidad Europea del Atlantico_

</div>
