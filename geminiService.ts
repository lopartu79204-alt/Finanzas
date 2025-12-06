import { GoogleGenAI } from "@google/genai";
import { Transaction, Debt, SavingsGoal } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  query: string,
  context: {
    transactions: Transaction[];
    debts: Debt[];
    goals: SavingsGoal[];
    income: number;
  }
): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key no configurada. Por favor configura process.env.API_KEY.";
  }

  // Create a summarized context string
  const expenses = context.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const debtTotal = context.debts.reduce((sum, d) => sum + d.totalAmount, 0);
  
  const systemPrompt = `
    Eres un experto asesor financiero mexicano con 20 años de experiencia.
    Tu objetivo es ayudar a familias mexicanas a mejorar su salud financiera.
    
    Contexto del usuario:
    - Ingreso Mensual: $${context.income} MXN
    - Gastos recientes (suma): $${expenses} MXN
    - Deuda Total: $${debtTotal} MXN
    - Metas activas: ${context.goals.map(g => g.name).join(', ')}

    Instrucciones:
    1. Responde de manera empática, profesional pero accesible.
    2. Utiliza terminología local (pesos, referencias a CETES, Afores, Infonavit si aplica).
    3. Sé conciso y da pasos accionables.
    4. Si el usuario pregunta sobre deudas, sugiere el método "Bola de Nieve" o "Avalancha".
    5. Si pregunta sobre autos, considera el costo de mantenimiento, seguro y gasolina en México.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Contexto Financiero: ${JSON.stringify(context)}` }] },
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, no pude generar un consejo en este momento.";
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Hubo un error al conectar con tu asesor financiero IA. Intenta más tarde.";
  }
};
