# Guía de Despliegue - Creative Hands E-commerce

## Configuración Requerida

### 1. MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster
3. Configura las reglas de acceso de red
4. Obtén tu connection string
5. Reemplaza `<password>` con tu contraseña

### 2. Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Ve a tu Dashboard
3. Obtén tus credenciales:
   - Cloud Name
   - API Key
   - API Secret

### 3. Stripe (Opcional - Para pagos)

1. Crea una cuenta en [Stripe](https://stripe.com/)
2. Obtén tus claves de API en modo de prueba
3. Posteriormente puedes activar el modo producción

## Variables de Entorno

### Backend (server/.env)

```env
NODE_ENV=production
PORT=5000

# Base de datos
MONGODB_URI=tu_mongodb_connection_string

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin por defecto
ADMIN_EMAIL=admin@creativehands.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Administrador

# Cliente URL
CLIENT_URL=https://tu-dominio-frontend.com

# Stripe (Opcional)
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

### Frontend (client/.env)

```env
VITE_API_URL=https://tu-dominio-backend.com
```

## Opción 1: Despliegue en Render.com

### Backend

1. Ve a [Render.com](https://render.com/) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: creative-hands-api
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Añade las variables de entorno listadas arriba
6. Haz clic en "Create Web Service"

### Frontend

1. En Render, haz clic en "New +" y selecciona "Static Site"
2. Conecta tu repositorio
3. Configura:
   - **Name**: creative-hands
   - **Root Directory**: client
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
4. Añade las variables de entorno
5. Haz clic en "Create Static Site"

## Opción 2: Despliegue en Vercel (Frontend) + Render (Backend)

### Backend en Render

Sigue los pasos de la sección anterior para el backend.

### Frontend en Vercel

1. Ve a [Vercel.com](https://vercel.com/) y crea una cuenta
2. Haz clic en "Add New..." → "Project"
3. Importa tu repositorio de GitHub
4. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Añade las variables de entorno
6. Haz clic en "Deploy"

## Opción 3: Despliegue en VPS (DigitalOcean, AWS, etc.)

### Requisitos

- Ubuntu 20.04 o superior
- Node.js 18 o superior
- Nginx
- PM2

### Pasos

1. **Instalar dependencias**

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y
```

2. **Clonar el repositorio**

```bash
cd /var/www
git clone https://github.com/tu-usuario/creative-hands.git
cd creative-hands
```

3. **Configurar backend**

```bash
cd server
npm install
# Crear archivo .env con las variables de entorno
nano .env
# Iniciar con PM2
pm2 start server.js --name creative-hands-api
pm2 save
pm2 startup
```

4. **Configurar frontend**

```bash
cd ../client
npm install
# Crear archivo .env con las variables de entorno
nano .env
npm run build
```

5. **Configurar Nginx**

```bash
sudo nano /etc/nginx/sites-available/creative-hands
```

Añade:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/creative-hands/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Activar el sitio**

```bash
sudo ln -s /etc/nginx/sites-available/creative-hands /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Configurar SSL con Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com
```

## Verificación

Después del despliegue, verifica:

1. ✅ El frontend carga correctamente
2. ✅ Puedes registrarte e iniciar sesión
3. ✅ Las imágenes se suben a Cloudinary
4. ✅ El chat en tiempo real funciona
5. ✅ El carrito de compra funciona
6. ✅ Los pedidos se crean correctamente

## Mantenimiento

### Actualizar la aplicación

```bash
cd /var/www/creative-hands
git pull origin main

# Backend
cd server
npm install
pm2 restart creative-hands-api

# Frontend
cd ../client
npm install
npm run build
```

### Ver logs

```bash
# Logs del backend
pm2 logs creative-hands-api

# Logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

### Backup de la base de datos

```bash
# Con mongodump (si tienes acceso directo)
mongodump --uri="tu_mongodb_uri" --out=/backup/creative-hands-$(date +%Y%m%d)

# O desde MongoDB Atlas Dashboard
# Utiliza la función de backup automático
```

## Soporte

Para cualquier problema durante el despliegue:

1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Asegúrate de que las URLs estén correctamente configuradas
4. Revisa la documentación de cada servicio utilizado
