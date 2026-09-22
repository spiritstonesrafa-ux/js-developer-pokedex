# Documentação da Fase 5 — Homologação Final, Acessibilidade, Responsividade e Performance do Mapa da Campanha

## 1. Objetivo da Fase 5

A **Fase 5** consolida o **Mapa de Campanha** como uma funcionalidade pronta para produção, auditando e homologando seu comportamento real nos seguintes eixos fundamentais:

1. **Acessibilidade**: navegação por teclado, leitor de tela (WAI-ARIA), foco previsível e visível, contenção no drawer e respeito a movimento reduzido.
2. **Responsividade**: fidelidade visual e funcional em resoluções canônicas de 320×568 até 1920×1080 com redimensionamento de viewport real, sem overflow horizontal da página.
3. **Paridade Funcional Individual**: correspondência estrita nó a nó entre Mapa e Lista quanto a identidade, disponibilidade, bloqueios, desativação acessível e payloads de desafio.
4. **Performance e Assets Reais em Disco**: validação das métricas exatas em bytes e KiB dos fundos WebP (<= 140 KiB por fundo, <= 560 KiB total), carregamento sob demanda e ausência de layout shift.
5. **Hardening de RAF e Timers**: cancelamento real de timeout de fallback, suporte a IDs numéricos iguais a `0` e descarte limpo no `destroy()`.
6. **Comportamento Autêntico do Estado 100% Concluído**: garantia de que `CampaignView` desmonta o mapa e exibe `renderComplete()`, mantendo o escopo pós-campanha restrito sem promessas de revanches em produção.
7. **Preservação Integral**: integridade de saves `VERSION = 1`, Battle Engine, progressão dos 18 Mestres e ausência de novas dependências.

---

## 2. Baseline e Estado do Repositório

- **Checkpoint Original HEAD**: `567854d feat(campaign): aprimora ciclo de vida e transições do mapa`
- **Arquivos com alterações em trabalho**:
  - `assets/css/campaign-map.css`
  - `assets/js/campaign/campaign-map-view.js`
  - `tests/campaign/campaign-map.test.js`
  - `tests/visual/campaign-map-harness.html`
  - `docs/CAMPAIGN_MAP_PHASE_5.md`
- **Preservação de Trabalho**: Nenhum reset, checkout destrutivo ou perda de código de produção.
- **Formatação Git**: `git diff --check` concluído com código zero.

---

## 3. Problemas Reproduzidos e Auditoria Independente

Durante a auditoria independente da Fase 5, foram identificados 4 apontamentos fundamentais:

### 3.1. Simulador de Resoluções do Harness vs. Viewport Real
- **Problema**: Os controles de resolução anteriores alteravam somente o `max-width` de `.preview-container` através de classes como `.device-320`, `.device-375`, etc. Isso não alterava o viewport CSS real (`window.innerWidth`) e, portanto, não disparava media queries como `@media (max-width: 640px)`. Selecionar "320px" num navegador desktop mantinha o viewport amplo, não ativando o bottom sheet nem o scroll hint por media query nativa.
- **Correção Aplicada**:
  1. Controles renomeados para "Largura Contêiner" (`320px`, `375px`, `768px`, etc.) para deixar explícito que afetam apenas o contêiner de inspeção isolada.
  2. Adicionado aviso permanente visível no harness (`.harness-viewport-warning`) informando que largura de contêiner não equivale a viewport CSS e que media queries dependem de `window.matchMedia('(max-width: 640px)')`.
  3. Painel de diagnóstico em tempo real (`#diagnosticsBar`) atualizado para exibir: `Viewport Real (window.innerWidth × window.innerHeight)`, `Largura Contêiner`, `Media Query Mobile (<=640px): true/false`, e `Modo Esperado Drawer: BOTTOM_SHEET ou LATERAL`.
  4. Atualização dinâmica dos diagnósticos acoplada a evento de `resize`.

### 3.2. Documentação e Integração do Estado 100% Concluído
- **Problema**: A documentação anterior afirmava que no estado "100% Concluído" o mapa permanecia montado com todos os nós contendo CTAs de "Revanche". No código real de integração ([campaign-view.js](../assets/js/campaign/campaign-view.js)), `d.status === 'COMPLETED'` chama imediatamente `this.mapView.destroy()` e invoca `this.renderComplete()`, exibindo a tela de Campeão / True Ending com opção única de reset da campanha.
- **Correção Aplicada**:
  1. Documentação corrigida: informado o comportamento autêntico de `renderComplete()`.
  2. Esclarecido que a visualização de mapa 100% no harness é apenas um preset de inspeção isolada de nós, não representando a tela apresentada pela integração de produção.
  3. Reafirmado que "Explorar mapa após a campanha" permanece formalmente fora do escopo.
  4. Adicionado teste de integração automatizado (Teste 8) comprovando que `COMPLETED` destrói `mapView`, não renderiza o shell do mapa e disponibiliza o botão de reset.

