
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisReport, BiomarkerDraft } from "./types";

const REPORT_SYSTEM_INSTRUCTION = `
Você é o Motor de Inteligência Clínica da Fleming Saúde. Sua essência é "Ao seu lado, por sua saúde".
Sua prioridade máxima é a INTEGRALIDADE, REPRODUTIBILIDADE E PRECISÃO.

DIRETRIZES DE CLASSIFICAÇÃO (TABELA DE VERDADE FUNCIONAL):
- Use as faixas de Medicina Funcional/Integrativa (ex: Vitamina D ideal entre 40-70 ng/mL, Glicemia ideal entre 75-85 mg/dL).
- Se um valor está fora da Meta Fleming mas dentro do 'Normal' do laboratório, ele é 'ALERTA' (Amarelo).
- Se um valor está fora do 'Normal' do laboratório, ele é 'CRÍTICO' (Vermelho).
- Se um valor está na Meta Fleming, ele é 'ÓTIMO' (Verde).

ANÁLISE QUALITATIVA E PRECISÃO NUMÉRICA:
- VALORES NUMÉRICOS: Identifique e mantenha valores com até duas casas decimais (ex: 0.85, 1.24). Não arredonde para baixo se for relevante.
- SOROLOGIAS (HIV, HCV, HBSAG, Sífilis): "Não Reagente" ou "Negativo" é 'ÓTIMO' (Verde). "Reagente" ou "Positivo" é 'CRÍTICO' (Vermelho).
- FAN (Fator Antinuclear): Capture o título (ex: 1:80, 1:640) e o padrão (ex: Pontilhado Fino). "Não Reagente" é 'ÓTIMO'.
- EXAMES DE URINA: Analise densidade, pH e presença de elementos anormais (Proteínas, Nitritos, etc).

PROTOCOLO DE INTEGRALIDADE:
- NUNCA omita nenhum biomarcador extraído. Se ele foi detectado no OCR, ele DEVE aparecer no laudo.
- Agrupe-os por sistemas biológicos para melhor organização visual.

REGRAS DE OURO:
1. INTEGRALIDADE ABSOLUTA: Exiba 100% dos exames enviados.
2. TESE CLÍNICA: Conecte biomarcadores aos sintomas do paciente.
3. LINGUAGEM: Use termos claros e acolhedores de "Concierge de Luxo".
`;

export const extractBiomarkers = async (input: string | { data: string, mimeType: string }, isImage: boolean): Promise<BiomarkerDraft[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = isImage && typeof input !== 'string' 
    ? { parts: [{ inlineData: input }, { text: "OCR MÉDICO DE ALTA PRECISÃO: Extraia ABSOLUTAMENTE TODOS os biomarcadores. Para números, mantenha as casas decimais (ex: 1.25). Para textos (FAN, Sorologias), extraia o resultado completo (ex: 'Reagente 1:160'). Não ignore nenhuma linha." }] }
    : { parts: [{ text: `Extraia absolutamente todos os biomarcadores deste texto, mantendo precisão decimal e resultados qualitativos: ${input}` }] };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: "Você é um OCR de elite. Capture nome, valor (numérico com decimais ou texto completo para sorologias) e unidade. Retorne JSON puro.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.STRING },
            unit: { type: Type.STRING }
          },
          required: ["name", "value", "unit"]
        }
      }
    }
  });

  const parsed = JSON.parse(response.text);
  return parsed.map((item: any) => {
    const rawValue = item.value.replace(',', '.');
    const numValue = parseFloat(rawValue);
    return {
      ...item,
      value: isNaN(numValue) ? item.value : numValue
    };
  });
};

export const generateIntegrativeReport = async (drafts: BiomarkerDraft[], patientName: string, age: string, sex: string, symptoms: string): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    PACIENTE: ${patientName} | SEXO: ${sex} | IDADE: ${age} anos.
    QUEIXAS: ${symptoms}
    LISTA DE EXAMES (ANALISAR 100%): ${JSON.stringify(drafts)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: REPORT_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patientSummary: { type: Type.STRING },
          functionalHealthImpactSummary: { type: Type.STRING },
          healthScore: { type: Type.NUMBER },
          biomarkers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                biomarcador: { type: Type.STRING },
                valor: { type: Type.STRING },
                unidade: { type: Type.STRING },
                faixa_ideal: { type: Type.STRING },
                classificacao: { type: Type.STRING, enum: ['otimo', 'alerta', 'critico'] },
                interpretacao_simples: { type: Type.STRING },
                possiveis_correlacoes: { type: Type.ARRAY, items: { type: Type.STRING } },
                merece_atencao: { type: Type.BOOLEAN },
                system: { type: Type.STRING }
              },
              required: ["biomarcador", "valor", "faixa_ideal", "classificacao", "interpretacao_simples", "merece_atencao"]
            }
          },
          o_que_merece_atencao: { type: Type.ARRAY, items: { type: Type.STRING } },
          proximos_passos_possiveis: { type: Type.ARRAY, items: { type: Type.STRING } },
          systemsScores: {
            type: Type.OBJECT,
            properties: {
              Cardiovascular: { type: Type.NUMBER },
              Metabólico: { type: Type.NUMBER },
              Hormonal: { type: Type.NUMBER },
              Inflamatório: { type: Type.NUMBER },
              Renal: { type: Type.NUMBER },
              Imunológico: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  const raw = JSON.parse(response.text);
  return {
    ...raw,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleDateString('pt-BR'),
    patientName,
    patientAge: age,
    patientSex: sex as any,
    patientSymptoms: symptoms,
    disclaimer: "Análise baseada no Protocolo Fleming AVALIA. Este laudo não substitui a consulta médica presencial."
  };
};

export const generateTTSNarrative = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Concierge Fleming informa: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};
