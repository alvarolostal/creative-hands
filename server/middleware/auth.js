const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas (verifica JWT en header Authorization o cookies)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No autorizado, token faltante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    console.error('Middleware protect error:', error.message);
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Middleware para rutas sólo administradores
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Permisos de administrador requeridos' });
};

module.exports = { protect, adminOnly };