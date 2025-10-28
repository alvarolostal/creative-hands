const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Ruta de ejemplo para comprobar que el router está activo
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Chat route active' });
});

// Obtener admin (devuelve el primer usuario con role 'admin')
router.get('/admin', protect, async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'Administrador no encontrado' });
    res.json({ success: true, admin });
  } catch (error) {
    console.error('Error al obtener admin:', error);
    res.status(500).json({ success: false, message: 'Error al obtener admin' });
  }
});

// Obtener mensajes de una conversación. El cliente puede enviar el conversationId ("id1_id2")
// o puede enviar el userId del otro participante; en este último caso construimos el conversationId
router.get('/messages/:conversationId', protect, async (req, res) => {
  try {
    let { conversationId } = req.params;

    // Si no contiene '_' asumimos que el cliente pasó el userId del otro participante
    if (!conversationId.includes('_')) {
      const otherUserId = conversationId;
      const currentUserId = req.user.id;
      conversationId = [currentUserId, otherUserId].sort().join('_');
    }

    const messages = await Message.find({ conversationId })
      .sort('createdAt')
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mensajes' });
  }
});

// Obtener conversaciones para el usuario autenticado
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .sort('-createdAt')
      .limit(500)
      .populate('sender', 'name email isOnline')
      .populate('receiver', 'name email isOnline');

    // Agrupar por conversationId y construir resumen
    const convMap = new Map();

    for (const msg of messages) {
      if (!convMap.has(msg.conversationId)) {
        const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        convMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Contar no leídos para esta conversación
      const conv = convMap.get(msg.conversationId);
      if (msg.receiver.toString() === userId && !msg.read) {
        conv.unreadCount += 1;
      }
    }

    const conversations = Array.from(convMap.values());

    res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener conversaciones' });
  }
});

module.exports = router;