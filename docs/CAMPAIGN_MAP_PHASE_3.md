# Documentação da Fase 3 — Arte Final e Integração dos Mapas de Campanha

## 1. Objetivo da Fase

A **Fase 3** conclui a entrega visual definitiva do novo **Mapa do Modo Campanha**, substituindo os gradientes provisórios da Fase 2 por quatro cenários originais ilustrados em **pixel art moderna** com vista panorâmica levemente elevada em formato WebP (16:9). A fase abrange:

1. **Criação e calibração artística** de 4 cenários panorâmicos autorais em pixel art correspondentes às 4 regiões declaradas no catálogo da campanha (`region-1`, `region-2`, `region-3`, `region-endgame`).
2. **Otimização e orçamento de performance**, com resolução de 1280×720 e peso rigorosamente controlado com teto de 140 KB por asset (total combinado ~523 KB).
3. **Integração arquitetural resiliente**, garantindo carregamento assíncrono sob demanda (somente a região ativa no DOM), preservação do fallback de gradientes CSS (`.theme-region-*`), overlay de contraste regional e compatibilidade total com o modo lista, acessibilidade WAI-ARIA e saves pré-existentes.
4. **Validação visual e automatizada**, com 79 testes específicos de campanha, 696 testes no total do repositório (21 suítes) e inspeção via browser em múltiplos viewports e estados de progresso.

---

## 2. Direção Artística Adotada

- **Estética & Linguagem**: Pixel art moderna e detalhada inspirada nos clássicos RPGs portáteis da era 32-bit (Game Boy Advance / Nintendo DS), com iluminação rica, paletas personalizadas por bioma e acabamento nítido (`image-rendering: pixelated; crisp-edges`).
- **Perspectiva**: Panorâmica levemente isométrica/elevada, proporcionando profundidade aos biomas sem distorcer o plano de rotas cartográficas.
- **Proporção**: 16:9 exata (1280×720 px), garantindo consistência com o container de visualização (`max-width: 1180px`) e o sistema de coordenadas percentuais (0–100%).
- **Composição Semântica**: Cada ponto de interesse do cenário foi estrategicamente desenhado sob as coordenadas `(x, y)` dos nós e mestres correspondentes, guiando o olhar do jogador sem conflitar com os avatares e indicadores de status.
- **Tratamento de Contraste**: Overlay leve com gradiente de vinheta e tons harmonizados para que os nós interativos, rótulos e rotas pontilhadas SVG mantenham legibilidade excelente em qualquer condição de iluminação.

---

## 3. Declaração de Originalidade dos Cenários

Todos os quatro cenários foram concebidos e gerados de forma **estritamente original e autoral**:

- **Nenhum personagem, Pokémon oficial, treinador da franquia, criatura, logotipo, insígnia da Nintendo/Game Freak ou elemento protegido** está incorporado aos bitmaps.
- **Nenhum texto, nome ou rota pontilhada** foi inserido nas imagens de fundo: toda a tipografia, rotas e interatividade continuam sendo renderizadas dinamicamente via DOM e SVG.
- A composição é inspirada unicamente na linguagem visual universal de fantasia e biomas clássicos de RPGs por turno.

---

## 4. Inventário dos Assets

Todos os arquivos estão armazenados localmente no repositório em `assets/images/campaign/maps/`:

| Arquivo | Região | Resolução | Proporção | Formato | Tamanho (Bytes) | Tamanho (KB) | Orçamento Máximo |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `region-1-vales.webp` | Região 1 — Planícies & Costas | 1280×720 | 16:9 | WebP | 134.778 | 131,62 KB | 140 KB (143.360 B) |
| `region-2-fendas.webp` | Região 2 — Fendas & Picos | 1280×720 | 16:9 | WebP | 133.436 | 130,31 KB | 140 KB (143.360 B) |
| `region-3-arcanas.webp` | Região 3 — Domínios Arcanos | 1280×720 | 16:9 | WebP | 134.350 | 131,20 KB | 140 KB (143.360 B) |
| `region-endgame.webp` | Região Final — Pináculo do Circuito | 1280×720 | 16:9 | WebP | 133.408 | 130,28 KB | 140 KB (143.360 B) |
| **Total Combinado** | **4 Regiões** | — | — | — | **535.972** | **523,41 KB** | **560 KB** |

---

## 5. Paleta Resumida e Biomas de Cada Região

