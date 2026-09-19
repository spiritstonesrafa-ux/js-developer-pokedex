# Especificação Técnica e Funcional do Mapa de Campanha — Fase 1

**Projeto:** Pokédex DIO Pro + Pokémon Battle Arena  
**Módulo:** Campanha (`Circuito dos Mestres`)  
**Documento:** Definição Funcional, Visual e Arquitetural do Mapa de Campanha  
**Status:** Fase 1 Aprovada — Pronta para Fase 2  
**Autor:** Antigravity (Advanced Agentic Coding)  
**Data da Aprovação:** 19 de Setembro de 2026  

---

## 1. Resumo Executivo

O presente documento consolida a especificação funcional, visual e arquitetural para a evolução da tela principal da Campanha (**Circuito dos Mestres**), projetando a substituição da atual interface baseada em grade de cards (`.campaign-grid`) por um **Mapa de Campanha Interativo**. A interface adota estética em pixel art moderna inspirada visualmente na era 32-bit (consoles portáteis GBA/DS), apresentando cenários ricos em biomas, caminhos pontilhados conectando pontos de desafio, nós interativos, marcadores de destino e painel contextual de detalhes do treinador.

### Diretrizes Centrais Aprovadas na Fase 1
1. **Estilo Artístico Oficial — Pixel Art Moderna Original:** Cenários em pixel art com iluminação moderna e alta resolução, inspirados na era 32-bit clássica, com composição 100% original (sem cópia de mapas, tiles, construções ou assets oficiais da Nintendo, Game Freak ou The Pokémon Company). A convivência entre o mapa em pixel art retrô e os retratos modernos em alta resolução dos treinadores é uma escolha visual deliberada de direção de arte.
2. **Preservação Integral da Liberdade de Escolha (Não-Linearidade):** Embora os caminhos pontilhados sugiram rotas orgânicas através dos biomas, **nenhum bloqueio sequencial obrigatório é imposto aos 18 Mestres de Tipo**. O jogador continua com liberdade total para desafiar qualquer Mestre em qualquer ordem logo após o draft inicial.
3. **Distribuição Equilibrada dos Desafios:** Os 18 Mestres de Tipo foram organizados em **3 Regiões Principais** de 6 Mestres cada, complementadas por uma **Região Final (Endgame)** que abriga as 4 Provas Especiais, o Super Trainer e a revelação do Shadow Super Trainer. Todos os 18 tipos Pokémon e os 6 encontros especiais de endgame estão distribuídos exatamente uma vez.
4. **Navegação por Abas Superiores com Semântica WAI-ARIA:** A alternância entre as regiões ocorre por abas no topo (`role="tablist"`), exibindo o progresso de cada região (ex: `3/6`) e o status da Região Final (`Bloqueada — 12/18` ou `Disponível`), reforçando que as 3 regiões iniciais estão simultaneamente acessíveis e não representam uma escada linear obrigatória.
5. **Painel do Treinador com Guia de Tipo Compacto:** O painel lateral/inferior exibe um resumo objetivo de vantagens e fraquezas do Mestre com aviso sobre tipos secundários e controle retrátil opcional, auxiliando na decisão antes de entrar na preparação de equipe (picker).
6. **Padrão Mobile com Modo Lista Alternativo Completo:** Em dispositivos móveis, o mapa é a visualização padrão (com rolagem horizontal suave e indicativo de conteúdo fora da viewport), mantendo um botão de acesso imediato para o **Modo Lista**, que oferece paridade funcional completa com o mapa.
7. **Arquitetura Híbrida Leve (Sem Canvas, Sem Frameworks):** A solução técnica baseia-se em imagens de fundo em formato WebP, rotas renderizadas em vetor SVG responsivo sobreposto, nós como elementos interativos semânticos `<button>` em HTML posicionados percentualmente, e painel em gaveta lateral (desktop) ou *bottom sheet* (mobile).
8. **Zero Regressão e Zero Migração de Saves:** A estrutura de dados persistida em `localStorage` sob a chave `campaign.progress` (versão 1) permanece inalterada. Todas as informações visuais são derivadas em tempo de execução do estado existente.

---

## 2. Escopo e Não Escopo

Para manter o foco estritamente na especificação e garantir a estabilidade do repositório, os limites da Fase 1 foram estabelecidos da seguinte forma:

### 2.1. Dentro do Escopo (Fase 1)
- Diagnóstico técnico detalhado do código-fonte da campanha (`campaign-view.js`, `campaign-manager.js`, `campaign-store.js`, `campaign-catalog.js`, `campaign-constants.js`, `campaign-trainer-visuals.js`, `campaign.css`).
- Mapeamento das dependências da home atual e contratos de apresentação.
- Avaliação da viabilidade e especificação da arquitetura visual híbrida (WebP + SVG + HTML/CSS).
- Distribuição e justificativa temática e ambiental dos 18 Mestres de Tipo em 3 regiões e 1 região de endgame.
- Especificação da identidade visual, paleta de cores, atmosfera e cenários das 4 regiões.
- Mapeamento dos fluxos de navegação, estados dos nós, painel de treinador, marcador dinâmico do jogador e comportamento do endgame.
- Diretrizes de responsividade (desktop, notebook, tablet, celular), acessibilidade e metas de performance mensuráveis.
- Modelo de dados declarativo estático para o catálogo do mapa (`JSON`/`JS`).
- Planejamento da estrutura técnica de arquivos para as fases subsequentes.
- Matriz de riscos do projeto com planos de contingência.
- Registro formal das decisões tomadas pelo responsável do projeto.

### 2.2. Fora do Escopo (Não Escopo Estrito da Fase 1)
- Nenhuma implementação ou alteração de código em JavaScript, HTML ou CSS de produção.
- Nenhuma alteração no motor de batalha (`BattleEngine`, `DamageCalculator`, `BattleAI`, etc.).
- Nenhuma alteração nas regras de recompensa ou no draft de 144 Pokémon.
- Nenhuma migração ou alteração de versão no schema de persistência (`campaign.progress`).
- Nenhum bloqueio sequencial nos 18 Mestres de Tipo.
- Nenhuma remoção dos cards atuais de produção antes da homologação da nova camada.
- Nenhuma geração de artes finais de cenário ou inclusão de arquivos binários no repositório.
- Nenhuma instalação de frameworks externos, transpiladores ou dependências npm em tempo de execução.
- Nenhum commit ou push no repositório Git.

---

## 3. Diagnóstico do Sistema Atual

A análise da implementação da campanha revelou um isolamento sólido entre a lógica de regras e a persistência, com a apresentação centralizada em módulos complementares:

```
┌────────────────────────────────────────────────────────┐
│               Camada de Armazenamento                  │
│       campaign-store.js (STORAGE_KEY, sanitize)       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Camada de Domínio                     │
│ campaign-constants.js | campaign-catalog.js            │
│ campaign-manager.js   | campaign-battle-coordinator.js │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Camada de Apresentação                  │
│       campaign-trainer-visuals.js (WebP Thumbs/PNG)    │
│       trainer-avatar-view.js      (renderTrainerAvatar)│
│       campaign-type-guide.js      (getTypeGuide)       │
│       campaign-view.js            (Renderização DOM)   │
└────────────────────────────────────────────────────────┘
```

