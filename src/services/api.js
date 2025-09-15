// Mock client-side API to simulate question generation

function randomChoice(list) { return list[Math.floor(Math.random() * list.length)]; }

export async function generateQuestions({ tema, tipo, cantidad }) {
  await new Promise(r => setTimeout(r, 600));
  const difficulties = ['facil', 'media', 'dificil'];
  const baseOptions = [
    ['A', 'B', 'C', 'D'],
    ['Verdadero', 'Falso'],
    ['Patrón 1', 'Patrón 2', 'Patrón 3', 'Patrón 4']
  ];
  const optionsByType = {
    opcion_multiple: baseOptions[0],
    verdadero_falso: baseOptions[1],
    matriz_logica: baseOptions[2]
  };
  const makeQuestion = (i) => {
    const opciones = Array.from(optionsByType[tipo] || baseOptions[0]);
    return {
      id: `temp-${Date.now()}-${i}`,
      pregunta: `(${tema}) Pregunta de tipo ${tipo} #${i + 1}`,
      opciones,
      respuesta_correcta: opciones[0],
      tipo,
      tema,
      dificultad: randomChoice(difficulties),
      fecha_creacion: new Date().toISOString(),
      fecha_ultimo_uso: null,
      imagenUrl: tipo === 'matriz_logica' ? `https://picsum.photos/seed/${encodeURIComponent(tema)}-${i}/640/360` : undefined,
      descripcion_logica: tipo === 'matriz_logica' ? 'Relación visual entre patrones.' : undefined
    };
  };
  return Array.from({ length: cantidad }, (_, i) => makeQuestion(i));
}


