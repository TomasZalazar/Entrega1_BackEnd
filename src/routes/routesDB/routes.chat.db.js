
import { Router } from 'express';
import chatModel from '../../dao/models/chat.model.js';
const router = Router();

// Endpoint para obtener los mensajes
router.get('/messages', async (req, res) => {
    
  try {
    const messages = await chatModel.find().sort({ createdAt: -1 });
    res.json(messages);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Endpoint para guardar un nuevo mensaje
router.post('/messages', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new chatModel({ user, message });
    await newMessage.save();
    res.status(201).json(newMessage);
    req.app.get('socketServer').emit('newArrived',newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;