### 3.1. Estado de Persistência (`campaign.progress`)
O estado da campanha é versionado (`VERSION = 1`) e sanitizado a cada carregamento por `CampaignStore.sanitize(raw)`. Suas propriedades são:
- `version`: Inteiro fixado em 1.
- `status`: Enum contendo `NOT_STARTED`, `ACTIVE`, `SUPER_AVAILABLE`, `SUPER_REWARD_PENDING`, `SHADOW_AVAILABLE`, `COMPLETED`.
- `startedAt`: String ISO do início da jornada.
- `startingRosterIds`: Array com exatamente 6 IDs do draft inicial.
- `challenges`: Dicionário indexado por `challengeId` (`master-{type}`), contendo `{ attempts, badgeEarned, rewardPokemonId, rewardBattleId }`.
- `superTrainer`: Objeto com `{ attempts, defeated, rewardPokemonId, rewardBattleId, victorySeen }`.
- `shadowTrainer`: Objeto com `{ revealed, revealSeen, reinforcementsSeen, attempts, defeated, battleId }`.
- `endgameTrials`: Dicionário contendo o progresso das 4 provas (`legendary`, `mythical`, `titans`, `celestial`), com `{ completed, rewardClaimed, rewardPokemonId, attempts }`.
- `pendingReward`: Objeto nulo ou ativo com `{ kind, challengeId, candidates }`.
- `processedBattleIds`: Array com histórico idempotente de batalhas (máx. 96).

### 3.2. Métricas Reais dos Assets Visuais Existentes
É fundamental distinguir entre a **dimensão intrínseca do arquivo-fonte**, a **dimensão visual de renderização em layout CSS** e o **peso em bytes no disco/rede**:

| Categoria do Asset | Arquivos / Formato | Dimensão Intrínseca do Arquivo | Dimensão de Renderização Visual (CSS) | Peso Real dos Arquivos no Projeto | Estratégia de Carregamento |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Thumbnails dos Mestres** | `assets/images/trainers/thumbs/*.webp` | Variada (otimizado para ícone) | `48×48 px` (tamanho `SMALL`) a `88×88 px` | **Aproximadamente 7,7 KB a 13,9 KB** cada | Carregamento imediato nos nós do mapa da região ativa. |
| **Retratos Grandes dos Mestres** | `assets/images/trainers/*.png` | **1086 a 1145 px (largura) × 1374 a 1448 px (altura)** | `144×144 px` (tamanho `LARGE` em layout) | **Aproximadamente 2,0 MB a 2,77 MB** cada | **Sob demanda exclusivamente:** carregado apenas quando o painel de detalhes do Mestre é aberto. |
| **Retratos dos Especiais** | `super-trainer.png` e `super-trainer-shadow.png` | ~1100 × 1400 px | `144×144 px` (layout) a `180×180 px` | **Aproximadamente 2,56 MB a 2,83 MB** cada | Sob demanda ao visualizar painel de boss ou preparação. |

> [!IMPORTANT]
> Os nós do mapa utilizam exclusivamente os thumbnails WebP leves. **Nunca carregar simultaneamente os retratos PNG grandes de 2+ MB na tela inicial do mapa**, pois 18 retratos causariam um payload desnecessário superior a 40 MB.

---

## 4. Dependências da Home Atual e Estratégia de Transição

O arquivo `assets/js/campaign/campaign-view.js` recebeu sucessivas extensões sobrepostas via protótipo para suportar a home atual baseada em cartões.

### 4.1. Mapeamento de Estruturas Existentes da Home
1. **Base da Home:** Hero com total de insígnias e elenco, grade de insígnias (`.badge-grid`), botões condicionais `#superChallenge` e `#shadowChallenge`, grade principal `.campaign-grid` com artigos `.master-card`, e botão `#campaignReset`.
2. **Avatares nos Cards:** Injeção de `renderTrainerAvatar(visual, 'MEDIUM', 'CIRCLE', 'CARD')` nos cards de mestres.
3. **Endgame Básico:** Injeção de `.campaign-endgame` antes de `.campaign-grid` contendo `.endgame-super` e `.endgame-trials`.
4. **Preview de Chefes (PBA-015F):** Injeção de `.opponent-team-preview--compact` no cabeçalho do Super Trainer.
5. **Quatro Provas de Elite (PBA-015G):** Renderização de artigos `.endgame-trial` para as 4 Provas (`LEGENDARY_TRIAL`, `MYTHICAL_TRIAL`, `TITANS_TRIAL`, `CELESTIAL_TRIAL`).
6. **Shadow Boss (PBA-015H):** Injeção de `.shadow-spotlight` com `#shadowSpotlight` e `.shadow-aura-callout`.
7. **Reforços de Final Stand (PBA-015I):** Injeção de `.shadow-reinforcement-count`.

### 4.2. Estratégia de Testes na Transição Arquitetural
Alguns testes automatizados realizavam validações pontuais por regex no código-fonte de `campaign-view.js`. A estratégia técnica aprovada para a Fase 2 define:
- **Preservação de Contratos e Comportamentos Reais:** O foco da suíte é validar que as regras, seleções, estados e preparações funcionem corretamente, e não manter artificialmente trechos de código morto.
- **Transição Limpa para Novos Módulos:** Quando trechos de apresentação forem legitimamente transferidos para `campaign-map-view.js` ou novos componentes, os testes estáticos associados devem ser atualizados para inspecionar os arquivos formalmente responsáveis.
- **Zero DOM Morto:** Não manter classes CSS ou elementos HTML obsoletos apenas para atender a testes textuais sem função de interface.
- **Nova Bateria de Testes:** Criação de testes unitários para o catálogo e modelo do mapa (`campaign-map.test.js`), testes comportamentais de estados e uso do *test harness* visual (`campaign-map-harness.html`) para validação de coordenadas e responsividade.

---

## 5. Arquitetura Visual Recomendada

Avaliou-se a viabilidade técnica da abordagem híbrida para a construção do mapa interativo:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Camada 4: Painel / Drawer                       │
│    Drawer Lateral / Bottom Sheet HTML com Detalhes do Treinador        │
├────────────────────────────────────────────────────────────────────────┤
│                        Camada 3: Nós Interativos                       │
│    Elementos <button class="campaign-node"> com posicionamento %      │
├────────────────────────────────────────────────────────────────────────┤
│                        Camada 2: Vetor de Conexões                     │
│    SVG ViewBox responsivo com <path> pontilhados e traçados dinâmicos │
├────────────────────────────────────────────────────────────────────────┤
│                        Camada 1: Cenário de Fundo                      │
│    Background WebP em Pixel Art (Orçamento: 80–140 KB por região)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Detalhamento Técnico das Camadas
- **Camada 1 — Cenário em Pixel Art (WebP):** Imagem de fundo em pixel art moderna, mantendo proporção 16:9 em container com `position: relative; overflow: hidden; width: 100%; aspect-ratio: 16/9;`.
- **Camada 2 — Vetor de Conexões (SVG):** Elemento `<svg viewBox="0 0 1000 562.5" preserveAspectRatio="none">` com `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;`. As trilhas usam elementos `<path d="..." class="campaign-route">` com `stroke-dasharray` para o efeito pontilhado, com traçado e cor dinâmicos conforme o estado de conclusão dos nós conectados.
- **Camada 3 — Nós Interativos (HTML Buttons):** Elementos `<button>` semânticos posicionados via coordenadas percentuais declarativas (`left: X%`, `top: Y%`, `transform: translate(-50%, -50%)`). Cada nó possui superfície própria semi-opaca para contraste garantido, incorpora o thumbnail WebP de 48px existente do treinador, borda temática do tipo e indicador visual de estado.
- **Camada 4 — Painel de Ações do Treinador (HTML):** Gaveta lateral (desktop) ou *bottom sheet* (mobile), aberta sob demanda ao acionar um nó, com guia de tipo compacto e botão de desafio/revanche.