### 3.3. Métricas dos WebP em Disco (Bytes e KiB)
- **Problema**: Os valores documentados anteriormente continham aproximações decimais imprecisas que não correspondiam aos tamanhos exatos dos arquivos WebP presentes em `assets/images/campaign/`.
- **Correção Aplicada**: Levantamento exato dos tamanhos em bytes e conversão binária rigorosa em KiB (bytes ÷ 1024), comprovados via `fs.statSync` no Teste 9.

### 3.4. Eliminação de Falsos Positivos nos Testes Automatizados
- **Problema**:
  - Teste de acessibilidade (Teste 6) verificava substrings no HTML concatenado de forma independente, o que passava mesmo que o atributo pertencesse a outro elemento.
  - Teste de paridade (Teste 7):
    - O cenário anterior de Shadow tentava validar a revelação apenas vencendo a batalha do Super Trainer, parando no estado `SUPER_REWARD_PENDING` sem executar o reconhecimento de vitória e reivindicação da recompensa de elite, o que deixava o Shadow oculto.
    - O cenário anterior "Endgame Trancado - 0 Insígnias" presumia testar provas bloqueadas renderizadas. Contudo, pelo contrato de [campaign-map-model.js](../assets/js/campaign/campaign-map-model.js), solicitar `region-endgame` com menos de 18 insígnias redireciona a região ativa para `region-1`, repetindo silenciosamente o teste da Região 1 sem validar nós do endgame.
- **Correção Aplicada**:
  - Teste 6 refatorado com helper `parseTabButton(tabId)` que extrai o elemento `<button>` exato e valida atomicamente `role="tab"`, `id`, `data-region-id`, `aria-selected`, `aria-disabled`, `aria-controls` e `tabindex` no mesmo nó.
  - Teste 7 focado em 4 estados ativos distintos e canônicos:
    1. Região 1 — Mestre disponível;
    2. Região 1 — Mestre derrotado / revanche;
    3. Região Final com 18 insígnias — Provas e Super disponíveis, Shadow comprovadamente oculto;
    4. Região Final com Shadow revelado — executa o fluxo canônico completo (`recordBattle(SUPER)`, `acknowledgeSuperVictory()`, `claimReward(elite.id)`, `acknowledgeShadowReveal()`), confirmando `shadowTrainer.revealed === true`, presença do nó no Mapa, card e botão habilitado na Lista, e validação do payload exato `{ kind: 'SHADOW', id: null }` em ambos os modos.
  - Criado o Teste 10 dedicado ao comportamento real de bloqueio e fallback da Região Final: comprova que com 0 insígnias a solicitação de `region-endgame` redireciona para `region-1`, nós exclusivos do endgame não são renderizados, a aba final permanece com `aria-disabled="true"`, `data-is-locked="true"`, `tabindex="-1"`, `tabpanel` permanece atrelado a `region-1`, e a tentativa de clique é rejeitada sem abrir drawer, sem disparar desafio e emitindo anúncio sonoro acessível.

---

## 4. Hardening de RAF e Limpeza de Timers Preservados

Todo o hardening de RAF previamente validado e aprovado permanece intacto em [campaign-map-view.js](../assets/js/campaign/campaign-map-view.js):

- `this._fallbackRafTimeoutIds = new Set()` mantido para rastreamento de timeouts usados em fallback de RAF.
- Cancelamento real do temporizador via `clearTimeout(rafId)` dentro de `_clearRaf()`.
- Tratamento explícito de identificadores iguais a zero (`0`) com verificações `id !== null && id !== undefined`.
- Limpeza total e imediata em `destroy()` e `_clearAllPendingWork()`.
- Cancelamento de callbacks de animação e foco pendentes caso o usuário execute ações rápidas concorrentes.

---

## 5. Matriz de Acessibilidade (Inspeção Atômica)

