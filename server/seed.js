const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/creative-hands';

const sampleProducts = (userIds = []) => {
  // helper para seleccionar aleatoriamente un creador
  const by = () => userIds[Math.floor(Math.random() * userIds.length)];

  return [
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
      createdBy: by()
    },
    {
      name: 'Vela aromática - Naranja y canela',
      description: 'Vela hecha con cera de soja 100% y fragancia natural. Aporta calidez y aroma acogedor.',
      price: 14.5,
      category: 'Velas y aromáticos',
      stock: 30,
      images: ['https://images.unsplash.com/photo-1514894781395-71a34a02b6b4?w=1000&q=80&auto=format&fit=crop'],
      featured: true,
      materials: ['cera de soja', 'aceites esenciales'],
      dimensions: { height: 8, width: 7, depth: 7, unit: 'cm' },
      weight: { value: 300, unit: 'g' },
      createdBy: by()
    },
    {
      name: 'Bufanda lana tejida a mano',
      description: 'Bufanda suave y cálida, tejida con lana reciclada. Disponible en varios colores.',
      price: 45.0,
      category: 'Textiles y ropa',
      stock: 8,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80&auto=format&fit=crop'],
      featured: false,
      materials: ['lana reciclada'],
      dimensions: { height: 180, width: 30, depth: 0.5, unit: 'cm' },
      weight: { value: 220, unit: 'g' },
      createdBy: by()
    },
    {
      name: 'Juego de cuencos de cerámica',
      description: 'Set de tres cuencos hechos a mano con esmalte único. Aptos para uso alimentario.',
      price: 68.0,
      category: 'Cerámica y arcilla',
      stock: 5,
      images: ['https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=1000&q=80&auto=format&fit=crop'],
      featured: false,
      materials: ['arcilla', 'esmalte'],
      dimensions: { height: 6, width: 15, depth: 15, unit: 'cm' },
      weight: { value: 1200, unit: 'g' },
      createdBy: by()
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
      createdBy: by()
    },
    {
      name: 'Taza cerámica pintada a mano',
      description: 'Taza única, ideal para café o té. Acabado esmaltado y apta para lavavajillas.',
      price: 22.0,
      category: 'Cerámica y arcilla',
      stock: 25,
      images: ['https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1000&q=80&auto=format&fit=crop'],
      materials: ['arcilla', 'esmalte'],
      createdBy: by()
    },
    {
      name: 'Bolsa tote de algodón serigrafiada',
      description: 'Bolsa resistente con ilustración serigrafiada. Perfecta para compras y uso diario.',
      price: 18.0,
      category: 'Textiles y ropa',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1520975911567-0b9b4d9d3f05?w=1000&q=80&auto=format&fit=crop'],
      materials: ['algodón'],
      createdBy: by()
    },
    {
      name: 'Macramé colgante para pared',
      description: 'Decoración bohemia tejida a mano, añade calidez a cualquier habitación.',
      price: 55.0,
      category: 'Arte hecho a mano',
      stock: 10,
      images: ['https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1000&q=80&auto=format&fit=crop'],
      materials: ['algodón'],
      createdBy: by()
    },
    {
      name: 'Jabón artesanal - Lavanda',
      description: 'Jabón hecho a mano con aceites naturales y lavanda. Suave para la piel.',
      price: 6.5,
      category: 'Velas y aromáticos',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80&auto=format&fit=crop'],
      materials: ['aceites naturales', 'lavanda'],
      createdBy: by()
    },
    {
      name: 'Cuaderno encuadernado a mano',
      description: 'Cuaderno con papel de alta calidad y encuadernación artesanal.',
      price: 20.0,
      category: 'Arte hecho a mano',
      stock: 60,
      images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1000&q=80&auto=format&fit=crop'],
      materials: ['papel', 'tela'],
      createdBy: by()
    },
    {
      name: 'Pendientes de arcilla polimérica',
      description: 'Pendientes ligeros y coloridos hechos a mano.',
      price: 16.0,
      category: 'Joyería artesanal',
      stock: 45,
      images: ['https://images.unsplash.com/photo-1520975911567-0b9b4d9d3f05?w=1000&q=80&auto=format&fit=crop'],
      materials: ['arcilla polimérica', 'gancho de acero inoxidable'],
      createdBy: by()
    },
    {
      name: 'Maceta de cerámica esmaltada',
      description: 'Maceta pequeña con esmalte brillante, perfecta para suculentas.',
      price: 24.0,
      category: 'Cerámica y arcilla',
      stock: 35,
      images: ['https://images.unsplash.com/photo-1592928302472-9f9d6f1a6c9d?w=1000&q=80&auto=format&fit=crop'],
      materials: ['arcilla', 'esmalte'],
      createdBy: by()
    },
    {
      name: 'Cuchara de madera tallada',
      description: 'Cuchara de cocina hecha a mano, acabado suave y duradero.',
      price: 12.0,
      category: 'Arte hecho a mano',
      stock: 80,
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80&auto=format&fit=crop'],
      materials: ['madera'],
      createdBy: by()
    },
    {
      name: 'Posavasos tejidos de yute',
      description: 'Set de 4 posavasos resistentes y decorativos.',
      price: 15.0,
      category: 'Arte hecho a mano',
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505691723518-36a6f8c5f6b6?w=1000&q=80&auto=format&fit=crop'],
      materials: ['yute'],
      createdBy: by()
    },
    {
      name: 'Cinturón de lona y hebilla metálica',
      description: 'Cinturón resistente con acabado artesanal.',
      price: 27.0,
      category: 'Textiles y ropa',
      stock: 22,
      images: ['https://images.unsplash.com/photo-1519741492740-08f8b0e2a3b4?w=1000&q=80&auto=format&fit=crop'],
      materials: ['lona', 'metal'],
      createdBy: by()
    },
    {
      name: 'Mini bolso bandolera de cuero vegano',
      description: 'Bolso pequeño ideal para llevar lo esencial, acabado artesanal.',
      price: 49.0,
      category: 'Textiles y ropa',
      stock: 14,
      images: ['https://images.unsplash.com/photo-1520975911567-0b9b4d9d3f05?w=1000&q=80&auto=format&fit=crop'],
      materials: ['cuero vegano'],
      createdBy: by()
    },
    {
      name: 'Set de imanes decorativos',
      description: 'Imanes con diseños originales impresos sobre madera.',
      price: 9.0,
      category: 'Arte hecho a mano',
      stock: 120,
      images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80&auto=format&fit=crop'],
      materials: ['madera', 'imán'],
      createdBy: by()
    },
    {
      name: 'Guirnalda de luces con cuentas',
      description: 'Guirnalda decorativa con cuentas y micro-LEDs, ambiente acogedor.',
      price: 32.0,
      category: 'Arte hecho a mano',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1000&q=80&auto=format&fit=crop'],
      materials: ['LED', 'cuerda', 'cuentas'],
      createdBy: by()
    }
  ];
};

const importData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB para seed');

    // Crear usuarios de prueba: 1 admin y 2 usuarios normales
    const admin = new User({
      name: 'Admin Seed',
      email: 'admin@creative-hands.local',
      password: 'password',
      role: 'admin'
    });
    const user1 = new User({
      name: 'Usuario Uno',
      email: 'user1@creative-hands.local',
      password: 'password',
      role: 'user'
    });
    const user2 = new User({
      name: 'Usuario Dos',
      email: 'user2@creative-hands.local',
      password: 'password',
      role: 'user'
    });

    // Limpiar colecciones antes de insertar
    await User.deleteMany();
    await Product.deleteMany();

    // Guardar usuarios y obtener sus IDs
    const createdAdmin = await admin.save();
    const createdUser1 = await user1.save();
    const createdUser2 = await user2.save();

    const userIds = [createdAdmin._id, createdUser1._id, createdUser2._id];

    // Crear muchos productos y asignar createdBy aleatoriamente
    const products = sampleProducts(userIds);
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
