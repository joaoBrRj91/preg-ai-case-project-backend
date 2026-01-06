const schemaSermonOptimizationV1 = `
Formato OBRIGATÓRIO (schema otimização v1):

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

DESCRIÇÃO DOS CAMPOS:
- title: Título do sermão otimizado com prefixo "Sermão Otimizado: "
- improvements: Array com 6 itens descrevendo as melhorias realizadas
- content: Conteúdo completo e otimizado do sermão em formato narrativo
- statisticsOriginalContent: Estatísticas do conteúdo original extraído
- statisticsOptimizateContent: Estatísticas do sermão após otimização
`;

export { schemaSermonOptimizationV1 };
