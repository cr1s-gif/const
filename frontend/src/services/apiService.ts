// frontend/src/services/apiService.ts
const API_BASE_URL = 'http://localhost:3000'; // Cambiar al puerto de tu backend

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export async function generateMathQuestions(topic: string, count: number = 5): Promise<GeneratedQuestion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, count }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data as GeneratedQuestion[];
  } catch (error) {
    console.error('Error en generateMathQuestions:', error);
    throw new Error(`Error al obtener preguntas: ${(error as Error).message}`);
  }
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions/health`);
    return response.ok;
  } catch (error) {
    console.error('Error en checkAPIHealth:', error);
    return false;
  }
}