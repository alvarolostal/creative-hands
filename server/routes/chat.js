const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Ruta de ejemplo para comprobar que el router está activo
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Chat route active' });
});

// Obtener mensajes de una conversación por conversationId
router.get('/messages/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
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

// Obtener conversaciones simples (mensajes donde participa el usuario)
router.get('/conversations/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .sort('-createdAt')
      .limit(100)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener conversaciones' });
  }
});

module.exports = router;