const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/creative-hands';

const sampleProducts = (userId) => ([
  {
    name: 'Collar de macramé con cuentas',
    description: 'Precioso collar tejido a mano con cuentas naturales. Ideal para looks boho y regalos especiales.',
    price: 29.95,
    category: 'Joyería artesanal',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1516822003754-cca485356ecb?w=1000&q=80&auto=format&fit=crop'],
    featured: true,
    materials: ['algodón', 'madera', 'cuentas'],
    dimensions: { height: 1, width: 40, depth: 0.2, unit: 'cm' },
    weight: { value: 20, unit: 'g' },
    createdBy: userId
  },
  {
    name: 'Vela aromática artesanal - Naranja y canela',
    description: 'Vela hecha con cera de soja 100% y fragancia natural. Aporta calidez y aroma acogedor.',
    price: 14.5,
    category: 'Velas y aromáticos',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1514894781395-71a34a02b6b4?w=1000&q=80&auto=format&fit=crop'],
    featured: true,
    materials: ['cera de soja', 'aceites esenciales'],
    dimensions: { height: 8, width: 7, depth: 7, unit: 'cm' },
    weight: { value: 300, unit: 'g' },
    createdBy: userId
  },
  {
    name: 'Bufanda tejida a mano',
    description: 'Bufanda suave y cálida, tejida con lana reciclada. Disponible en varios colores.',
    price: 45.0,
    category: 'Textiles y ropa',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80&auto=format&fit=crop'],
    featured: false,
    materials: ['lana reciclada'],
    dimensions: { height: 180, width: 30, depth: 0.5, unit: 'cm' },
    weight: { value: 220, unit: 'g' },
    createdBy: userId
  },
  {
    name: 'Juego de cuencos de cerámica esmaltada',
    description: 'Set de tres cuencos hechos a mano con esmalte único. Aptos para uso alimentario.',
    price: 68.0,
    category: 'Cerámica y arcilla',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=1000&q=80&auto=format&fit=crop'],
    featured: false,
    materials: ['arcilla', 'esmalte'],
    dimensions: { height: 6, width: 15, depth: 15, unit: 'cm' },
    weight: { value: 1200, unit: 'g' },
    createdBy: userId
  },
  {
    name: 'Lámina artística - Serie "Manos"',
    description: 'Impresión limitada de una ilustración original, firmada por el autor.',
    price: 35.0,
    category: 'Arte hecho a mano',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1508919801845-fc2ae1bc3b5d?w=1000&q=80&auto=format&fit=crop'],
    featured: true,
    materials: ['papel 300gsm', 'tinta'],
    dimensions: { height: 30, width: 21, depth: 0, unit: 'cm' },
    weight: { value: 150, unit: 'g' },
    createdBy: userId
  }
]);

const importData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB para seed');

    // Crear usuarios de prueba
    const admin = new User({
      name: 'Admin Seed',
      email: 'admin@creative-hands.local',
      password: 'password',
      role: 'admin'
    });
    const user = new User({
      name: 'Usuario Seed',
      email: 'user@creative-hands.local',
      password: 'password',
      role: 'user'
    });

    await User.deleteMany();
    await Product.deleteMany();

    const createdAdmin = await admin.save();
    const createdUser = await user.save();

    const products = sampleProducts(createdAdmin._id);
    await Product.insertMany(products);

    console.log('Seed completado. Usuarios y productos creados.');
    process.exit();
  } catch (error) {
    console.error('Error en importData:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Datos eliminados.');
    process.exit();
  } catch (error) {
    console.error('Error en destroyData:', error);
    process.exit(1);
  }
};

if (process.argv.includes('--destroy') || process.argv.includes('-d')) {
  destroyData();
} else {
  importData();
}
