# 🎨 Creative Hands

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**Portal de productos artesanales con autenticación JWT y chat en tiempo real**  
_Trabajo práctico para Desarrollo Web I_

[🌐 Ver Demo en Vivo](https://creative-hands-cjzg.onrender.com)

</div>

---

## 📋 Descripción

Aplicación web full-stack para la venta de productos artesanales que permite a usuarios navegar por catálogos organizados por categorías, mientras que los administradores gestionan productos, categorías y se comunican con clientes mediante un sistema de chat en tiempo real.

## 🚀 Ejecución y Pruebas

### Opción 1: Probar la aplicación en producción

La aplicación está desplegada en **Render** con **MongoDB Atlas**:

🔗 **[https://creative-hands-cjzg.onrender.com](https://creative-hands-cjzg.onrender.com/)**

> ⚠️ **Nota**: El primer acceso puede tardar ~1 minuto (Render hiberna servicios gratuitos tras inactividad)

### Opción 2: Ejecutar localmente

#### Requisitos previos
- Node.js 18+ y npm
- MongoDB (local o Atlas)
- Git

#### Instalación

```bash
# Clonar repositorio
git clone https://github.com/alvarolostal/creative-hands.git
cd creative-hands

# Instalar dependencias del servidor y cliente
npm install
cd client && npm install && cd ..

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MongoDB, JWT_SECRET y Cloudinary
```

#### Desarrollo

```bash
# Iniciar servidor y cliente simultáneamente
npm run dev

# O por separado:
npm run server  # Backend en http://localhost:5000
npm run client  # Frontend en http://localhost:5173
```

#### Producción

```bash
npm run build
npm start
```

## 🧪 Testing

```bash
npm test
```

Los tests cubren autenticación, gestión de productos, categorías y chat usando Jest, Supertest y MongoDB Memory Server.

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

## 🎯 Funcionalidades

### Usuarios
✅ Registro y autenticación con JWT  
✅ Navegación por categorías de productos  
✅ Visualización detallada de productos  
✅ Sistema de valoraciones  
✅ Chat en tiempo real con administradores  
✅ Tema claro/oscuro automático

### Administradores
✅ Panel de administración protegido  
✅ CRUD completo de productos y categorías  
✅ Subida de imágenes a Cloudinary con optimización automática  
✅ Gestión de múltiples conversaciones simultáneas  
✅ Indicadores de estado (online/escribiendo)

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
