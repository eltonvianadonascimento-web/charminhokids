
import { GoogleGenAI } from "@google/genai";

export const professionalizeQuoteIntro = async (clientName: string, itemsCount: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma breve introdução profissional e elegante de no máximo 3 frases para um pedido enviado ao cliente ${clientName}. O pedido contém ${itemsCount} itens. Use um tom cordial e focado em qualidade de serviço.`
    });
    return response.text || "Prezado cliente, segue abaixo o detalhamento do pedido solicitado.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Prezado cliente, segue abaixo o detalhamento do pedido solicitado conforme conversamos.";
  }
};