---

## 6. Divisão Completa dos 18 Mestres por Região

Todos os 18 Mestres de Tipo foram categorizados e distribuídos em 3 regiões de 6 Mestres cada, respeitando a identidade ecológica e atmosférica consolidada no documento canônico [PBA_018_TYPE_ARENA_SYSTEM.md](PBA_018_TYPE_ARENA_SYSTEM.md).

### Tabela Mestra de Alocação dos 18 Mestres

| # | `challengeId` | Mestre | Tipo | Região | Bioma Sugerido | Posição no Mapa (`X%`, `Y%`) | Relação Visual com Vizinhos | Justificativa Temática e Balanceamento |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| 1 | `master-normal` | Aster | Normal | **Região 1** | Planície Serena / Platô Central | `(15%, 72%)` | Ponto inicial; conecta a Flora e Marina | Porta de entrada natural da campanha. Dificuldade 2★, bioma acolhedor de campos abertos. |
| 2 | `master-grass` | Flora | Planta | **Região 1** | Bosque Ancestral | `(28%, 44%)` | Conecta a Aster e Nilo | Transição ecológica das planícies abertas para a floresta densa e sombreada. |
| 3 | `master-bug` | Nilo | Inseto | **Região 1** | Bosque dos Esporos | `(20%, 22%)` | Conecta a Flora e Aero | Área de mata fechada com cogumelos luminescentes, na base das colinas ventosas. |
| 4 | `master-water` | Marina | Água | **Região 1** | Santuário das Marés / Enseada | `(52%, 80%)` | Conecta a Aster e Volt | Litoral e baía de águas calmas, criando contraste líquido com as planícies. |
| 5 | `master-electric` | Volt | Elétrico | **Região 1** | Colinas da Tempestade / Usina | `(74%, 56%)` | Conecta a Marina e Aero | Platô elevado com torres eólicas e tempestades magnéticas energéticas. |
| 6 | `master-flying` | Aero | Voador | **Região 1** | Picos dos Ventos / Falésias | `(86%, 24%)` | Conecta a Nilo e Volt; ponto de saída | Falésias monumentais acima das nuvens; serve como ponte geográfica para a Região 2. |
| 7 | `master-fighting`| Dante | Lutador | **Região 2** | Platô do Dojo Marcial | `(16%, 70%)` | Entrada da R2; conecta a Terra e Vesper | Base da serra rochosa; campo de treino de solo batido e lanternas marciais. |
| 8 | `master-ground` | Terra | Terrestre | **Região 2** | Cânion Terracota | `(42%, 82%)` | Conecta a Dante e Petra | Fissuras geológicas profundas e solo arenoso vermelho de grande calidez. |
| 9 | `master-poison` | Vesper | Venenoso | **Região 2** | Cisterna Alquímica / Pântano | `(18%, 34%)` | Conecta a Dante e Kael | Vale de efluentes minerais e vapores químicos borbulhantes na encosta. |
| 10 | `master-rock` | Petra | Pedra | **Região 2** | Pedreira Monolítica | `(72%, 76%)` | Conecta a Terra e Yara | Desfiladeiro escarpado com pilares monolíticos de granito e basalto maciço. |
| 11 | `master-fire` | Kael | Fogo | **Região 2** | Caldeira Vulcânica | `(46%, 28%)` | Conecta a Vesper, Petra e Yara | Cratera vulcânica ativa com rios de magma, coração térmico da cordilheira. |
| 12 | `master-ice` | Yara | Gelo | **Região 2** | Caverna Glacial / Pico Nevado | `(84%, 18%)` | Conecta a Kael e Petra; ponto de saída | Pico alpino perpetuamente congelado; contraste térmico máximo com o vulcão vizinho. |
| 13 | `master-fairy` | Lumi | Fada | **Região 3** | Clareira Encantada / Aurora | `(24%, 82%)` | Entrada da R3; conecta a Orion e Noctis | Limiar místico; bosque reluzente de flores luminescentes e cristais pastéis. |
| 14 | `master-psychic` | Orion | Psíquico | **Região 3** | Observatório Astral | `(18%, 40%)` | Conecta a Lumi e Nyra | Torre monumental com espelho cósmico e runas astrais flutuantes. |
| 15 | `master-dark` | Noctis | Sombrio | **Região 3** | Ruínas do Eclipse | `(60%, 72%)` | Conecta a Lumi e Ferrum | Vale crepuscular sob penumbra perpétua e arquitetura arruinada enigmática. |
| 16 | `master-ghost` | Nyra | Fantasma | **Região 3** | Mausoléu Espectral | `(36%, 18%)` | Conecta a Orion e Riven | Cripta gótica milenar envolta em névoa espectral violeta e lápides antigas. |
| 17 | `master-steel` | Ferrum | Aço | **Região 3** | Fortaleza Siderúrgica | `(82%, 54%)` | Conecta a Noctis e Riven | Bastião industrial monumental de ligas metálicas, forjas e vigas de ferro. |
| 18 | `master-dragon` | Riven | Dragão | **Região 3** | Santuário Dracônico | `(76%, 20%)` | Conecta a Nyra e Ferrum; clímax dos 18 | O pico mais sagrado da região; altar ancestral de dragões com braseiros dourados. |

---

## 7. Especificação das Regiões

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Região 1     │       │    Região 2     │       │    Região 3     │       │  Região Final   │
│ Planícies &     │ ───►  │ Fendas & Picos  │ ───►  │ Domínios        │ ───►  │ Pináculo do     │
│ Costas          │       │ Extremos        │       │ Arcanos         │       │ Endgame         │
│ (6 Mestres)     │       │ (6 Mestres)     │       │ (6 Mestres)     │       │ (Bosses/Trials) │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 7.1. Região 1: Planícies Verdejantes e Costas Elementais
- **Nome Provisório:** *Costa das Brisas e Prados Primordiais*
- **Tema:** Natureza acolhedora, ecossistemas vivos e forças elementais clássicas.
- **Paleta de Cores:** Verdes esmeralda (`#48bb78`), azuis cerúleos (`#4299e1`), ambar dourado (`#ecc94b`) e cinzas suaves (`#a0aec0`).
- **Biomas em Pixel Art:** Prados abertos, floresta temperada, pântano botânico com esporos, estuário marinho, colinas eólicas e falésias marítimas.
- **Atmosfera:** Convidativa, límpida e luminosa.
- **Nós Contidos (6):** Aster (Normal), Flora (Planta), Nilo (Inseto), Marina (Água), Volt (Elétrico), Aero (Voador).
- **Ponto Inicial:** Vale de Aster `(15%, 72%)`. Ponto de Saída: Ninho das Falésias de Aero `(86%, 24%)`.

