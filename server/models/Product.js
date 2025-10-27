const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'Joyería artesanal',
      'Velas y aromáticos',
      'Textiles y ropa',
      'Cerámica y arcilla',
      'Arte hecho a mano'
    ]
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  materials: [String],
  dimensions: {
    height: Number,
    width: Number,
    depth: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      default: 'g'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);