import { pipeline } from '@xenova/transformers';
import { modelConfig } from '../config/transformer.js';

let generator = null;
let initializationPromise = null;

export async function initializeGenerator() {
  if (generator) return generator;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      console.log("Inicializando modelo de IA...");
      const model = await pipeline('text2text-generation', modelConfig.modelName, modelConfig);
      console.log("Modelo de IA cargado correctamente");
      generator = model;
      return generator;
    } catch (error) {
      console.error("Error al inicializar el generador:", error);
      initializationPromise = null;
      throw new Error("No se pudo inicializar el generador de preguntas");
    }
  })();

  return initializationPromise;
}

export async function generateMathQuestions(topic, count = 5) {
  try {
    const gen = await initializeGenerator();
    
    if (!gen || typeof gen !== 'function') {
      throw new Error('El generador no se inicializó correctamente');
    }

    console.log(`Generando ${count} preguntas sobre ${topic}`);

    const prompt = `Genera ${count} preguntas de opción múltiple sobre ${topic} en matemáticas con este formato exacto para cada pregunta:
    
    P: [Pregunta clara]
    O: [Opción1, Opción2, Opción3, Opción4]
    R: [Opción correcta]
    E: [Explicación detallada]
    H: [Pista útil]
    ---`;

    const output = await gen(prompt, {
      max_new_tokens: 2000,
      temperature: 0.7,
      do_sample: true,
    });

    console.log("Respuesta del modelo recibida");
    return parseGeneratedText(output[0].generated_text).slice(0, count);
  } catch (error) {
    console.error("Error en generateMathQuestions:", error);
    throw new Error(`Error al generar preguntas: ${error.message}`);
  }
}

function parseGeneratedText(text) {
  const questions = [];
  const blocks = text.split('---').filter(b => b.trim().length > 0);

  for (const block of blocks) {
    try {
      const lines = block.split('\n').filter(l => l.trim().length > 0);
      
      const question = lines.find(l => l.startsWith('P:'))?.substring(2).trim() || '';
      const optionsLine = lines.find(l => l.startsWith('O:'))?.substring(2).trim() || '';
      const options = optionsLine.split(',').map(o => o.trim()).filter(o => o.length > 0);
      const answer = lines.find(l => l.startsWith('R:'))?.substring(2).trim() || '';
      const explanation = lines.find(l => l.startsWith('E:'))?.substring(2).trim() || '';
      const hint = lines.find(l => l.startsWith('H:'))?.substring(2).trim() || '';

      if (question && options.length >= 2 && answer) {
        questions.push({
          question,
          options: completeOptions(options),
          correctAnswer: answer,
          explanation: explanation || 'Explicación no disponible',
          hint: hint || 'Aplica los conceptos fundamentales del tema'
        });
      }
    } catch (e) {
      console.warn("Error al parsear bloque de pregunta:", e);
    }
  }

  return questions;
}

function completeOptions(options) {
  const completed = [...options];
  while (completed.length < 4) {
    completed.push(`Opción ${completed.length + 1}`);
  }
  return completed.slice(0, 4);
}