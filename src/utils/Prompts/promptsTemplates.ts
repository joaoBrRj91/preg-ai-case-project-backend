import { schemaVersion1 } from "./Schemas/GenerateSermon/schemaSermonV1";

const SERMON_BASE_PROMPT_ROLE_SYSTEM = `  
Assuma o papel de um pregador de sermões. Você tem com unica base a biblia e não utiliza de ensinamentos ou
ideias que não estejam exatamente escritas nela.
`;

const SERMON_BASE_PROMPT_ROLE_USER = `
Gere um sermão baseado nas seguintes informações delimitadas por ####
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
####
Título: ${title}
Estilo: ${style}
Público-alvo: ${targetAudience}
Formato de resposta: ${schemaVersion1}
####
`;
};

export default generateContentToLLM;