### 7.2. Região 2: Fendas Vulcânicas e Picos Extremos
- **Nome Provisório:** *Cordilheira das Fendas e Picos Elementais*
- **Tema:** Força física telúrica, desafios geológicos severos e contrastes térmicos extremos.
- **Paleta de Cores:** Terracota e ocre (`#c05621`), vermelho magma (`#e53e3e`), cinza basalto (`#4a5568`), roxo tóxico (`#805ad5`) e ciano glacial (`#76e4f7`).
- **Biomas em Pixel Art:** Desfiladeiro árido de arenito, caldeira vulcânica com fluxo de lava, pedreira de monólitos, brejo químico subterrâneo e geleira de altitude.
- **Atmosfera:** Árdua, imponente, perigosa e geologicamente ativa.
- **Nós Contidos (6):** Dante (Lutador), Terra (Terrestre), Vesper (Venenoso), Petra (Pedra), Kael (Fogo), Yara (Gelo).
- **Ponto Inicial:** Dojo de Dante `(16%, 70%)`. Ponto de Saída: Glaciar de Yara `(84%, 18%)`.

### 7.3. Região 3: Domínios Arcanos e Fortalezas do Crepúsculo
- **Nome Provisório:** *Terras Místicas e Fortaleza do Véu*
- **Tema:** Magia antiga, forças cósmicas, engenharia pesada e mistérios ancestrais.
- **Paleta de Cores:** Índigo profundo (`#2a4365`), magenta crepuscular (`#b83280`), prata metálica (`#cbd5e0`), violeta espectral (`#6b46c1`) e azul dragão real (`#3182ce`).
- **Biomas em Pixel Art:** Bosque de aurora, observatório sobre abismo, ruínas sob eclipse lunar, mausoléu gótico, usina siderúrgica e santuário no cume dracônico.
- **Atmosfera:** Misteriosa, solene, monumental e esotérica.
- **Nós Contidos (6):** Lumi (Fada), Orion (Psíquico), Noctis (Sombrio), Nyra (Fantasma), Ferrum (Aço), Riven (Dragão).
- **Ponto Inicial:** Clareira de Lumi `(24%, 82%)`. Ponto de Saída: Altar de Riven `(76%, 20%)`.

### 7.4. Região Final: Pináculo do Circuito e Fenda Dimensional (Endgame)
- **Nome Provisório:** *Apex Summit: Pináculo dos Campeões*
- **Tema:** O teste supremo do treinador; santuários lendários e o colapso do espaço-tempo.
- **Paleta de Cores:** Ouro nobre (`#d4af37`), mármore etéreo (`#edf2f7`), púrpura abissal (`#44337a`), safira cósmica (`#2b6cb0`) e preto vácuo (`#171923`).
- **Biomas em Pixel Art:** Quatro altares celestes circundando a arena de mármore do campeão, com a fenda dimensional no centro.
- **Nós Contidos (6):**
  1. *Prova Lendária* `(20%, 70%)` — Santuário das Lendas (Zapdos, Suicune, Latios).
  2. *Prova Mítica* `(80%, 70%)` — Santuário Mítico (Mew, Jirachi, Victini).
  3. *Prova dos Titãs* `(22%, 36%)` — Arena dos Titãs (Koraidon, Groudon, Yveltal).
  4. *Prova Celestial* `(78%, 36%)` — Templo Celestial (Zamazenta, Solgaleo, Giratina).
  5. *Super Trainer* `(50%, 28%)` — Arena do Campeão (Arceus, Eternatus, Mewtwo).
  6. *Shadow Super Trainer* `(50%, 12%)` — Trono do Eclipse (Anomalia Sombria revelada).

---

## 8. Fluxo de Navegação e Ciclo de Vida da Interface

```
[Aba Campanha] ──► [Verificação de Estado]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[pendingReward Existe?]          [Campanha Iniciada?]
  ├── SIM: Exibe Tela Recompensa   ├── NÃO: Exibe Tela de Draft
  └── NÃO: Continua Avaliação      └── SIM: Verifica status
             │
             ├── status === 'COMPLETED' ──► Exibe Tela renderComplete()
             └── status !== 'COMPLETED' ──► Renderiza Mapa da Região Ativa
                   │
                   ├── Alternar Aba no Topo ──► Muda Região (R1, R2, R3 ou Final)
                   ├── Clique em Nó de Desafio ──► Abre Painel do Treinador (Drawer)
                   │                                │
                   │                                ├── Fechar / ESC ──► Fecha Painel
                   │                                └── Clicar em "Desafiar" ──► Abre Preparação (Picker)
                   │                                                                 │
                   │                                                                 ├── Voltar ──► Retorna ao Mapa
                   │                                                                 └── Iniciar ──► Transição para Arena
                   │
                   └── Derrota ou Revanche ──► Retorna ao Mapa Atualizado
```

### 8.1. Detalhamento dos Passos de Navegação
1. **Entrada na Campanha:** Ao selecionar a aba "Campanha", o método central `render()` avalia as condições canônicas em ordem de prioridade:
   - Se `!isStarted()`, renderiza o draft inicial (`renderDraft`).
   - Se `pendingReward` existir, renderiza obrigatoriamente a tela de recompensa (`renderReward`), sem exibir o mapa.
   - Se `status === 'COMPLETED'`, renderiza a tela final canônica (`renderComplete`), sem abrir o mapa automaticamente.
   - Caso contrário, renderiza a home com o novo mapa interativo.
2. **Navegação entre Regiões (Abas no Topo):**
   - Implementada com semântica de abas (`role="tablist"` e `role="tab"`).
   - Abas disponíveis: `Região 1`, `Região 2`, `Região 3` e `Região Final`.
   - Cada aba exibe o nome curto e o contador de progresso (ex: `Região 1 (4/6)`).
   - A aba da Região Final exibe `Bloqueada (X/18)` enquanto o jogador tiver menos de 18 insígnias. Uma tentativa de clique em aba bloqueada fornece aviso textual claro via região `aria-live`, sem dependência de áudio.
3. **Seleção de Nós:** Clicar ou acionar via teclado em qualquer nó disponível abre o Painel do Treinador.
4. **Fechamento e Foco:** O painel pode ser fechado via tecla `Escape`, botão de fechar (`×`) ou clique fora. Ao fechar, o foco do teclado retorna ao nó correspondente.
5. **Iniciação de Batalha:** O botão "Desafiar" ou "Revanche" abre a tela canônica de preparação (`renderPicker()`).
6. **Retorno do Picker:** Clicar em "← Voltar" na preparação restaura o mapa da região ativa mantendo o foco acessível.
7. **Prioridade de Recompensa Pendente:** Se o jogador derrotar um Mestre e recarregar a página antes de resgatar o recruta, `pendingReward` continua tendo prioridade sobre a exibição da home, garantindo que o fluxo canônico de recompensas seja respeitado.

---

## 9. Estados dos Nós

Nenhum estado depende exclusivamente de cor. Cada nó combina cor de fundo, cor de borda, ícones vetoriais distintos e atributos semânticos ARIA para leitura visual inequívoca.

### Matriz Completa de Estados

