const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const bodyParser = require('body-parser');
const cors = require('cors'); // npm install cors

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());

// Ruta para consultar a la IA (Ollama DeepSeek)
app.post('/api/questions/generate', async (req, res) => {
  const { topic, count = 5 } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Falta el tema de las preguntas' });
  }

  try {
    // Crear un prompt específico para generar preguntas de quiz
    const prompt = `Genera ${count} preguntas de opción múltiple sobre ${topic} para un quiz educativo. 
    Cada pregunta debe tener:
    - Un enunciado claro
    - 4 opciones de respuesta (a, b, c, d)
    - La respuesta correcta marcada
    - Una explicación detallada
    - Una pista útil
    
    Devuelve el resultado en formato JSON con este esquema:
    {
      "questions": [
        {
          "question": "texto de la pregunta",
          "options": ["opción a", "opción b", "opción c", "opción d"],
          "correctAnswer": "opción correcta",
          "explanation": "explicación detallada",
          "hint": "pista útil"
        }
      ]
    }`;

    const response = await fetch('https://bec82014e6c1.ngrok-free.app/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Parsear la respuesta de la IA (puede venir como texto JSON)
    let questions = [];
    try {
      const parsedResponse = JSON.parse(data.response);
      questions = parsedResponse.questions || [];
    } catch (e) {
      console.error('Error parsing AI response:', e);
      throw new Error('La IA no devolvió un formato válido de preguntas');
    }

    res.json(questions);

  } catch (error) {
    console.error('Error al generar preguntas:', error.message);
    res.status(500).json({ 
      error: 'Error al generar preguntas', 
      detalle: error.message 
    });
  }
});

// Ruta de salud para verificar que el backend está funcionando
app.get('/api/questions/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de preguntas funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});