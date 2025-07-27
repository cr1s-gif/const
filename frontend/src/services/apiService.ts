// frontend/src/services/apiService.ts
const API_BASE_URL = 'http://localhost:5000/api/questions';

export async function generateMathQuestions(topic: string, count: number = 5): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, count }),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error al obtener preguntas: ${(error as Error).message}`);
  }
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}