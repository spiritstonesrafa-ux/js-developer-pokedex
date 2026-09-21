# Documentação da Fase 4 — Polimento, Transições e Microinterações do Mapa de Campanha

## 1. Objetivo da Fase

A **Fase 4** adiciona uma camada controlada de movimento, transições e feedback visual refinado ao **Mapa do Modo Campanha**, elevando a percepção de polimento e responsividade da interface sem introduzir novas dependências, loops contínuos de animação ou alterar as regras e a progressão do jogo.

O foco é proporcionar transições previsíveis, discretas, canceláveis e totalmente acessíveis, corrigindo o ciclo de renderização do DOM para que as animações de abertura/fechamento do drawer, entrada de regiões e alternância de modos operem com fidelidade visual.

---

## 2. Efeitos Implementados

1. **Entrada suave de região**: Transição curta da área visual do mapa (`.campaign-map-stage.is-entering`), combinando fade de opacidade e escala sutil.
2. **Carregamento assíncrono e suave do fundo**: Estados explícitos `.is-loading`, `.is-loaded` e `.is-hidden` (para fallback em caso de erro), com transição suave de opacidade sem layout shift.
3. **Revelação coordenada de rotas**: Animação discreta de entrada das rotas SVG sincronizada com a entrada da região ativa.
4. **Entrada escalonada dos nós (Stagger)**: Distribuição sequencial de entrada dos nós visíveis através de variáveis CSS (`--node-index`), respeitando a exclusão de nós ocultos (como o Shadow antes da revelação).
5. **Microinteração de seleção de nó**: Halo de pulso suave (`@keyframes nodeSelectPulse`) ao selecionar ou clicar em um nó ativo.
6. **Ciclo animado real de abertura e fechamento do drawer**: Renderização inicial fechada seguida de ativação via RAF de `.is-open` e sincronização do backdrop; fechamento aguardando `transitionend` (com fallback de timeout de 320 ms) antes da desmontagem e restauração de foco.
7. **Transição entre Mapa e Lista**: Fade curto com deslocamento sutil de translação vertical (`.campaign-map-panel.is-switching-view`).
8. **Refinamento de abas e controles**: Substituição de `transition: all` por propriedades explícitas (`color`, `background`, `border-color`, `box-shadow`) preservando a navegação via teclado e área mínima de toque (44×44 px).
9. **Respeito estrito a movimento reduzido**: Desativação total de stagger, animações de slide, pulsos e transições quando `prefers-reduced-motion: reduce` ou simulação no harness estiver ativa.

---

## 3. Tabela de Efeitos, Durações e Propriedades CSS Animadas

| Efeito / Componente | Seletor CSS | Propriedades Animadas | Duração | Timing Function | Comportamento em Movimento Reduzido |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Entrada do Stage** | `.campaign-map-stage.is-entering` | `opacity`, `transform` (scale 0.985 → 1) | 280 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Imediato (`animation: none`) |
| **Fundo WebP (Fade-in)** | `.campaign-map-bg-image` | `opacity` (0 → 1) | 350 ms | `ease` | Imediato (`transition: none; opacity: 1`) |
| **Revelação de Rotas** | `.campaign-map-stage.is-entering .campaign-map-routes` | `opacity` (0 → 1) | 350 ms | `ease` | Imediato (`animation: none`) |
| **Stagger dos Nós** | `.campaign-map-stage.is-entering .campaign-map-node` | `opacity`, `transform` (translate -50%, -50% scale 0.65 → 1) | 280 ms (+ delay: `calc(index * 40ms)`) | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Imediato (`animation: none; delay: 0s`) |
| **Halo de Seleção de Nó** | `.campaign-map-node.is-selected` | `box-shadow`, `transform` | 240 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Imediato (`animation: none; box-shadow estático`) |
| **Drawer Desktop (Slide)** | `.campaign-details-drawer` | `transform` (translateX 100% → 0) | 280 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Imediato (`transition: none; transform: none`) |
| **Bottom Sheet Mobile** | `.campaign-details-drawer` (<= 768px) | `transform` (translateY 100% → 0) | 280 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Imediato (`transition: none; transform: none`) |
| **Backdrop do Drawer** | `.campaign-details-backdrop` | `opacity` (0 → 1) | 250 ms | `ease` | Imediato (`transition: none`) |
| **Alternância Mapa/Lista** | `.campaign-map-panel.is-switching-view` | `opacity`, `transform` (translateY 4px → 0) | 220 ms | `ease` | Imediato (`animation: none`) |
| **Abas de Região** | `.campaign-map-tab` | `color`, `background`, `border-color`, `box-shadow` | 200 ms | `ease` | Imediato (`transition: none`) |