| Estado | Tratamento Visual | Ícone | Texto Acessível (ARIA) | Comportamento ao Acionar | Animação Padrão | Comportamento em `prefers-reduced-motion` |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Disponível (Não Derrotado)** | Borda sólida avermelhada com sutil realce; superfície de contraste semi-opaca. | ⚔️ / ⚡ | *"Mestre [Nome], [Tipo]. Desafio aberto. Não derrotado."* | Abre painel do treinador com botão "Desafiar". | Pulso sutil de escala (1.0 a 1.04 a cada 2.5s). | Sem pulso; apenas contorno nítido estático. |
| **Em Foco pelo Teclado** | Contorno duplo visível de alto contraste (anel dourado interno de 2px, ciano externo de 2px). | Mantém | *"Focado: [Nome do Treinador]"* | Abre painel do treinador. | Sem animação; apenas anel nítido. | Mantém anel nítido idêntico. |
| **Hover (Mouse)** | Elevação vertical sutil e acentuação da cor do tipo. | Mantém | Inalterado | Abre painel do treinador. | Transição suave de transform (`translateY(-3px)`). | Sem transição; deslocamento nulo. |
| **Selecionado (Ativo)** | Anel de destaque fixo ao redor do nó ativo. | 🎯 | *"Mestre [Nome] selecionado. Painel de detalhes ativo."* | Mantém o painel aberto sem recarregar. | Brilho estático de borda. | Brilho estático idêntico. |
| **Mestre Derrotado (Concluído)** | Borda dourada nobre, thumbnail nítido, selo de insígnia conquistada visível. | 🏆 / ✦ | *"Mestre [Nome], [Tipo]. Insígnia conquistada. Derrotado."* | Abre painel do treinador com botão "Revanche". | Halo dourado estático. | Estático. |
| **Revanche Disponível** | Idêntico ao derrotado, com selo de revanche no canto. | 🔄 | *"Mestre [Nome]. Revanche disponível."* | Abre painel do treinador com ação de revanche. | Rotação suave do ícone no hover. | Rotação suprimida. |
| **Desafio Especial Bloqueado** | Silhueta com opacidade reduzida (50%), thumbnail em tons de cinza. | 🔒 | *"Prova Especial [Nome]. Bloqueada. Requer 18 insígnias."* | Não interativo enquanto a Região Final estiver bloqueada. | Estático sem pulso. | Estático. |
| **Desafio Especial Disponível** | Borda azul-safira mística com glifo lendário. | ✧ | *"Prova Especial [Nome] disponível. Dificuldade: Alta."* | Abre painel da prova especial com prévia da equipe. | Ondulação suave de luz. | Iluminação estática. |
| **Prova Concluída** | Borda estelar dourada, ícone de check com selo de aliado recrutado. | ✓ | *"Prova Especial [Nome] concluída. Aliado recrutado."* | Abre painel permitindo reenfrentar a prova. | Sem animação. | Sem animação. |
| **Super Trainer Disponível** | Borda dourada monumental, retrato estilizado reluzente. | 👑 | *"Desafio Final: Super Trainer disponível. Dificuldade: Extrema."* | Abre painel de combate contra o Super Trainer. | Brilho dourado contínuo. | Borda dourada estática. |
| **Shadow Trainer Oculto** | O nó não é renderizado no mapa; espaço vazio. | — | Oculto para tecnologias assistivas. | Nenhuma interação possível. | Nenhuma. | Nenhuma. |
| **Shadow Trainer Revelado** | Vórtice púrpura sombrio com fenda de anomalia ativa. | 👁️ / 💀 | *"Anomalia Detectada: Shadow Super Trainer ativo. Desafio Final."* | Abre preparação para o Final Stand. | Pulso sombrio estável. | Borda violeta estática. |
| **Fallback Defensivo (Recompensa)** | Borda pontilhada de atenção. | 🎁 | *"Atenção: Recompensa pendente."* | Estado defensivo interno caso a guarda de renderização falhe. | Pulso de atenção. | Estático. |

---

## 10. Especificação do Painel do Treinador

Ao selecionar um nó, os detalhes do combate abrem-se em um painel contextual sem remover o mapa da visualização no desktop:

```
┌──────────────────────────────────────────────┐
│  [×] FECHAR                                  │
│                                              │
│  ┌──────────────────┐                        │
│  │                  │  Dante                 │
│  │   RETRATO PNG    │  Mestre da Vanguarda   │
│  │   (Sob demanda)  │  🥊 TIPO LUTADOR       │
│  │ (144 px no CSS)  │                        │
│  └──────────────────┘  ★ ★ ★ ★ ☆             │
│                                              │
│  INSÍGNIA DO PUNHO                           │
│  Estado: Conquistada [🏆 DERROTADO]          │
│  Tentativas registradas: 1                   │
│                                              │
│  EQUIPE ADVERSÁRIA (3 Pokémon)               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Machamp │ │ Breloom │ │Hawlucha │         │
│  └─────────┘ └─────────┘ └─────────┘         │
│                                              │
│  GUIA DE TIPO COMPACTO                       │
│  • Tipo: Lutador                             │
│  • Vantagem ofensiva (2×): Normal, Pedra,    │
│    Aço, Gelo                                 │
│  • Fraqueza defensiva (2×): Voador,          │
│    Psíquico, Fada                            │
│  • Nota: Tipos secundários podem alterar     │
│    essas relações.                           │
│  [ + Ver detalhes completos ]                │
│                                              │
│  [  🔄 INICIAR REVANCHE / ⚡ DESAFIAR  ]      │
└──────────────────────────────────────────────┘
```

### 10.1. Conteúdo e Recursos
1. **Retrato de Alta Resolução Carregado Sob Demanda:** O arquivo PNG grande (com resolução original entre 1086×1374 e 1145×1448 pixels e peso de 2,0 a 2,77 MB) é carregado na rede **exclusivamente quando este painel for aberto**, sendo renderizado com dimensões de layout de 144 pixels no CSS (`size: 'LARGE'`).
2. **Identificação e Título:** Nome do Treinador (*Dante*), Título Oficial (*Mestre da Vanguarda*) e tag com nome e ícone em português (*🥊 Lutador*).
3. **Insígnia e Dificuldade:** Nome da Insígnia (*Insígnia do Punho*), indicador de estado (*Pendente* ou *Conquistada*) e dificuldade em estrelas (2★ a 5★).
4. **Histórico:** Tentativas registradas (`challenges[id].attempts`).
5. **Prévia da Equipe Adversária:** Três Pokémon da equipe com sprites de PokéAPI, nomes e tipos.
6. **Guia de Tipo Compacto:**
   - Resumo objetivo: tipo principal, alvos ofensivos 2× e fraquezas defensivas 2×.
   - Aviso obrigatório: *"Tipos secundários podem alterar essas relações."*
   - Controle opcional para expandir/recolher notas adicionais.
   - O guia completo detalhado continua disponível na tela de preparação (picker).
7. **Botão de Ação:** "Desafiar" (se invicto) ou "Iniciar Revanche" (se já derrotado).
8. **Fechamento e Acessibilidade:** Botão `×`, tecla `Escape` e fechamento ao clicar fora. Ao fechar, o foco retorna ao nó de origem.

---

## 11. Estratégia do Marcador do Jogador

A campanha não grava coordenadas físicas no save. O marcador é puramente dinâmico e não impõe ordem obrigatória:

1. **Cursor de Seleção Ativa:** Um anel com realce sutil posiciona-se sobre o nó selecionado no momento.
2. **Recomendação Dinâmica de Próximo Desafio:**
   - Calculada em tempo de execução no *view model* (`campaign-map-model.js`), identificando o primeiro Mestre ainda não derrotado ordenado por menor dificuldade e ordem canônica de catálogo como desempate.
   - O catálogo estático **não** contém campos como `recommendedNext: true`.
   - Se o Mestre recomendado estiver em outra região, a aba superior correspondente recebe um marcador discreto (ex: ponto dourado), sem forçar a mudança automática de região.
