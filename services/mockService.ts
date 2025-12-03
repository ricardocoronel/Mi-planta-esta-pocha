import { PlantAnalysisResult } from "../types";

export const analyzeWithMock = async (
  imageFile: File,
  additionalContext?: string
): Promise<PlantAnalysisResult> => {
  console.warn("⚠️ MODO DEMO ACTIVADO: No se encontraron API Keys. Usando respuesta simulada.");

  // Simular tiempo de espera de red (2 segundos)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    markdownText: `
### ⚠️ Modo Demostración
**Nota:** Estás viendo este resultado porque no se configuraron las API Keys (OpenAI/Gemini). La aplicación está funcionando en modo de prueba.

### Identificación de la planta
- Nombre común: Monstera Deliciosa (Costilla de Adán)
- Nombre científico: *Monstera deliciosa*
- Tipo de planta: Trepadora tropical de interior
- Grado de seguridad en la identificación: alto (Simulado)

### Diagnóstico de salud
- Estado general: sana
- Síntomas observados:
  - Hojas verdes y brillantes.
  - Fenestraciones (agujeros) bien formados.
  - Turgencia correcta en los tallos.
- Posibles causas:
  - Cuidados adecuados de luz y riego.

### Qué le está ocurriendo (explicación sencilla)
Tu planta se ve espectacular. Las hojas están erguidas y tienen ese color verde intenso que indica buena salud. Los agujeros característicos de la Monstera demuestran que está recibiendo suficiente luz para desarrollarse correctamente.

### Cuidados recomendados
- Riego: Regar cuando el sustrato esté seco en los primeros 3-5 cm. Evita encharcar.
- Luz: Luz indirecta brillante. Tolera algo de sombra, pero crece menos.
- Sustrato y maceta: Tierra con buen drenaje (mezcla con perlita).
- Temperatura y humedad: Le gusta la humedad ambiental. Rocía sus hojas ocasionalmente.
- Otras recomendaciones: Limpia el polvo de las hojas con un paño húmedo para que respire mejor.

### Plan de acción paso a paso
1. Continúa con tu rutina actual de riego, verificando siempre la tierra antes de echar agua.
2. Gira la maceta cada 15 días para que crezca de forma uniforme hacia la luz.
3. Si ves raíces aéreas muy largas, puedes dirigirlas hacia la tierra.

### Nota final
¡Sigue así! Tienes una planta de revista 🌿.
    `.trim(),
    healthScore: 95,
    confidence: 'high',
    identifiedName: "Monstera Deliciosa (Demo)"
  };
};