import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  messages: [messageSchema],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

app.post('/api/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  let convo;
  if (conversationId) {
    convo = await Conversation.findById(conversationId);
  } else {
    convo = new Conversation({ messages: [] });
  }
  convo.messages.push({ role: 'user', content: message });
  const aiReply = await callGemini(message);
  convo.messages.push({ role: 'assistant', content: aiReply });
  await convo.save();
  res.json({ reply: aiReply, conversationId: convo.id });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