3. **Legenda Educativa:** O cabeçalho exibe a mensagem:
   > *"Você possui liberdade total para escolher qualquer desafio disponível. A indicação 'Sugerido' é apenas uma recomendação de rota."*

---

## 12. Comportamento do Endgame (Bosses e Provas Especiais)

```
                  ┌───────────────────────────────┐
                  │    SHADOW SUPER TRAINER       │
                  │   (Anomalia Revelada)         │
                  └──────────────┬────────────────┘
                                 │
                  ┌──────────────▼────────────────┐
                  │        SUPER TRAINER          │
                  │    (Desbloqueado com 18 ★)    │
                  └──────────────┬────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│ PROVA LENDÁRIA│        │ PROVA MÍTICA  │        │PROVA DOS TITÃS│ ... (Prova Celestial)
└───────────────┘        └───────────────┘        └───────────────┘
```

1. **Bloqueio e Desbloqueio da Região Final:**
   - Com 0 a 17 insígnias, a aba da Região Final exibe `Bloqueada (X/18 Insígnias)` e seus nós não estão acessíveis.
   - Ao atingir 18 insígnias, a aba é desbloqueada e as 4 Provas Especiais tornam-se jogáveis para expandir o elenco.
2. **Super Trainer:**
   - Fica ativo quando o jogador possui 18 insígnias e elenco ≥ 24 Pokémon.
   - Ao ser derrotado: transita para `SUPER_REWARD_PENDING`, exibe o diálogo de Campeão do Circuito e concede o recruta de elite (Arceus, Eternatus ou Mewtwo).
3. **Shadow Super Trainer:**
   - Permanece oculto até o recruta do Super Trainer ser confirmado.
   - Com `status === 'SHADOW_AVAILABLE'`, o evento de revelação dispara o modal *"ANOMALIA DETECTADA — SHADOW SUPER TRAINER"*, seguido pelos reforços do Final Stand (`getShadowGuests()`).
   - No mapa, o cume da Região Final revela o nó de Shadow, que aciona a preparação especial com seleção de 1 líder para o exército.
4. **Campanha 100% Concluída:**
   - Com `status === 'COMPLETED'`, o método canônico `render()` direciona prioritariamente para `renderComplete()`, exibindo o resumo de tentativas e a opção de resetar a campanha. O mapa não é aberto automaticamente nesse estado.

---

## 13. Responsividade e Adaptação a Telas

| Dispositivo / Viewport | Resolução | Tratamento do Mapa | Dimensões do Nó | Painel do Treinador |
| :--- | :--- | :--- | :---: | :--- |
| **Desktop Largo** | ≥ 1200px | Proporção 16:9 widescreen (`max-width: 1180px`). | `56×56 px` | Drawer lateral direito de `380px`. |
| **Notebook** | 992px a 1199px | Proporção 16:9 ajustada com margens seguras. | `52×52 px` | Drawer lateral direito compacto de `320px`. |
| **Tablet** | 768px a 991px | Ocupando 100% da largura. | `48×48 px` | Bottom sheet de 60% da altura da viewport. |
| **Celular em Retrato** | < 560px | Mapa 16:9 com largura mínima de 560px e rolagem horizontal suave. | `46×46 px` (área de toque 48×48) | Bottom sheet expansível cobrindo até 80% da tela. |
| **Celular em Paisagem** | Altura < 500px | Mapa adaptado à altura disponível com controles compactos. | `44×44 px` | Drawer lateral fino de `280px`. |

### Diretrizes de Usabilidade Móvel
- **Padrão:** O mapa abre por padrão também no celular. Quando o mapa for maior que a tela, há rolagem horizontal controlada com indicativo visual (sombreamento nas bordas) e textual de que há conteúdo adicional a explorar.
- **Botão "Ver como lista":** Posicionado no cabeçalho com fácil acesso por toque.
- **Modo Lista Alternativo:** Lista vertical completa que permite inspecionar detalhes, abrir guia e iniciar desafios com todas as ações do mapa. A preferência Mapa/Lista é mantida apenas em memória de sessão e não modifica `campaign.progress`.

---

## 14. Metas de Acessibilidade Verificáveis

A acessibilidade é tratada como um conjunto de requisitos técnicos auditáveis:

1. **Meta Obrigatória de Conformidade:** Atendimento estrito às diretrizes **WCAG 2.1 nível AA**. Critérios de nível AAA serão adotados apenas quando comprovados e medidos individualmente.
2. **Semântica HTML Nativa:** Nós implementados como botões `<button>` padrão, sem adicionar `tabindex="0"` redundante.
3. **Abas de Região Acessíveis:** As abas utilizam semântica apropriada com `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` e `aria-controls`, com suporte a navegação por setas e ativação por teclado.
4. **Contraste de Nós Previsível:** Cada nó utiliza uma superfície própria semi-opaca sob o thumbnail para garantir contraste estável com o fundo em pixel art, medido para atender à proporção mínima de 4.5:1 para texto e 3:1 para elementos de controle.
5. **Rótulos Descritivos ARIA:** Cada nó possui `aria-label` completo descrevendo nome, tipo, insígnia, dificuldade e status atual.
6. **Controle por Teclado e Foco:** Anel visível de foco via `:focus-visible`. Tecla `Escape` fecha o painel e devolve o foco ao nó de origem.
7. **Suporte a `prefers-reduced-motion: reduce`:** Desativação de animações de pulso, balanços e transições de hover para usuários com sensibilidade motora ou vestibular.
8. **Modo Alternativo em Lista:** Visualização linear acessível para quem prefere navegar sem a representação espacial do mapa.

---

## 15. Metas de Performance Mensuráveis

Em vez de afirmações prévias não medidas, estabelecem-se metas claras a serem auditadas no protótipo da Fase 2:

1. **Orçamento Preliminar de Fundos:** Cada imagem de fundo em pixel art das 4 regiões terá um orçamento preliminar de **80 KB a 140 KB**, totalizando um payload adicional estimado de **320 KB a 560 KB** para todos os cenários de mapa, a ser validado após a geração das artes.
2. **Mitigação de Layout Shift:** Declarar dimensões e proporção explícita (`aspect-ratio: 16/9; width: 100%;`) para conter o Cumulative Layout Shift (meta: CLS < 0.1).
3. **Carregamento Inicial Enxuto:** Carregar imediatamente apenas a imagem de fundo da região ativa. As demais regiões utilizam carregamento sob demanda ou `loading="lazy"`.
4. **Reuso de Thumbnails Leves:** Os nós utilizam os thumbnails WebP já existentes de 48px (~7,7 KB a 13,9 KB).
5. **Retratos Grandes Sob Demanda:** Os retratos PNG grandes de alta resolução (2,0 MB a 2,77 MB) são carregados unicamente sob demanda na abertura do painel do treinador.
6. **Métricas a Serem Validadas na Fase 2:** Medição de LCP, CLS, consumo de memória e fluidez de interação em desktop e dispositivos móveis, ajustando a compressão dos assets com base em dados reais.

---

## 16. Compatibilidade com Saves Existentes

Todas as informações necessárias para renderizar o mapa são derivadas em tempo de execução do schema existente:

