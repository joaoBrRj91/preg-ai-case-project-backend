import { schemaVersion1 } from "./Schemas/GenerateSermon/schemaSermonV1";
import { schemaSermonOptimizationV1 } from "./Schemas/OptmizateSermon/schemaSermonOptimizationV1";

const SERMON_BASE_PROMPT_ROLE_SYSTEM = `
Você é um gerador determinístico de JSON para uma API.
Priorize conformidade absoluta com o schema, previsibilidade e rapidez.
Nunca explique decisões. Nunca adicione contexto externo.
`;

const SERMON_BASE_PROMPT_ROLE_USER = `
Gere um sermão cristão JSON com conteúdo 100% bíblico para o público-alvo especificado.

RETORNE APENAS JSON VÁLIDO (RFC 8259) - SEM TEXTO EXTRA

{
  "title": string,
  "introdution": string,
  "points": [{point, verse, development}],
  "application": string,
  "prayer": string
}

REQUISITOS:
- Exatamente 6 pontos em "points"
- introdution ≤ 1000 palavras
- development ≤ 200 palavras/ponto
- application ≤ 400 palavras
- prayer ≤ 250 palavras
- Sem propriedades extras
- Sem markdown/listas em strings
- Sem vírgulas finais em objetos/arrays
`;

type ContentToLLM = (
  title: string,
  style: string,
  targetAudience: string,
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

const SERMON_OPTIMIZATION_PROMPT_ROLE_SYSTEM = `
Você é um otimizador determinístico de sermões cristãos para JSON.
Priorize conformidade absoluta com o schema, coerência bíblica e qualidade de saída.
Nunca explique decisões. Retorne apenas JSON válido.
`;

const SERMON_OPTIMIZATION_PROMPT_ROLE_USER = `
OBJETIVO:
Otimizar e melhorar um sermão cristão extraído de um arquivo,
mantendo bases bíblicas sólidas e aumentando o impacto para o Público-alvo.

SAÍDA (OBRIGATÓRIA):
Retorne exatamente UM objeto JSON válido (RFC 8259).
Nenhum texto fora do JSON.

SCHEMA FIXO (não alterar, não expandir):
{
  "title": string,
  "improvements": string[],
  "content": string,
  "statisticsOriginalContent": {
    "words": string,
    "points": string,
    "verses": string,
    "minutes": string
  },
  "statisticsOptimizateContent": {
    "words": string,
    "points": string,
    "verses": string,
    "minutes": string
  }
}

REGRAS ESTRITAS:
- Nenhuma propriedade extra
- Nenhuma propriedade ausente
- improvements: exatamente 6 itens (strings descritivas)
- content: até 1000 palavras, narrativo e fluido
- statistics: valores como strings numéricas ("245", "3", "4", "12-15")

CÁLCULO DE ESTATÍSTICAS:

STATISTICSORIGINALCONTENT (do conteúdo extraído):
- words: Contagem exata de palavras no texto original
- points: Número de pontos/seções principais identificados no conteúdo
- verses: Número total de versículos bíblicos mencionados
- minutes: Tempo estimado de leitura em voz alta (calcule: total de palavras / 130 palavras por minuto)

STATISTICSOPTIMIZATECONTENT (do conteúdo otimizado):
- words: Contagem exata de palavras no texto otimizado (máximo 1000 palavras)
- points: Número de pontos/seções principais após otimização (mínimo 5, máximo 8)
- verses: Número total de versículos após otimização (deve aumentar em relação ao original, mínimo 200 citações)
- minutes: Tempo estimado após otimização (calcule: total de palavras otimizadas / 130 palavras por minuto)

EXEMPLO DE CÁLCULO:
- Conteúdo original com 1500 palavras, 3 versículos, 3 pontos = 11-12 minutos
- Conteúdo otimizado com 900 palavras, 5 versículos, 6 pontos = 6-7 minutos

MELHORIAS A REALIZAR:
1. Reorganizar estrutura para maior clareza lógica
2. Aprimorar transições entre os pontos principais
3. Adaptar linguagem para o público-alvo especificado
4. Adicionar ou refinar ilustrações/exemplos relevantes
5. Fortalecer aplicação prática e impacto emocional
6. Criar conclusão mais impactante e memorável

VALIDAÇÃO FINAL (antes de responder):
- JSON único e válido
- Estrutura idêntica ao schema
- Conteúdo bíblico aprofundado
- Improvements refletem otimizações reais
- Estatísticas calculadas corretamente e coerentes
- Versículos no conteúdo otimizado devem estar entre as melhorias
`;

type ContentOptimizationToLLM = (
  sermonContent: string,
  targetAudience?: string,
) => string;

const generateOptimizationPrompt: ContentOptimizationToLLM = (
  sermonContent,
  targetAudience = "Geral",
) => {
  return `
${SERMON_OPTIMIZATION_PROMPT_ROLE_SYSTEM}
${SERMON_OPTIMIZATION_PROMPT_ROLE_USER}

CONTEÚDO DO SERMÃO A OTIMIZAR:
\`\`\`
${sermonContent}
\`\`\`

Público-alvo: ${targetAudience}
Formato de resposta obrigatório: ${schemaSermonOptimizationV1}
`;
};

export default generateContentToLLM;
export { generateOptimizationPrompt };