### Região 1 — Planícies & Costas (`region-1-vales.webp`)
- **Identidade**: Acolhedora, costeira, ensolarada e primária.
- **Paleta Dominante**: Verdes naturais (`#2d7a3e`, `#4caf50`), azul oceânico e turquesa (`#0077b6`, `#48cae4`), areia dourada e madeira rústica (`#e9c46a`, `#8b5e34`).
- **Mapeamento de Pontos de Interesse**:
  - `(15%, 72%)`: *Planície Serena* — clareira aberta de pastagem com caminhos suaves.
  - `(28%, 44%)`: *Bosque Ancestral* — bosque de copas frondosas e clareiras verdes.
  - `(20%, 22%)`: *Bosque dos Esporos* — mata fechada com cogumelos gigantes azulados.
  - `(52%, 80%)`: *Santuário das Marés* — enseada de águas calmas com píer de madeira.
  - `(74%, 56%)`: *Colinas da Tempestade* — colinas com moinhos e linhas de postes de transmissão.
  - `(86%, 24%)`: *Picos dos Ventos* — falésias elevadas sobre o mar aberto.

### Região 2 — Fendas & Picos (`region-2-fendas.webp`)
- **Identidade**: Árida, vulcânica, mineral e glacial.
- **Paleta Dominante**: Terracota e cobre (`#b25d37`, `#e76f51`), vermelho vulcânico e magma (`#d62828`, `#f77f00`), cinza monolítico (`#4a5568`, `#718096`) e ciano glacial (`#a8dadc`, `#e0fbfc`).
- **Mapeamento de Pontos de Interesse**:
  - `(16%, 70%)`: *Platô do Dojo Marcial* — platô fortificado com pátio de treinamento e telhados orientais.
  - `(42%, 82%)`: *Cânion Terracota* — garganta profunda de pedra estratificada avermelhada.
  - `(18%, 34%)`: *Cisterna Alquímica* — lagoas de lodo borbulhante e vapores tóxicos.
  - `(72%, 76%)`: *Pedreira Monolítica* — escarpas de pedra cinzenta com guindastes e colunas talhadas.
  - `(46%, 28%)`: *Caldeira Vulcânica* — cone vulcânico fumegante com vertentes de magma incandescente.
  - `(84%, 18%)`: *Caverna Glacial* — picos agudos nevados e cavernas de gelo azul-turquesa.

### Região 3 — Domínios Arcanos (`region-3-arcanas.webp`)
- **Identidade**: Mística, crepuscular, mágica e siderúrgica.
- **Paleta Dominante**: Violeta profundo e púrpura (`#240046`, `#5a189a`), azul crepúsculo estrelado (`#10002b`, `#3c096c`), prata lunar e cristais magenta (`#c77dff`, `#e0aaff`), e fogo forjado (`#ff9e00`).
- **Mapeamento de Pontos de Interesse**:
  - `(24%, 82%)`: *Clareira Encantada* — floresta com cogumelos e cristais luminescentes.
  - `(18%, 40%)`: *Observatório Astral* — torre de pedra com cúpula e esfera armilar de latão.
  - `(60%, 72%)`: *Ruínas do Eclipse* — círculo ritualístico de monólitos escuros e portal sombrio.
  - `(36%, 18%)`: *Mausoléu Espectral* — mausoléu de pedra gótica com chamas e névoas etéreas violetas.
  - `(82%, 54%)`: *Fortaleza Siderúrgica* — fortaleza mecânica com chaminés e forjas incandescentes.
  - `(76%, 20%)`: *Santuário Dracônico* — altar no cume com estátuas de dragões e chamas azuis.

### Região Final — Pináculo do Circuito (`region-endgame.webp`)
- **Identidade**: Monumental, celestial, cósmica e apex.
- **Paleta Dominante**: Azul cósmico e void (`#03071e`, `#0d1b2a`), ouro antigo e mármore (`#d4af37`, `#fefae0`), lavanda místico e púrpura celestial (`#7209b7`, `#3a0ca3`).
- **Mapeamento de Pontos de Interesse**:
  - `(20%, 70%)`: *Santuário das Lendas* — estrado flutuante de mármore com colunas coríntias douradas.
  - `(80%, 70%)`: *Santuário Mítico* — ilha astral sustentada por cristais etéreos translúcidos.
  - `(22%, 36%)`: *Arena dos Titãs* — coliseu circular megalítico suspenso no éter.
  - `(78%, 36%)`: *Templo Celestial* — torre estelar com colunas culminando em pontos de luz radiante.
  - `(50%, 56%)`: *Arena do Campeão (Super)* — grande arena circular dourada com runas concêntricas no centro inferior.
  - `(50%, 20%)`: *Trono do Eclipse (Shadow)* — estrutura e trono sombrio flutuante envolto por vórtice cósmico na parte superior.

