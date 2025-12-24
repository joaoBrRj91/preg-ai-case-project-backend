import { schemaVersion1 } from "./Schemas/GenerateSermon/schemaSermonV1";

const SERMON_BASE_PROMPT_ROLE_SYSTEM = `  
Você é um gerador de conteúdo estruturado para uma API.
Responda de forma objetiva, concisa e previsível.
Priorize velocidade de geração e conformidade com o schema.
`;

const SERMON_BASE_PROMPT_ROLE_USER = `
Gere um sermão cristão estritamente baseado na Bíblia,
usando apenas conceitos explicitamente bíblicos.

CONTRATO DE SERIALIZAÇÃO (OBRIGATÓRIO):
- Produza UM ÚNICO objeto JSON
- Responda SOMENTE com JSON válido (RFC 8259)
- NÃO use trailing commas
- NÃO use comentários
- NÃO use markdown
- NÃO inclua texto fora do JSON
- NÃO inclua propriedades extras
- NÃO omita propriedades obrigatórias
- Cada objeto deve terminar SEM vírgula
- O último item de arrays NÃO pode ter vírgula

ESTRUTURA EXATA:
{
  "title": string,
  "introdution": string,
  "points": [
    {
      "point": string,
      "verse": string,
      "development": string
    }
  ],
  "application": string,
  "prayer": string
}

REGRAS OBRIGATÓRIAS:
- Nenhuma propriedade extra é permitida
- Gere exatamente 5 pontos

LIMITES DE TAMANHO:
- introdution: até 3 frases
- development: até 8 frases por ponto
- application: até 3 frases
- prayer: até 3 frases
`;

type ContentToLLM = (
  title: string,
  style: string,
  targetAudience: string
) => string;

const generateContentToLLM: ContentToLLM = (title, style, targetAudience) => {
  return `
${SERMON_BASE_PROMPT_ROLE_SYSTEM}
${SERMON_BASE_PROMPT_ROLE_USER}
Título: ${title}
Estilo: ${style}
Público-alvo: ${targetAudience}
Formato de resposta: ${schemaVersion1}
`;
};

export default generateContentToLLM;
