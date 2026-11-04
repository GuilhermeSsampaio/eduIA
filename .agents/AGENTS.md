# Regras de Refatoração e Boas Práticas

Ao atuar neste projeto, aplique SEMPRE as seguintes diretrizes ao receber solicitações de refatoração ou criação de novo código:

## 1. Segurança e Integridade Invioláveis
- **Manutenção de Fluxos:** Refatorações são exclusivamente para melhoria estrutural. Você **NÃO DEVE** alterar a lógica de negócios base, os retornos de endpoints (API) ou o aspecto visual final (UI) da aplicação, a menos que o usuário solicite explicitamente uma alteração funcional.
- **Prevenção de Inconsistências:** Antes de mover ou quebrar componentes/serviços, certifique-se de que todas as assinaturas (parâmetros, retornos e props) permanecem rigorosamente compatíveis.

## 2. Boas Práticas - Backend e Serviços (Node.js / APIs)
- **SRP e DRY:** Evite a criação ou manutenção de "God Objects" (como arquivos e serviços acima de 500/1000 linhas). Quebre as responsabilidades.
- **Desacoplamento:** 
  - Utilize padrões de eventos ou filas para processos paralelos assíncronos.
  - Centralize códigos transversais de log e auditoria utilizando middlewares, interceptors ou funções estáticas em vez de poluir a regra de negócio com dezenas de `console.log` e blocos de `try/catch` para logging.
- **Isolamento Útil:** Métodos genéricos (como tratamento de datas e manipulação de arrays independentes de injeção de dependência) devem ser transferidos para uma pasta de utilitários (`utils/`).

## 3. Boas Práticas - Frontend (React / Vite / Componentes)
- **Combate aos Fat Components:** Telas (pages) e componentes visuais complexos devem ter sua complexidade dividida.
- **Telas como Orquestradoras:** As telas devem preferencialmente coordenar e importar formulários, modais, steps e fragmentos menores, em vez de implementar toda a marcação e regras locais no mesmo arquivo.
- **Isolamento Lógico:**
  - Lógicas complexas de formulários, paginação, fluxo de passos e filtragem devem ser extraídas para **Custom Hooks** (`usePagination`, `useQuizPhase`, `useFilters`).
  - As chamadas de dados e regras de negócio devem ficar na camada apropriada (`services/`, `contexts/` ou React Query), removendo lógicas verbosas de Loading/Error da árvore direta de componentes.

## 4. Edição de Código
- **Edição Direta:** Nunca utilize scripts auxiliares (como bash, python, nodejs, etc.) para aplicar alterações no código. As edições devem ser feitas e aplicadas DIRETAMENTE nos arquivos-alvo através das suas ferramentas de edição nativas.
