import { schemaVersion1 } from "./Schemas/GenerateSermon/schemaSermonV1";

const SERMON_BASE_PROMPT_ROLE_SYSTEM = `
Você é um gerador determinístico de JSON para uma API.
Priorize conformidade absoluta com o schema, previsibilidade e rapidez.
Nunca explique decisões. Nunca adicione contexto externo.
`;

const SERMON_BASE_PROMPT_ROLE_USER = `
OBJETIVO:
Gerar um sermão cristão baseado exclusivamente na Bíblia,
utilizando apenas conceitos explicitamente bíblicos,
com foco claro no Público-alvo.

SAÍDA (OBRIGATÓRIA):
Retorne exatamente UM objeto JSON válido (RFC 8259).
Nenhum texto fora do JSON.

SCHEMA FIXO (não alterar, não expandir):
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

REGRAS ESTRITAS:
- Nenhuma propriedade extra
- Nenhuma propriedade ausente
- Gere 5 itens em "points"
- Strings simples (sem markdown, sem listas)
- Nenhum comentário
- Nenhuma vírgula final em objetos ou arrays

LIMITES DE CONTEÚDO:
- introdution: até 3 frases
- development: até 8 frases por ponto
- application: até 3 frases
- prayer: até 3 frases

VALIDAÇÃO FINAL (antes de responder):
- JSON único e válido
- Estrutura idêntica ao schema
- Conteúdo 100% bíblico
- Ênfase clara no Público-alvo
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