| Informação Visual no Mapa | Propriedade no Save (`campaign.progress`) | Derivação em Tempo de Execução |
| :--- | :--- | :--- |
| **Campanha Iniciada** | `startingRosterIds` | `startingRosterIds.length === 6` |
| **Mestre Derrotado / Concluído** | `challenges[id].badgeEarned` | Booleano `true` indica vitória registrada. |
| **Revanche Disponível** | `challenges[id].badgeEarned` | Booleano `true` habilita o botão de revanche. |
| **Tentativas contra Mestre** | `challenges[id].attempts` | Total de partidas disputadas contra o Mestre. |
| **Recruta do Mestre** | `challenges[id].rewardPokemonId` | ID do Pokémon recrutado. |
| **Prioridade de Recompensa** | `pendingReward` | Se ativo, substitui a home pela tela de recompensa. |
| **Acesso ao Endgame** | Contagem de `badgeEarned` | 18 insígnias conquistadas liberam a aba da Região Final. |
| **Estado das 4 Provas** | `endgameTrials[key]` | Dados de conclusão e recompensa de cada prova. |
| **Super Trainer Disponível** | `superTrainer.defeated` e Elenco | Requer 18 insígnias, elenco ≥ 24 e `!superTrainer.defeated`. |
| **Vitória do Super Vista** | `superTrainer.victorySeen` | Exibe diálogo de campeão se falso após vitória. |
| **Shadow Trainer Revelado** | `shadowTrainer.revealed` e `revealSeen` | Define visibilidade do nó e exibição do modal de anomalia. |
| **Reforços de Final Stand** | `shadowTrainer.reinforcementsSeen` | Define se o evento narrativo já foi exibido. |
| **Campanha Concluída** | `status` | Se `status === 'COMPLETED'`, aciona `renderComplete()`. |

- O schema de persistência permanece inalterado em `VERSION = 1`.
- Saves existentes continuam 100% compatíveis sem qualquer rotina de migração.

---

## 17. Modelo Declarativo Proposto

O catálogo estático descreve a geometria e os metadados fixos do mapa, sem dados dinâmicos de progressão ou recomendações calculadas:

```javascript
/**
 * Modelo Declarativo Estático do Catálogo de Mapas de Campanha
 * Arquivo: assets/js/campaign/campaign-map-catalog.js
 */
const CAMPAIGN_MAP_CATALOG = Object.freeze({
  regions: [
    {
      id: 'region-1',
      name: 'Planícies & Costas',
      subtitle: 'Costa das Brisas e Prados Primordiais',
      bgImage: 'assets/images/campaign/maps/region-1-vales.webp',
      themeClass: 'theme-region-verdant',
      unlockCondition: { kind: 'ALWAYS' },
      routes: [
        { from: 'master-normal', to: 'master-grass', pathD: 'M 150 405 C 200 350, 240 300, 280 248' },
        { from: 'master-grass', to: 'master-bug', pathD: 'M 280 248 C 260 180, 230 150, 200 124' },
        { from: 'master-normal', to: 'master-water', pathD: 'M 150 405 C 280 460, 420 465, 520 450' },
        { from: 'master-water', to: 'master-electric', pathD: 'M 520 450 C 600 440, 680 380, 740 315' },
        { from: 'master-electric', to: 'master-flying', pathD: 'M 740 315 C 780 250, 820 190, 860 135' },
        { from: 'master-bug', to: 'master-flying', pathD: 'M 200 124 C 400 80, 650 90, 860 135' }
      ],
      nodes: [
        {
          nodeId: 'node-normal',
          challengeKind: 'MASTER',
          challengeId: 'master-normal',
          type: 'normal',
          position: { x: 15.0, y: 72.0 },
          biomeLabel: 'Planície Serena'
        },
        {
          nodeId: 'node-grass',
          challengeKind: 'MASTER',
          challengeId: 'master-grass',
          type: 'grass',
          position: { x: 28.0, y: 44.0 },
          biomeLabel: 'Bosque Ancestral'
        },
        {
          nodeId: 'node-bug',
          challengeKind: 'MASTER',
          challengeId: 'master-bug',
          type: 'bug',
          position: { x: 20.0, y: 22.0 },
          biomeLabel: 'Bosque dos Esporos'
        },
        {
          nodeId: 'node-water',
          challengeKind: 'MASTER',
          challengeId: 'master-water',
          type: 'water',
          position: { x: 52.0, y: 80.0 },
          biomeLabel: 'Santuário das Marés'
        },
        {
          nodeId: 'node-electric',
          challengeKind: 'MASTER',
          challengeId: 'master-electric',
          type: 'electric',
          position: { x: 74.0, y: 56.0 },
          biomeLabel: 'Colinas da Tempestade'
        },
        {
          nodeId: 'node-flying',
          challengeKind: 'MASTER',
          challengeId: 'master-flying',
          type: 'flying',
          position: { x: 86.0, y: 24.0 },
          biomeLabel: 'Picos dos Ventos'
        }
      ]
    },
    {
      id: 'region-2',
      name: 'Fendas & Picos',
      subtitle: 'Cordilheira das Fendas e Picos Elementais',
      bgImage: 'assets/images/campaign/maps/region-2-fendas.webp',
      themeClass: 'theme-region-crags',
      unlockCondition: { kind: 'ALWAYS' },
      routes: [ /* Definições SVG e nós da Região 2 */ ],
      nodes: [ /* Dante, Terra, Vesper, Petra, Kael, Yara */ ]
    },
    {
      id: 'region-3',
      name: 'Domínios Arcanos',
      subtitle: 'Terras Místicas e Fortaleza do Véu',
      bgImage: 'assets/images/campaign/maps/region-3-arcanas.webp',
      themeClass: 'theme-region-arcane',
      unlockCondition: { kind: 'ALWAYS' },
      routes: [ /* Definições SVG e nós da Região 3 */ ],
      nodes: [ /* Lumi, Orion, Noctis, Nyra, Ferrum, Riven */ ]
    },
    {
      id: 'region-endgame',
      name: 'Pináculo do Circuito',
      subtitle: 'Apex Summit: Trono dos Campeões',
      bgImage: 'assets/images/campaign/maps/region-endgame.webp',
      themeClass: 'theme-region-endgame',
      unlockCondition: { kind: 'BADGE_COUNT', count: 18 },
      routes: [ /* Rotas conectando altares ao pináculo central */ ],
      nodes: [
        /* Provas: Legendary, Mythical, Titans, Celestial */
        /* Bosses: Super Trainer, Shadow Super Trainer */
      ]
    }
  ]
});
```

---

## 18. Estrutura Técnica de Arquivos para as Próximas Fases

1. **`assets/js/campaign/campaign-map-catalog.js`:** Declaração pura dos dados das 4 regiões, nós e caminhos SVG.
2. **`assets/js/campaign/campaign-map-model.js`:** Lógica de apresentação do mapa, derivação dinâmica de estados e cálculo do Mestre recomendado.
3. **`assets/js/campaign/campaign-map-view.js`:** Renderização do DOM do mapa, nós, abas, gaveta lateral e eventos.
4. **`assets/css/campaign-map.css`:** Folha de estilos modular para o mapa, nós e painéis.
5. **`assets/images/campaign/maps/`:** Diretório para os cenários WebP em pixel art das 4 regiões.
6. **`tests/campaign/campaign-map.test.js`:** Testes automatizados do catálogo e modelo do mapa.
7. **`tests/visual/campaign-map-harness.html`:** Página isolada para calibração visual e responsiva.

---

## 19. Matriz de Riscos e Planos de Contingência

