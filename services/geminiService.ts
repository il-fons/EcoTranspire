import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Sei un esperto botanico e idrologo specializzato in fisiologia vegetale ed evapotraspirazione.
Il tuo compito è spiegare concetti complessi in modo semplice, accurato e coinvolgente per un pubblico italiano.
Rispondi alle domande degli utenti riguardanti:
- Il ciclo dell'acqua nelle piante.
- Come calcolare o stimare l'evapotraspirazione (ET).
- Consigli sull'irrigazione basati su condizioni meteo.
- Fattori che influenzano la perdita d'acqua (temperatura, umidità, vento).

Usa un tono amichevole ma scientifico. Usa formattazione Markdown per elenchi o enfasi.
Se la domanda non riguarda le piante o l'acqua, riconduci gentilmente l'argomento al tema principale.
`;

export const askGeminiBotanist = async (question: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Errore: Chiave API non configurata. Assicurati di avere accesso.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Non sono riuscito a generare una risposta. Riprova più tardi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Si è verificato un errore durante la consultazione dell'esperto AI. Riprova tra poco.";
  }
};