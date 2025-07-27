import { generateMathQuestions } from '../services/questionService.js';

export const generateQuestions = async (req, res) => {
  try {
    const { topic, count } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'El campo "topic" es requerido' });
    }

    const questions = await generateMathQuestions(topic, count || 5);
    res.json(questions);
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ 
      error: 'Error al generar preguntas',
      details: error.message 
    });
  }
};

export const healthCheck = (req, res) => {
  res.json({ 
    status: 'active', 
    message: 'Learning Hub API está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
};