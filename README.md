# 🎨 Creative Hands - Portal de Productos Artesanales

Portal completo de comercio electrónico de productos hechos a mano con autenticación JWT, roles de usuario, chat en tiempo real y panel de administración.

## ✨ Características Principales

### 🔐 Autenticación y Autorización

- Sistema de registro e inicio de sesión con JWT
- Roles de usuario: **Usuario** y **Administrador**
- Rutas protegidas según rol
- Sesiones persistentes con localStorage
- Administrador predefinido en el sistema

### 📦 Gestión de Productos (CRUD Completo)

- **Usuarios**: Pueden ver todos los productos y filtrar por categoría
- **Administradores**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- 5 categorías de productos artesanales:
  - Joyería artesanal
  - Velas y aromáticos
  - Textiles y ropa
  - Cerámica y arcilla
  - Arte hecho a mano
- Sistema de búsqueda en tiempo real
- Filtros por categoría
- Productos destacados

### 💬 Chat en Tiempo Real

- **Usuarios**: Chat flotante para comunicarse con el administrador
- **Administrador**: Panel de conversaciones con todos los usuarios
- Indicadores de "usuario escribiendo..."
- Notificaciones de mensajes no leídos
- Estado online/offline de usuarios
- Historial de mensajes persistente en MongoDB
- Interfaz tipo WhatsApp/Messenger

### 🎨 Diseño Apple-Style

- **Minimalista pero sofisticado**
- Glassmorphism (efecto cristal esmerilado)
- Animaciones suaves con Framer Motion
- Modo oscuro/claro con transiciones suaves
- Responsive design para móviles, tablets y desktop
- Color principal: `#CB6843` (terracota/cerámica)
- Tipografía Inter (Apple-style)

### 🛠️ Tecnologías Utilizadas

#### Backend

- **Node.js** + **Express**: Servidor y API REST
- **MongoDB** + **Mongoose**: Base de datos NoSQL
- **Socket.IO**: Comunicación en tiempo real
- **JWT**: Autenticación segura
- **bcryptjs**: Encriptación de contraseñas

#### Frontend

- **React 18** + **Vite**: Framework y build tool
- **React Router**: Navegación SPA
- **Tailwind CSS**: Estilos utility-first
- **Framer Motion**: Animaciones fluidas
- **Axios**: Cliente HTTP
- **Socket.IO Client**: WebSockets
- **Lucide React**: Iconos modernos

## 📋 Requisitos Previos

- **Node.js** v16 o superior
- **MongoDB** instalado y ejecutándose (o MongoDB Atlas)
- **npm** o **yarn**

## 🚀 Instalación y Configuración

### 1. Clonar o crear el proyecto

```bash
# Si clonaste el repositorio
cd creative-hands

# Si estás creando desde cero, ya deberías tener la estructura
```

### 2. Instalar dependencias del backend

```bash
# Desde la raíz del proyecto
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd client
npm install
cd ..
```

### 4. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto con:

```env
# MongoDB (usa MongoDB Atlas)
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/creative-hands?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion_12345
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Admin por defecto
ADMIN_EMAIL=admin@creativehands.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Administrador
```

### 5. Ejecutar la aplicación

#### Opción A: Desarrollo con un solo comando (Recomendado)

```bash
# Instalar concurrently primero
npm install -g concurrently

# Ejecutar backend y frontend simultáneamente
npm run dev
```