> [!NOTE]
> Nenhuma propriedade causadora de reflow (como `width`, `height`, `top`, `left`, `margin`) é animada. Todas as transformações usam aceleração por GPU (`transform` e `opacity`). O `box-shadow` do drawer é estático no slide, evitando repaints custosos.

---

## 4. Sistema de Transições Controladas (`transitionCause`)

Para resolver o problema arquitetural de recriação do DOM a cada renderização, foi implementado um controle explícito de intenção de render:

```javascript
this.transitionCause = 'REGION_CHANGE'; // 'REGION_CHANGE' | 'VIEW_MODE_CHANGE' | 'NODE_SELECTION' | 'DRAWER_OPEN' | 'DRAWER_CLOSE' | 'NONE'
```

### Regras do Ciclo:
1. **Troca de Região (`REGION_CHANGE`)**: Disparada ao clicar em uma nova aba desbloqueada. Cancela qualquer ciclo de abertura (`_cancelDrawerOpening()`) e fechamento (`_cancelDrawerClosing()`) em andamento, aplica `.is-entering` ao stage e agenda a remoção da classe após 360 ms.
2. **Alternância de Visualização (`VIEW_MODE_CHANGE`)**: Disparada ao alternar entre Mapa e Lista. Cancela transições pendentes do drawer, fecha logicamente o painel, aplica `.is-switching-view` e agenda a remoção após 250 ms.
3. **Abertura do Drawer (`DRAWER_OPEN`)**: Ocorre quando o drawer estava fechado e um nó é ativado. O drawer e o backdrop nascem sem `is-open` e recebem a classe no frame de animação seguinte (`_safeRaf`) mediante validação de token (`_drawerTransitionToken`).
4. **Troca de Seleção de Nó (`NODE_SELECTION`)**: Ocorre quando o drawer já estava aberto e outro nó é selecionado. Cancela fechamento anterior, preserva o drawer aberto com os dados do novo nó e não reproduz a animação de entrada do stage nem fecha o backdrop.
5. **Fechamento do Drawer (`DRAWER_CLOSE`)**: Cancela o RAF de abertura. Se o drawer ainda não estiver visualmente aberto, fecha imediatamente sem aguardar timeout. Se já estiver aberto, remove `.is-open`, rastreia o listener de `transitionend` no elemento do drawer (`_drawerCloseElement`) e agenda fallback via `_safeTimeout(finishClose, 320)` antes de re-renderizar e restaurar o foco.
6. **Limpeza Transitória**: Ao término de `render()` e anexo de microinterações, `this.transitionCause` é redefinido para `'NONE'`. Atualizações subsequentes de acessibilidade (como anúncios no `aria-live`) ou re-renderizações não provocam novas animações.

---

## 5. Ciclo de Vida do Drawer e Bottom Sheet

### Ciclo de Abertura:
1. O elemento `<aside id="trainerDetailsDrawer">` e o backdrop são inseridos no DOM sem a classe `.is-open` (com `aria-hidden="true"`).
2. Um token de abertura é gerado (`_drawerTransitionToken`) e um frame de animação é registrado via `_safeRaf`.
3. No disparo do RAF, valida-se estritamente:
   - `!this._isDestroyed`
   - `this._renderVersion === currentVer`
   - `this._drawerTransitionToken === openToken`
   - `this.isDrawerOpen === true`