| Elemento / Critério | Requisitos Verificados Concorrentemente | Validação no Teste Automatizado | Status |
| :--- | :--- | :--- | :---: |
| **Aba Ativa (Região 1)** | `role="tab"`, `aria-selected="true"`, `tabindex="0"`, `aria-controls="campaign-map-region-panel"` | Validado no mesmo elemento `<button>` via Teste 6 | **CONFORME** |
| **Abas Inativas (Regiões 2 e 3)** | `role="tab"`, `aria-selected="false"`, `tabindex="-1"`, `aria-disabled="false"` | Validado no mesmo elemento `<button>` via Teste 6 | **CONFORME** |
| **Aba Bloqueada (Região Final)** | `role="tab"`, `aria-selected="false"`, `tabindex="-1"`, `aria-disabled="true"`, `data-is-locked="true"` | Validado no mesmo elemento `<button>` via Testes 6 e 10 | **CONFORME** |
| **Painel de Região** | `id="campaign-map-region-panel"`, `role="tabpanel"`, `aria-labelledby="tab-{activeRegionId}"` | Validado no painel único montado | **CONFORME** |
| **Live Region** | `id="mapAriaLive"`, `role="status"`, `aria-live="polite"`, `aria-atomic="true"` | Anúncios assíncronos de troca de aba e bloqueio validados | **CONFORME** |
| **Nós Interativos** | `<button type="button">`, `aria-label` completo descrevendo tipo, líder, status | Inspecionado nó a nó no mapa | **CONFORME** |
| **Nós Ocultos** | Não renderizados no DOM enquanto `isHidden === true` (Shadow Trainer) | Ausência de nós e rotas ocultas confirmada antes da revelação | **CONFORME** |
| **Drawer Acessível** | `role="dialog"`, `aria-modal="true"`, contenção de foco com loop de `Tab` | Testado em Teste 6 e harness visual | **CONFORME** |
| **Movimento Reduzido** | `prefers-reduced-motion: reduce` suprime delays e transições artificiais | Testes Fase 4 (15 e F) preservados | **CONFORME** |

---

## 6. Matriz de Viewports e Responsividade (Evidência Real de Redimensionamento)

Auditoria realizada por ferramenta de navegador automatizada conectada ao harness local (`http://127.0.0.1:8085/tests/visual/campaign-map-harness.html`), redimensionando a janela do browser para as 6 resoluções canônicas:

| Resolução Alvo | Viewport Real Medido (`window.innerWidth × innerHeight`) | `matchMedia('(max-width: 640px)')` | Overflow Horizontal na Página | Overflow Interno no Mapa | Modo do Drawer | Botão Fechar Alcançável | Erros no Console |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **320×568** | 500×475 px *(limite mín. janela SO)* | `true` (ativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ✅ Sim (scroll intencional ↔) | **BOTTOM_SHEET** | ✅ Sim (`.details-close-btn`) | 0 |
| **375×667** | 500×574 px *(limite mín. janela SO)* | `true` (ativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ✅ Sim (scroll intencional ↔) | **BOTTOM_SHEET** | ✅ Sim (`.details-close-btn`) | 0 |
| **768×1024** | 755×931 px | `false` (inativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ❌ Não (enquadrado) | **LATERAL** | ✅ Sim (`#detailsCloseBtn`) | 0 |
| **1024×768** | 1011×675 px | `false` (inativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ❌ Não (enquadrado) | **LATERAL** | ✅ Sim (`#detailsCloseBtn`) | 0 |
| **1366×768** | 1353×675 px | `false` (inativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ❌ Não (enquadrado) | **LATERAL** | ✅ Sim (`#detailsCloseBtn`) | 0 |
| **1920×1080** | 1920×953 px | `false` (inativo) | ❌ Nenhum (`scrollWidth == innerWidth`) | ❌ Não (enquadrado) | **LATERAL** | ✅ Sim (`#detailsCloseBtn`) | 0 |

> [!NOTE]
> **Ressalva de Limitação de SO**: Em ambiente Windows desktop, o gerenciador de janelas do sistema operacional restringe a largura física mínima de uma janela de navegador a ~500 px. Como 500 px situa-se estritamente abaixo do breakpoint mobile de 640 px (`matchMedia('(max-width: 640px)').matches === true`), a media query foi comprovadamente ativada em execução real, renderizando o Bottom Sheet com scroll hint e sem overflow da página.

---

## 7. Matriz dos Estados de Campanha e Integração de Produção

| Estado de Campanha | Região Inicial | Acesso às Regiões Principais | Acesso à Região Final | Comportamento em Produção (`CampaignView`) | Comportamento no Harness |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **0 Insígnias (Início)** | Região 1 | Livre (Regiões 1, 2 e 3) | Bloqueada (0/18). Solicitar `region-endgame` redireciona para `region-1`. | Mapa montado; Mestres disponíveis na Região 1. Provas do endgame não são renderizadas. | Preset de início |
| **6 Insígnias (Região 1)** | Região 1 | Livre | Bloqueada (6/18) | Mestres derrotados com check; revanche disponível | Preset intermediário |
| **12 Insígnias** | Região 2 | Livre | Bloqueada (12/18) | Indicador visual de próximo desafio recomendado | Preset intermediário |
| **17 Insígnias** | Região 3 | Livre | Bloqueada (17/18) | Rotas convergem para o 18º Mestre; Região Final trancada | Preset pré-endgame |
| **18 Insígnias** | Região Final | Livre | **Desbloqueada** | Provas e Super Treinador disponíveis; Shadow comprovadamente oculto | Preset Super Treinador |
| **Shadow Revelado** | Região Final | Livre | Desbloqueada | Super derrotado + vitória reconhecida + recompensa reivindicada + reveal reconhecido (`shadowTrainer.revealed === true`). Nó exibido no Mapa e na Lista, desafio ativo com payload `{ kind: 'SHADOW', id: null }`. | Preset Desafio Final |
| **100% Concluído (`COMPLETED`)** | - | - | - | **O mapa é destruído (`mapView.destroy()`); tela `renderComplete()` (Campeão do Circuito / True Ending) exibida com ação exclusiva de reset da campanha. Nenhuma revanche pós-campanha é ofertada.** | Preset `100% — inspeção isolada do mapa` (apenas ferramenta de depuração de nós; exibe aviso explícito de que não representa a tela de produção). |
| **Recompensa Pendente** | - | - | - | Mapa desmontado; tela `renderReward()` priorizada | Testado em integração |
| **Saída da Aba** | - | - | - | `deactivate()` remove listeners e fecha drawers sem vazar foco | Testado em integração |

---

## 8. Métricas Reais dos Fundos de Cenário (WebP)

Métricas auditadas diretamente do sistema de arquivos via `fs.statSync` no arquivo [assets/images/campaign/](../assets/images/campaign/):

| Arquivo WebP | Região Correspondente | Dimensões | Proporção | Tamanho Exato em Bytes | Tamanho em KiB (÷ 1024) | Orçamento Máximo por Fundo | Status |
| :--- | :--- | :---: | :---: | ---:| ---:| :---: | :---: |
| `region-1-vales.webp` | Região 1 (Costas & Planícies) | 1280×720 px | 16:9 | 134.778 bytes | 131,62 KiB | 140 KiB (143.360 bytes) | **CONFORME** |
| `region-2-fendas.webp` | Região 2 (Picos & Fendas) | 1280×720 px | 16:9 | 133.436 bytes | 130,31 KiB | 140 KiB (143.360 bytes) | **CONFORME** |
| `region-3-arcanas.webp` | Região 3 (Domínios Arcanos) | 1280×720 px | 16:9 | 134.350 bytes | 131,20 KiB | 140 KiB (143.360 bytes) | **CONFORME** |
| `region-endgame.webp` | Região Final (Pináculo) | 1280×720 px | 16:9 | 133.408 bytes | 130,28 KiB | 140 KiB (143.360 bytes) | **CONFORME** |
| **Total Combinado** | **4 Cenários** | - | - | **535.972 bytes** | **523,41 KiB** | **560 KiB (573.440 bytes)** | **CONFORME** |

- Todos os 4 fundos permanecem dentro do limite individual de 140 KiB (143.360 bytes).
- O peso total combinado de 523,41 KiB tem margem de segurança de 36,59 KiB em relação ao teto de 560 KiB (573.440 bytes).
- Teste automatizado de conformidade estrita (Teste 9) assegura que nenhum arquivo extrapole esses limites.

---

## 9. Testes Adicionados na Fase 5

Foram implementados e consolidados 10 testes determinísticos em [tests/campaign/campaign-map.test.js](../tests/campaign/campaign-map.test.js):

1. `Map Phase 5 — 1. Fallback sem requestAnimationFrame executa determinísticamente via timeout`
2. `Map Phase 5 — 2. Cancelamento antes da execução do fallback remove timeout imediatamente`
3. `Map Phase 5 — 3. Hardening de ID igual a zero (0) não é ignorado por truthiness`
4. `Map Phase 5 — 4. destroy() durante fallback pendente cancela callbacks e impede reabertura`
5. `Map Phase 5 — 5. Interações rápidas: troca de região durante abertura de nó cancela drawer e prevalece última ação`
6. `Map Phase 5 — 6. Contratos de Acessibilidade WAI-ARIA: abas, painel, leitor de tela e foco` *(Validação atômica no mesmo elemento `<button>`)*
7. `Map Phase 5 — 7. Paridade Funcional entre Mapa e Lista: desafios, estados e ações idênticas nó a nó` *(Validação nó a nó em 4 estados ativos, incluindo progressão canônica do Shadow e payload `{ kind: 'SHADOW', id: null }`)*
8. `Map Phase 5 — 8. Integração CampaignView: estado COMPLETED desmonta mapa e exibe True Ending com reset` *(Teste de integração de ciclo de vida e destruição do mapa)*
9. `Map Phase 5 — 9. Métricas reais dos WebP em disco: conformidade estrita em bytes e KiB` *(Teste de conformidade de assets em disco via `fs.statSync`)*
10. `Map Phase 5 — 10. Região Final bloqueada redireciona para Região 1 e permanece inacessível` *(Teste de fallback arquitetural para Região 1, bloqueio semântico da aba e anúncio acessível)*

---

## 10. Resultados das Suítes de Teste

### Testes da Campanha (`npm run test:campaign`)
```text
✔ 109 testes executados e aprovados (0 falhas)
  - 10 testes da Fase 5 (acessibilidade atômica, paridade nó a nó com Shadow revelado, fallback de região bloqueada, integração COMPLETED e métricas em disco)
  - 24 testes da Fase 4
  - 8 testes da Fase 3
  - 14 testes da Fase 2
  - 53 testes de contratos de progressão, trials e avatares
Duração: ~1.0 s
```

### Testes Globais do Projeto (`npm test`)
```text
✔ 726 testes executados e aprovados (0 falhas) em 21 suítes completas
Duração: ~7.4 s
```

### Verificação de Formatação Git (`git diff --check`)
```text
Saída limpa (código de saída 0).
Avisos informativos de conversão LF/CRLF no checkout do Windows sem introdução de erros de whitespace.
```

---

## 11. Limitações Reais

1. **Restrição de Largura Mínima de Janela no Windows**: O redimensionamento nativo de janela desktop é limitado pelo SO a aproximadamente 500 px. Viewports mobile estreitos (320 px e 375 px) puderam ter a media query mobile `@media (max-width: 640px)` comprovada nativamente a 500 px (`true`), mas larguras físicas inferiores a 500 px só puderam ser inspecionadas no layout através do contêiner de inspeção do harness.
2. **Ausência de Exploração Pós-Campanha**: Conforme arquitetura de produção do jogo, a campanha após conclusão encerra no True Ending com reset. Não há navegação pós-jogo no mapa.
3. **Aferição Automatizada de Contraste WCAG**: Mantida por amostragem de paleta de cores no harness visual devido à ausência de ferramenta integrada de análise WCAG de contraste no runtime do Node.js.

---

## 12. Decisão Final de Homologação

> [!IMPORTANT]
> **DECISÃO DE HOMOLOGAÇÃO: APROVADO COM RESSALVAS**
>
> **Justificativa da Ressalva**:
> - Todos os problemas apontados pelas auditorias independentes foram plenamente corrigidos.
> - A suíte completa da campanha (109 testes) e a suíte global (726 testes) alcançaram 100% de aprovação.
> - O fluxo do Shadow Revelado cumpre integralmente os contratos canônicos de vitória, reconhecimento e recompensa do Super, comprovando o nó nos modos Mapa e Lista com payload `{ kind: 'SHADOW', id: null }`.
> - O comportamento de fallback da Região Final bloqueada foi formalmente validado conforme o modelo (redirecionamento para Região 1, ausência de nós do endgame e proteção contra ativação indevida).
> - O hardening de RAF, a acessibilidade WAI-ARIA com validação atômica e as métricas exatas dos fundos WebP (535.972 bytes / 523,41 KiB) respeitam os limites estabelecidos.
> - A ressalva é decorrente exclusivamente da limitação inerente ao ambiente de execução de desktop Windows, que restringe a largura física mínima da janela do navegador a ~500 px. Embora isso tenha ativado com sucesso a media query mobile (`matchMedia('(max-width: 640px)').matches === true`) e confirmado a ativação do Bottom Sheet, as resoluções nominais de 320 px e 375 px não puderam ser fisicamente encolhidas abaixo de 500 px na janela nativa do SO.