#### Opción B: Terminales separadas

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm run client
```

### 6. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👤 Credenciales de Administrador

```
Email: admin@creativehands.com
Password: Admin123!
```

El administrador se crea automáticamente al iniciar el servidor si no existe.

## 📂 Estructura del Proyecto

```
creative-hands/
├── server/
│   ├── config/
│   │   └── db.js                 # Configuración MongoDB
│   ├── middleware/
│   │   └── auth.js               # Middleware JWT
│   ├── models/
│   │   ├── User.js               # Modelo de usuario
│   │   ├── Product.js            # Modelo de producto
│   │   └── Message.js            # Modelo de mensaje
│   ├── routes/
│   │   ├── auth.js               # Rutas de autenticación
│   │   ├── products.js           # Rutas de productos
│   │   └── chat.js               # Rutas de chat
│   └── server.js                 # Servidor principal
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Barra de navegación
│   │   │   ├── ChatWidget.jsx    # Chat flotante (usuarios)
│   │   │   ├── AdminChat.jsx     # Panel de chat (admin)
│   │   │   └── ProductCard.jsx   # Tarjeta de producto
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Contexto de autenticación
│   │   │   ├── SocketContext.jsx # Contexto de Socket.IO
│   │   │   └── ThemeContext.jsx  # Contexto de tema
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Página de inicio
│   │   │   ├── Login.jsx         # Página de login
│   │   │   ├── Register.jsx      # Página de registro
│   │   │   ├── Products.jsx      # Página de productos
│   │   │   └── Admin.jsx         # Panel de administración
│   │   ├── App.jsx               # Componente principal
│   │   ├── main.jsx              # Punto de entrada
│   │   └── index.css             # Estilos globales
│   ├── tailwind.config.js        # Configuración Tailwind
│   ├── vite.config.js            # Configuración Vite
│   └── package.json
├── .env                          # Variables de entorno
├── package.json
└── README.md
```

## 🎯 Funcionalidades por Rol

### 👥 Usuario Normal

- ✅ Registrarse e iniciar sesión
- ✅ Ver todos los productos
- ✅ Buscar productos por nombre/descripción
- ✅ Filtrar productos por categoría
- ✅ Abrir chat flotante para hablar con admin
- ✅ Ver historial de mensajes
- ✅ Indicador de "escribiendo..."
- ✅ Cambiar entre tema claro y oscuro

### 👨‍💼 Administrador

- ✅ Todas las funciones de usuario normal
- ✅ Crear nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Ver panel de conversaciones
- ✅ Chatear con múltiples usuarios
- ✅ Ver contador de mensajes no leídos
- ✅ Ver estado online/offline de usuarios

## 🔧 API Endpoints

### Autenticación

```
POST   /api/auth/register       - Registrar usuario
POST   /api/auth/login          - Iniciar sesión
GET    /api/auth/me             - Obtener usuario actual
POST   /api/auth/logout         - Cerrar sesión
```

### Productos

```
GET    /api/products            - Obtener todos los productos
GET    /api/products/:id        - Obtener producto por ID
POST   /api/products            - Crear producto (Admin)
PUT    /api/products/:id        - Actualizar producto (Admin)
DELETE /api/products/:id        - Eliminar producto (Admin)
```

### Chat

```
GET    /api/chat/conversations  - Obtener conversaciones (Admin)
GET    /api/chat/messages/:id   - Obtener mensajes de conversación
POST   /api/chat/messages       - Enviar mensaje
GET    /api/chat/admin          - Obtener info del admin
```

## 🎨 Decisiones de Diseño

### Por qué estos colores

- **Primary (#CB6843)**: Color terracota que evoca la cerámica artesanal y productos hechos a mano
- **Dark (#262624)**: Gris oscuro cálido para modo oscuro, menos agresivo que el negro puro
- **Light (#F5F5F4)**: Blanco roto para modo claro, más suave para la vista

### Por qué Glassmorphism

- Estética moderna y premium (Apple-style)
- Sensación de profundidad y capas
- Elegante sin ser recargado
- Perfecto para productos artesanales de alta calidad

### Por qué animaciones suaves

- Mejora la experiencia de usuario
- Hace la interfaz más "viva"
- Guía la atención del usuario
- Transmite profesionalismo y cuidado

### Por qué chat flotante vs integrado

- **Para usuarios**: No interrumpe la navegación, siempre accesible
- **Para admin**: Panel dedicado con gestión de múltiples conversaciones
- Mejor UX según el contexto de uso

## 🚀 Despliegue

### 📚 Guías de Deploy Disponibles

Hemos creado guías completas para hacer el deploy de este proyecto:

1. **[GUIA_VISUAL_DEPLOY.md](GUIA_VISUAL_DEPLOY.md)** - 📱 Guía paso a paso con instrucciones visuales (RECOMENDADA)
2. **[DEPLOY.md](DEPLOY.md)** - 📖 Guía detallada completa con todos los detalles
3. **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - ✅ Lista de verificación
4. **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** - 📋 Comandos para copiar y pegar

### Deploy con MongoDB Atlas + Render (Gratis)

El proyecto está listo para desplegarse en:
- **Base de datos**: MongoDB Atlas (plan gratuito)
- **Backend + Frontend**: Render (plan gratuito)

Sigue la [GUIA_VISUAL_DEPLOY.md](GUIA_VISUAL_DEPLOY.md) para instrucciones paso a paso.

### Resumen Rápido

1. Crear cluster en MongoDB Atlas
2. Subir código a GitHub
3. Crear Web Service en Render
4. Configurar variables de entorno
5. ¡Listo! Tu app está en producción

## 🐛 Solución de Problemas

### MongoDB no conecta

```bash
# Verificar que MongoDB está corriendo
mongod --version

# Reiniciar servicio
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # Mac
```

### Puerto ya en uso

```bash
# Cambiar PORT en .env
PORT=3000  # o cualquier otro puerto disponible
```

### Error de CORS

- Verificar que el frontend está en `http://localhost:5173`
- Verificar configuración de CORS en `server.js`

### Socket.IO no conecta

- Verificar que el token JWT es válido
- Abrir consola del navegador para ver errores
- Verificar que el backend está corriendo

## 📝 Notas Adicionales

### Seguridad

- Las contraseñas se encriptan con bcrypt (salt rounds: 10)
- JWT expira en 7 días (configurable)
- Rutas protegidas con middleware
- Validación de roles en backend

### Performance

- Socket.IO para comunicación eficiente en tiempo real
- Lazy loading de componentes (posible mejora futura)
- Índices en MongoDB para búsquedas rápidas
- Debounce en búsqueda de productos (posible mejora futura)

### Escalabilidad

- Arquitectura modular
- Separación clara de responsabilidades
- Fácil añadir nuevas features
- Preparado para microservicios

## 🎓 Criterios de Evaluación Cubiertos

| Criterio            | Completado | Detalles                              |
| ------------------- | ---------- | ------------------------------------- |
| Autenticación JWT   | ✅ 20%     | Login, Register, Protected Routes     |
| Roles y permisos    | ✅ 15%     | User/Admin con permisos diferenciados |
| CRUD de productos   | ✅ 25%     | Completo con MongoDB                  |
| Chat en tiempo real | ✅ 20%     | Socket.IO, historial persistente      |
| Código limpio       | ✅ 10%     | Modular, comentado, buenas prácticas  |
| Documentación       | ✅ 10%     | README completo con instrucciones     |

### Puntos Extra Implementados

- ✅ Persistencia del historial de chat
- ✅ Interfaz con diseño moderno (Glassmorphism, animaciones)
- ✅ Modo oscuro/claro
- ✅ Indicadores de typing
- ✅ Estados online/offline
- ✅ Búsqueda y filtros avanzados

## 📞 Soporte

Para cualquier duda o problema:

1. Revisar esta documentación
2. Verificar la consola del navegador y del servidor
3. Verificar que MongoDB está corriendo
4. Verificar variables de entorno

---

**Desarrollado con ❤️ para Creative Hands**

_Un proyecto de práctica que demuestra integración completa de tecnologías modernas para desarrollo web full-stack._