4. Se o usuário tiver cancelado a abertura (pressionando `Escape`, clicando no backdrop ou selecionando outra região), o callback é ignorado e o foco não é transferido.
5. Caso validado, a classe `.is-open` é aplicada simultaneamente a ambos, `aria-hidden="false"` é atribuído e o foco é transferido com segurança para `#detailsCloseBtn`.
6. Em modo de movimento reduzido, o elemento nasce diretamente com `.is-open` e o foco é transferido instantaneamente.

### Ciclo de Fechamento:
1. `closeDrawer()` cancela imediatamente qualquer RAF de abertura pendente via `_cancelDrawerOpening()`.
2. Se o drawer não estiver visualmente aberto (`!drawer.classList.contains('is-open')`) ou se movimento reduzido estiver ativo, o fechamento é concluído de forma síncrona e imediata, sem aguardar 320 ms por uma transição que nunca iniciou.
3. Se estiver aberto, `_cancelDrawerClosing()` invalida qualquer fechamento anterior.
4. A classe `.is-open` é removida de `#trainerDetailsDrawer` e `#detailsBackdrop`, e `aria-hidden="true"` é atualizado.
5. Um token de fechamento (`_drawerClosingToken`) é incrementado.
6. O listener de `transitionend` é anexado sem `{ once: true }` ao drawer (`this._drawerCloseElement = drawer; this._drawerCloseHandler = onTransitionEnd;`), filtrando rigorosamente:
   ```javascript
   if (e.target === drawer && (!e.propertyName || e.propertyName === 'transform')) {
     finishClose();
   }
   ```
   Eventos borbulhados de descendentes não consomem o listener nem finalizam precocemente a transição.
7. Um timer de fallback (`_drawerCloseFallbackTimer`) de 320 ms é iniciado via `this._safeTimeout`.
8. `finishClose()` é estritamente idempotente: cancela o fallback timer, remove o listener do drawer, limpa referências internas, re-renderiza o estado fechado e restaura o foco ao elemento de origem.

---

## 6. Estratégia de Cancelamento de Timers, Listeners e Callbacks Obsoletos

Para assegurar estabilidade durante interações rápidas e descarte do componente:

1. **Rastreamento Centralizado**: A view mantém coleções de IDs ativos:
   - `this._pendingTimeoutIds = new Set()`
   - `this._pendingRafIds = new Set()`
   - `this._drawerCloseFallbackTimer`
   - `this._drawerOpenRafId`
   - `this._drawerCloseElement` e `this._drawerCloseHandler`
   - `this._ariaTimer`
2. **Métodos Seguros**: Todo timer e frame é criado via `_safeTimeout(fn, ms)` e `_safeRaf(fn)`, que se auto-removem do registro ao disparar. Não existe `setTimeout` sem rastreamento na classe.
3. **Limpeza Centralizada de Fechamento (`_cancelDrawerClosing()`)**:
   - Incrementa `_drawerClosingToken`.
   - Limpa `_drawerCloseFallbackTimer` via `_clearTimeout`.
   - Remove explicitamente o listener `transitionend` do elemento armazenado via `removeEventListener`.
   - Limpa as referências a `_drawerCloseElement` e `_drawerCloseHandler`.
4. **Limpeza Centralizada de Abertura (`_cancelDrawerOpening()`)**:
   - Incrementa `_drawerTransitionToken`.
   - Cancela o RAF ativo via `_clearRaf(this._drawerOpenRafId)`.
   - Limpa a referência `_drawerOpenRafId = null`.
5. **Invalidação Terminal em `destroy()`**:
   - Atribui `this._isDestroyed = true`.
   - Executa `_clearAllPendingWork()`, cancelando todos os timeouts, RAFs e listeners de transição.
   - Remove o listener global de teclado (`document.removeEventListener('keydown')`).
   - Remove classes visuais do drawer e backdrop caso ainda montados.
   - Qualquer callback assíncrono já capturado no event loop aborta imediatamente ao verificar `if (this._isDestroyed) return;`, garantindo que nenhuma chamada a `render()`, restauração de foco ou reinstalação de listeners ocorra após o descarte.

