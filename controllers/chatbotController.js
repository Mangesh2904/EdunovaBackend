import { askGemini } from '../services/geminiService.js';
import Chat from '../models/Chat.js';

export const askChatbot = async (req, res) => {
  const { message, chatHistory = [] } = req.body;
  const userId = req.user ? req.user.id : null;

  try {
    // Enhanced system context for study-focused responses
    const systemContext = `You are EduBot, a friendly and knowledgeable educational assistant for Edunova - a learning platform. Your purpose is to help students with:

1. Academic subjects (Math, Science, Programming, etc.)
2. Study tips and learning strategies
3. Career guidance and skill development
4. Technology and coding questions
5. General educational advice

IMPORTANT RULES:
- Be warm, encouraging, and supportive
- Keep responses clear, concise, and easy to understand
- Use examples and analogies when explaining concepts
- If asked about non-educational topics (entertainment, politics, gossip, etc.), politely redirect: "I'm here to help with your studies and learning! 📚 How can I assist you with your education today?"
- Encourage curiosity and deeper learning
- Suggest resources when relevant (but don't make up URLs)

User's question: ${message}`;

    const botResponse = await askGemini(systemContext, chatHistory);
    
    if (userId) {
      const chat = new Chat({
        userId,
        userMessage: message,
        botResponse
      });
      await chat.save();
    }

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('Error in chatbot request:', error);
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
};

export const getChatHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};