import { env } from '@xenova/transformers';

// Configuración del entorno para transformers
env.allowLocalModels = true;
env.localModelPath = './models';
env.allowRemoteModels = true;

export const modelConfig = {
  modelName: 'Xenova/LaMini-Flan-T5-248M',
  quantized: true,
  progress_callback: (progress) => {
    console.log(`Progreso: ${progress.status} - ${progress.loaded}/${progress.total}`);
  }
};