---

## 7. Comportamento em Movimento Reduzido e Fallback de Imagem

A implementação obedece à preferência do sistema operacional e do usuário:
- Regras de CSS sob `@media (prefers-reduced-motion: reduce)`.
- Suporte a simulação determinística via seletor `[data-simulate-reduced-motion="true"]`.
- Método `_isReducedMotion()` que checa tanto a media query nativa quanto o atributo de simulação.

### Efeitos quando ativo:
- Entrada de região: instantânea (`animation: none`).
- Rotas SVG: visíveis de imediato sem fade; rota ativa estática (sem deslocamento contínuo de `stroke-dashoffset`).
- Marcador de seleção: posicionado sem bob vertical (`animation: none`).
- Nós: sem stagger ou delay; sem pulso de seleção.
- Fundo WebP: recebe `.is-loaded` diretamente sem transição de opacidade.
- Drawer / Bottom Sheet: sem slide; abertura e fechamento imediatos.
- Foco: restaurado instantaneamente sem delay artificial de 50 ms.

### Preservação do Tratamento de Erro do Fundo WebP:
Em `_setupBackgroundImageFallback()`:
1. Movimento reduzido desativa apenas a animação de opacidade e atrasos, **nunca** o tratamento de erros.
2. Os listeners de `load` e `error` continuam sendo registrados normalmente.
3. Se a imagem estiver em cache com `naturalWidth === 0` ou falhar no carregamento, o handler `markError()` é disparado, removendo `.is-loading` e `.is-loaded` e aplicando `.is-hidden`, garantindo que o gradiente temático regional de fallback seja exibido com perfeição.

---

## 8. Atualizações no Harness Visual (`tests/visual/campaign-map-harness.html`)

O harness foi atualizado para validar os requisitos da Fase 4:

1. **Ativação Real de Movimento Reduzido**: O botão agora alterna o atributo `data-simulate-reduced-motion="true"` na raiz do documento, acionando as regras CSS equivalentes às do media query e atualizando o modelo visual em tempo real.
2. **Controle "Repetir Entrada"**: Força `transitionCause = 'REGION_CHANGE'` e re-renderiza o mapa para inspeção da animação de entrada do stage e stagger dos nós.
3. **Controle "Fundo Lento (1.5s)"**: Simula carregamento assíncrono atrasado, permitindo validar o estado `.is-loading` e a posterior transição para `.is-loaded`.
4. **Controle "Simular Falha Imagem"**: Força o evento `error` no WebP para validar o fallback imediato com `.is-hidden` e manutenção do gradiente temático.
5. **Console de Eventos Expandido**: Registra eventos em tempo real:
   - `REGION_SWITCHED`
   - `REGION_ENTRANCE_REPLAYED`
   - `VIEW_MODE_CHANGED`
   - `DRAWER_OPENED`
   - `DRAWER_CLOSED`
   - `IMAGE_LOADED`
   - `IMAGE_LOAD_SIMULATED_START`
   - `IMAGE_FALLBACK_ACTIVATED`
   - `REDUCED_MOTION_TOGGLED`

---

## 9. Testes Automatizados da Campanha (`tests/campaign/campaign-map.test.js`)

Foram consolidados testes comportamentais rigorosos cobrindo os 24 requisitos técnicos e a auditoria de concorrência:

1. `Troca de região define o tipo de transição correto e limpa estado transitório`
2. `Abrir e fechar drawer não reiniciam a entrada da região`
3. `Alternar Mapa/Lista preserva a região ativa e aplica classe de transição`
4. `Fundo: listeners de load/error, cache e ausência de handlers inline`
5. `Nós recebem índices de stagger, nós ocultos não participam e coordenadas intactas`
6. `Rotas SVG mantêm estados semânticos corretos`
7. `Drawer: ciclo de abertura e fechamento com fallback e classes (mock determinístico)`
8. **Teste A**: `Escape antes do RAF de abertura cancela abertura e fecha imediatamente`
9. **Teste B**: `Clique no backdrop antes do RAF cancela abertura e fecha imediatamente`
10. **Teste C**: `destroy() durante fechamento invalida callbacks e limpa listeners`
11. **Teste D**: `Abrir nó B durante fechamento do nó A cancela fechamento e mantém nó B`
12. **Teste E**: `Evento transitionend de descendente não consome o fechamento`
13. **Teste F**: `Fallback de imagem em movimento reduzido preserva tratamento de erro`
14. **Teste G**: `Troca de região durante fechamento cancela drawer e prevalece última ação`
15. **Teste H**: `Troca Mapa/Lista durante fechamento cancela drawer e prevalece último modo`
16. `Movimento reduzido elimina animações e delays artificiais`
17. `Teclado Escape e clique no backdrop fecham drawer e restauram foco`
18. `Ações rápidas não deixam callbacks obsoletos e mantém última região`
19. `destroy() cancela timers, RAFs e não acumula listeners`
20. `triggerChallenge, saves VERSION = 1 e integridade browser`

---

## 10. Viewports e Estados Validados

A validação visual foi conduzida via subagente de navegação no harness real:

- **Desktop (~1180 px)**: Layout amplo com gaveta lateral à direita, nós distribuídos conformemente à arte de fundo WebP.
- **Tablet (~768 px)**: Enquadramento proporcional da moldura do mapa e responsividade das abas.
- **Mobile (~375 px)**: Visualização compacta com rolagem horizontal controlada do stage e drawer adaptado para **Bottom Sheet** deslizante a partir da base da tela.
- **Estados de Progresso**:
  - 0 insígnias (início da jornada).
  - 6 insígnias (Região 1 concluída, Região 2 liberada).
  - 12 insígnias (Regiões 1 e 2 concluídas, Região 3 liberada).
  - 17 insígnias (Pré-Endgame).
  - 18 insígnias (Região Final liberada com 4 Provas e Super Trainer).
  - Shadow Revelado (nó de Silas visível e selecionável).
  - 100% Concluído.
- **Interações Rápidas e Condições de Corrida**:
  - Abrir nó e pressionar Escape imediatamente antes do frame de abertura.
  - Abrir nó e clicar no backdrop imediatamente.
  - Abrir nó A, fechar e abrir nó B imediatamente.
  - Fechar e trocar de região durante o slide.
  - Fechar e alternar Mapa/Lista durante o slide.
  - Descarte do componente (`destroy()`) durante a transição de fechamento.
  - Simulação de erro no WebP com movimento reduzido ativado.

---

## 11. Limitações Reais e Conformidade com o Escopo

- **Sem áudio ou vibração**: Nenhum efeito sonoro ou haptic feedback foi adicionado, mantendo a conformidade com as restrições da Fase 4.
- **Sem alteração de regras da campanha**: Progressão, draft, recompensas, persistência (`VERSION = 1`), regras de batalha e IA permanecem 100% inalteradas.
- **Zero novas dependências de runtime**: Nenhuma biblioteca externa de animação foi introduzida (Vanilla CSS e JS nativo).

---

## 12. Métricas Aferidas

- **Suíte Específica da Campanha (`npm run test:campaign`)**:
  - 99 testes executados, 99 aprovados, 0 falhas (tempo de execução: ~1040 ms).
- **Suíte Completa do Repositório (`npm test`)**:
  - 716 testes executados (21 suítes), 716 aprovados, 0 falhas (tempo de execução: ~7.4 s).
- **Verificação de Sintaxe e Whitespace (`git diff --check`)**:
  - Código de saída `0` (zero erros de espaçamento, CRLF ou quebras espúrias).