| # | Risco Identificado | Probabilidade | Impacto | Plano de Mitigação | Fase de Resolução |
| :-: | :--- | :---: | :---: | :--- | :---: |
| 1 | **Dependências acumuladas em `campaign-view.js`** | Alta | Alto | Encapsular a nova lógica no módulo independente `campaign-map-view.js`. | Fase 2 |
| 2 | **Quebra de testes estáticos legados** | Alta | Médio | Atualizar testes para verificar os novos arquivos responsáveis sem manter código morto. | Fase 2 |
| 3 | **Congestionamento visual com 18 Mestres** | Alta | Médio | Distribuir os Mestres em 3 regiões de 6 nós com abas superiores de navegação. | Fase 1 e 2 |
| 4 | **Dificuldade de toque em celulares** | Média | Alto | Viewport com rolagem horizontal controlada, área de toque mínima de 44×44px e Modo Lista. | Fase 2 |
| 5 | **Assets de fundo pesados** | Média | Médio | Orçamento preliminar de 80–140 KB por fundo WebP e lazy loading de regiões inativas. | Fase 3 |
| 6 | **Inconsistência artística nos cenários** | Média | Médio | Guia de estilo de pixel art com paleta e resolução alinhadas. | Fase 3 |
| 7 | **Falsa impressão de rota obrigatória** | Alta | Alto | Legenda explícita no cabeçalho e ausência de bloqueios em Mestres invictos. | Fase 1 e 2 |
| 8 | **Uso exclusivo de cor para estados** | Média | Alto | Combinação obrigatória de ícones, textos e atributos ARIA em cada nó. | Fase 1 e 2 |
| 9 | **Incompatibilidade com saves antigos** | Baixa | Crítico | Manter `VERSION = 1` e derivar todos os dados visuais em tempo de execução. | Fase 1 |
| 10 | **Regressão na prioridade de `pendingReward`** | Baixa | Alto | A guarda de recompensa pendente continua precedendo a renderização da home. | Fase 2 |
| 11 | **Problemas de Propriedade Intelectual** | Média | Crítico | Cenários originais sem cópia de assets protegidos de Pokémon/Nintendo. | Fase 3 |
| 12 | **Calibração de coordenadas em tela** | Média | Baixo | Uso da bancada de testes visual isolada (`campaign-map-harness.html`). | Fase 2 |

---

## 20. Critérios de Aceitação da Fase 1

- [x] **18 Mestres Alocados:** Todos os 18 Mestres distribuídos exatamente uma vez com região, bioma e coordenadas preliminares.
- [x] **Endgame Integrado:** 4 Provas, Super Trainer e Shadow Super Trainer devidamente posicionados e especificados.
- [x] **Liberdade de Escolha Garantida:** Sem bloqueios sequenciais nos 18 Mestres.
- [x] **Arquitetura Homologada:** Abordagem híbrida WebP + SVG + HTML sem Canvas e sem frameworks.
- [x] **Compatibilidade com Saves:** Schema `campaign.progress` v1 preservado sem migrações.
- [x] **Estados Intermediários Cobertos:** Draft, 0 a 18 insígnias, recompensas pendentes, Final Stand e conclusão.
- [x] **Plano Mobile Definido:** Mapa como padrão com rolagem controlada e Modo Lista alternativo completo.
- [x] **Metas de Acessibilidade:** WCAG 2.1 nível AA como meta verificável.
- [x] **Metas de Performance:** Orçamento preliminar de fundos e estratégias de medição no protótipo.
- [x] **Nenhum Código Alterado:** Exclusivamente documental; suíte de testes permanece com 100% de aprovação.

---

## 21. Decisões Aprovadas pelo Responsável do Projeto

As quatro decisões estratégicas foram aprovadas pelo responsável do projeto e são consideradas definitivas para as próximas fases:

1. **Estilo Artístico dos Mapas:**
   - **Decisão Aprovada: Pixel Art Moderna Original.**
   - Inspirada na era 32-bit (GBA/DS), com cenários ricos em biomas e composição 100% original, sem copiar assets da Nintendo, Game Freak ou Pokémon Company.
   - Os retratos modernos dos treinadores permanecem nos nós e no painel como escolha deliberada de contraste visual.
2. **Navegação entre Regiões:**
   - **Decisão Aprovada: Abas de Navegação no Topo.**
   - Abas representando Região 1, Região 2, Região 3 e Região Final (`role="tablist"` / `role="tab"`), com contador de progresso e estado de bloqueio.
   - Reforça a não-linearidade das 3 regiões principais disponíveis desde o início.
3. **Guia de Tipo:**
   - **Decisão Aprovada: Guia de Tipo Integrado e Compacto no Painel.**
   - Resumo com tipo principal, vantagens ofensivas 2×, fraquezas defensivas 2×, aviso sobre tipos secundários e controle retrátil opcional.
   - O guia detalhado completo permanece presente na tela de preparação de equipe (picker).
4. **Comportamento Padrão em Dispositivos Móveis:**
   - **Decisão Aprovada: Mapa como Padrão com Modo Lista Alternativo Completo.**
   - O mapa abre por padrão também no mobile, com rolagem horizontal e indicativo de conteúdo excedente.
   - Botão "Ver como lista" destacado para acesso ao Modo Lista com paridade funcional total. Preferência mantida em sessão sem alterar `campaign.progress`.

### Questões Remanescentes para Fases Futuras
- **Modo de Visita Pós-Campanha:** Avaliar futuramente se, após o True Ending (`renderComplete`), será oferecida uma opção "Explorar Mapa Concluído" para reenfrentar Mestres livremente sem resetar a campanha. Essa funcionalidade requer decisão de produto específica e não faz parte da Fase 2.

---

## 22. Recomendação para a Fase 2

Com a Fase 1 aprovada, recomenda-se avançar para a **Fase 2: Prototipação Arquitetural e Catálogo Declarativo**, estruturada em:

1. **Etapa 2.1 — Catálogo e Modelo:** Criação de `campaign-map-catalog.js` e `campaign-map-model.js`.
2. **Etapa 2.2 — Test Harness e Testes:** Criação de `tests/visual/campaign-map-harness.html` e `tests/campaign/campaign-map.test.js`.
3. **Etapa 2.3 — Componente Visual e Estilos:** Criação de `campaign-map-view.js` e `campaign-map.css`.
4. **Etapa 2.4 — Integração Não-Destrutiva:** Conexão com `CampaignView.prototype.renderHome`.

---

## 23. Registro de Aprovação da Fase 1

- **Data da Aprovação:** 19 de Setembro de 2026
- **Decisões Oficiais:**
  1. Direção artística em Pixel Art Moderna Original (32-bit).
  2. Navegação entre regiões por Abas Superiores semânticas.
  3. Guia de Tipo compacto integrado ao Painel do Treinador.
  4. Mapa como visualização padrão no mobile com Modo Lista alternativo funcional.
- **Natureza da Entrega:** Documental e estratégica. Nenhum código de produção em JavaScript, HTML, CSS ou imagem foi implementado.
- **Status do Projeto:** Fase 1 Aprovada e Concluída. A Fase 2 não foi iniciada nesta tarefa e aguarda autorização para início do ciclo de prototipação.
- **Validação Futura:** As metas de desempenho (orçamento de assets de até 140 KB por fundo) e acessibilidade (WCAG 2.1 nível AA) serão medidas e validadas experimentalmente durante os testes do protótipo da Fase 2.