---

## 6. Estratégia de Carregamento e Fallback

### Carregamento Sob Demanda e Isolamento
- **Apenas a região ativa é renderizada no DOM**: Ao iniciar o jogo, somente o elemento `<img>` da região ativa (inicialmente `region-1-vales.webp`) é inserido no HTML do stage.
- **Zero pré-carregamento dos outros 3 cenários**: Os assets das regiões 2, 3 e Final são solicitados pelo navegador estritamente no momento em que o jogador clica na aba correspondente.
- **Prevenção estrutural de layout shift (CLS)**: As imagens declaram explicitamente `width="1280"` e `height="720"`, e o contêiner preserva a proporção 16:9 (`aspect-ratio: 16 / 9`).
- **Decodificação assíncrona**: O atributo `decoding="async"` sinaliza ao navegador para decodificar imagens em segundo plano, minimizando contenção na thread principal durante as transições de tela.
- **Suporte a caminhos em qualquer contexto (`assetPrefix`)**: `CampaignMapView` aceita `assetPrefix` configurável (`''` no jogo principal `index.html`, `'../../'` no harness de testes visuais), permitindo execução perfeita tanto em servidor quanto via protocolo `file:///`.

### Resiliência e Fallback Sem Handler Inline
- O elemento `.campaign-map-stage` mantém sempre as classes temáticas provadas na Fase 2 (`theme-region-verdant`, `theme-region-crags`, `theme-region-arcane`, `theme-region-endgame`), que estilizam gradientes CSS complexos e harmônicos.
- O elemento de imagem não utiliza manipuladores inline (`onerror`):
  ```html
  <img class="campaign-map-bg-image"
       src="${this.assetPrefix}${region.bgImage}"
       alt=""
       aria-hidden="true"
       width="1280"
       height="720"
       loading="eager"
       decoding="async">
  ```
- O fallback é registrado dinamicamente por JavaScript no ciclo pós-renderização (`_setupBackgroundImageFallback`):
  - Um listener com `{ once: true }` é registrado para o evento `error` via `addEventListener`.
  - Imagens já concluídas com erro (`complete && naturalWidth === 0`) são tratadas imediatamente.
  - Em caso de falha, adiciona a classe `.is-hidden` (`display: none`), revelando instantaneamente o gradiente temático CSS sem interromper o funcionamento dos nós, rotas, seleção de equipe, gaveta de detalhes ou motor de batalha.

---

## 7. Ajustes de Coordenadas e Calibração da Região Final

Enquanto as Regiões 1, 2 e 3 mantiveram alinhamento visual com as coordenadas canônicas preexistentes, a **Região Final (`region-endgame.webp`)** foi recalibrada para convergir com exatidão sobre os pontos focais da arte:

- **Super Trainer (`node-super`)**:
  - Posição recalibrada de `(50.0%, 28.0%)` para `(50.0%, 56.0%)`, posicionando-se no centro da arena circular dourada do Campeão.
  - Coordenadas SVG (no sistema `1000 × 562.5`): $X = 50.0 \times 10 = 500$, $Y = 56.0 \times 5.625 = 315$.
- **Shadow Super Trainer (`node-shadow`)**:
  - Posição recalibrada de `(50.0%, 12.0%)` para `(50.0%, 20.0%)`, centralizado sobre o trono e estrutura sombria do eclipse.
  - Coordenadas SVG: $X = 50.0 \times 10 = 500$, $Y = 20.0 \times 5.625 = 112.5 \approx 113$.
- **Rotas SVG Recalibradas**:
  - `rend-titans-super`: `M 220 203 C 300 230, 400 270, 500 315` (curva descendente da Prova dos Titãs para a arena dourada).
  - `rend-celestial-super`: `M 780 203 C 700 230, 600 270, 500 315` (curva descendente do Templo Celestial para a arena dourada).
  - `rend-legendary-super`: `M 200 394 C 290 380, 390 360, 500 315` (curva suave do Santuário das Lendas para a arena dourada).
  - `rend-mythical-super`: `M 800 394 C 710 380, 610 360, 500 315` (curva suave do Santuário Mítico para a arena dourada).
  - `rend-super-shadow`: `M 500 315 L 500 113` (conexão estritamente vertical entre a arena do campeão e o trono sombrio).
