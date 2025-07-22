// Este archivo mapea los IDs locales de las preguntas (q1, q2, etc.) a los UUIDs reales en la base de datos

// Mapeo de IDs locales a UUIDs de la base de datos
export const questionIdToUuid: Record<string, string> = {
  // Estos UUIDs deben existir en la tabla preguntas
  // Usamos los UUIDs reales de las preguntas que ya existen en la base de datos
  'q1': 'd90ddd09-3878-4efc-9059-7279570157bc', // ¿Con qué compañeros/as te gusta estar más?
  'q2': '47b56067-0c8c-4565-b645-80348852907f', // ¿Con qué compañeros/as te gusta estar menos?
  'q3': 'dae67e87-db3e-4637-ace1-f1148f1d7d69', // ¿Quiénes suelen intimidar o maltratar a otros compañeros/as?
  'q4': 'd2888d67-9878-4cdf-8a58-592c251c1cb6', // ¿Quiénes suelen ser víctimas de intimidación o maltrato?
  'q5': '0489df06-c6e7-48ec-8fb0-49469ec541ae', // ¿Qué tipo de maltrato o intimidación es más frecuente?
  'q6': '775af389-a84d-4f40-8fb9-7b94cbea5498', // ¿Dónde suelen ocurrir estas situaciones?
  'q7': '8e0be6b5-fa0b-4215-bc60-0c91065bbaa9', // ¿Con qué frecuencia ocurren las agresiones?
  'q8': 'eec6513e-f5b7-45b1-b21d-4e4551b3e504', // ¿Crees que estas situaciones encierran gravedad?
  'q9': '8074fef6-4952-4857-b97c-08a1a8805522', // ¿Te encuentras seguro/a en el centro escolar?
  // Para las preguntas restantes, usamos los UUIDs ficticios que ya existen en la base de datos
  'q10': '00000000-0000-0000-0000-000000000010',
  'q11': '00000000-0000-0000-0000-000000000011',
  'q12': '00000000-0000-0000-0000-000000000012',
  'q13': '00000000-0000-0000-0000-000000000013',
  'q14': '00000000-0000-0000-0000-000000000014',
  'q15': '00000000-0000-0000-0000-000000000015',
};

// Función para convertir un ID local a UUID
export function getQuestionUuid(localId: string): string {
  const uuid = questionIdToUuid[localId];
  if (!uuid) {
    throw new Error(`No se encontró un UUID para el ID local: ${localId}`);
  }
  return uuid;
}