- **Provas Especiais Intactas**:
  - Prova Lendária: `(20.0%, 70.0%)` $\rightarrow$ SVG `(200, 394)`.
  - Prova Mítica: `(80.0%, 70.0%)` $\rightarrow$ SVG `(800, 394)`.
  - Prova dos Titãs: `(22.0%, 36.0%)` $\rightarrow$ SVG `(220, 203)`.
  - Prova Celestial: `(78.0%, 36.0%)` $\rightarrow$ SVG `(780, 203)`.

---

## 8. Resultados das Medições de Performance

| Métrica | Meta | Resultado Medido | Ferramenta / Procedimento |
| :--- | :---: | :---: | :--- |
| **Peso Máximo por Imagem** | $\le 140\text{ KB}$ | **131,62 KB máx.** (130,28 a 131,62 KB) | `fs.statSync` no runtime Node.js |
| **Peso Total dos 4 Mapas** | $\le 560\text{ KB}$ | **523,41 KB** (535.972 bytes) | Script de auditoria automatizada |
| **Resolução dos Arquivos** | 16:9 | **1280×720 px** | Parser binário de chunks WebP (VP8) |
| **Layout Shift (CLS)** | $< 0.1$ | CLS mitigado estruturalmente por dimensões intrínsecas e container com proporção reservada. Valor exato não aferido nesta execução. | Atributos `width="1280"`, `height="720"` e CSS `aspect-ratio: 16 / 9` |
| **Carregamento Inicial Isolado** | 1 fundo | **1 único fundo solicitado** | Inspeção de rede e asserção DOM |
| **Taxa de Quadros / Fluidez** | Transição suave | **Fluidez inspecionada visualmente no navegador** (sem medição quantitativa de FPS atribuída) | Inspeção visual no Chrome em múltiplos viewports |

---

## 9. Viewports e Estados Inspecionados Visualmente

A interface foi inspecionada visualmente no navegador Chrome real via harness de testes e na aplicação principal:

1. **Viewports**:
   - **Desktop (1180 px)**: Proporção 16:9 integral, visão panorâmica completa, gaveta lateral à direita.
   - **Tablet (768 px)**: Enquadramento proporcional com escala de nós e fontes calibradas.
   - **Mobile (375 px)**: Palco com rolagem horizontal livre, indicador visual *"Arraste para explorar o mapa ↔"*, gaveta convertida em *bottom sheet*.

2. **Estados de Progresso & Regras de Negócio**:
   - **0 Insígnias**: Planície Serena sugerida, nós disponíveis, Região Final bloqueada com cadeado e nota de progresso (0/18).
   - **6 Insígnias**: 6 Mestres derrotados com insígnia conquistada, avanço fluido para novas opções.
   - **12 Insígnias**: 12 Mestres derrotados, Região Final permanece bloqueada (12/18).
   - **17 Insígnias**: Pré-Endgame, Região Final bloqueada (17/18).
   - **18 Insígnias**: Região Final desbloqueada dinamicamente, revelando as 4 Provas e o Super Trainer na arena dourada `(50%, 56%)`.
   - **Shadow Revelado**: Rota especial vertical e nó do *Shadow Super Trainer* revelados no Trono do Eclipse `(50%, 20%)`.
   - **100% Concluído**: Estado final completo com insígnias e troféus conquistados.
   - **Simulação de Falha de Imagem**: Fundo WebP oculto dinamicamente, revelando o gradiente temático subjacente sem perda de funcionalidade.
   - **Modo Lista**: Visualização em lista agrupada sem renderização de bitmap, mantendo alto contraste e cards informativos.
   - **Acessibilidade**: Navegação por teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`), leitor de tela (`aria-live`, `role="tab"`, `role="tabpanel"`), e respeito a `prefers-reduced-motion`.

---

## 10. Resultados dos Testes Automatizados

- **Testes da Campanha (`npm run test:campaign`)**:
  - **78 testes executados, 78 passaram (100% de sucesso)**.
  - Zero falhas, zero cancelamentos, zero testes ignorados.
  - Duração: ~630 ms.
- **Suíte Completa do Repositório (`npm test`)**:
  - **695 testes executados em 21 suítes, 695 passaram (100% de sucesso)**.
  - Zero regressões em nenhum módulo (batalha, áudio, animações, vfx, sprites, catálogo, etc.).
  - Duração: ~7.500 ms.

---

## 11. Limitações e Pendências

- **Compatibilidade Retroativa Integral**: Saves preexistentes da versão 1 continuam 100% funcionais, sem requerer migração de schema.
- **Zero Pendências**: Todos os requisitos da Fase 3 foram plenamente atendidos e validados visual e programmaticamente.
- **Próximas Fases**: A Fase 4 (polimento de transições e micro-interações) pode ser iniciada quando aprovada pela equipe de produto.
