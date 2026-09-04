# ⚡ Pokédex Pro + Pokémon Battle Arena

Uma plataforma web moderna, dinâmica e visualmente rica desenvolvida em **JavaScript Vanilla**, **HTML5 Semântico** e **CSS3 Moderno** consumindo a **PokéAPI REST**.

Originalmente concebido como desafio prático de JavaScript da **[Digital Innovation One (DIO)](https://www.dio.me/)**, o projeto está em evolução contínua para se tornar uma aplicação de portfólio completa com simulador de batalhas por turnos e gerenciador tático de equipes.

> **Status Atual**: A **Pokédex Pro** e o **Team Builder (Meu Time)** estão 100% funcionais e operacionais. O módulo **Pokémon Battle Arena** encontra-se em desenvolvimento incremental seguindo arquitetura desacoplada em camadas.

Acesso a Pokedex https://spiritstonesrafa-ux.github.io/js-developer-pokedex/

---

## ✨ Funcionalidades da Pokédex (100% Operacional)

- 🎨 **Design Glassmorphism & UI/UX Premium**: Cards com gradientes dinâmicos de acordo com o tipo primário do Pokémon, efeitos de iluminação e hover 3D tilt.
- 🌓 **Dark Mode / Light Mode**: Alternância de tema com persistência no `localStorage`.
- 🔍 **Busca em Tempo Real**: Pesquise instantaneamente por nome ou número (#ID).
- 🏷️ **Filtros por Tipo & Geração**:
  - Filtro por todos os 18 tipos Pokémon (Fire, Water, Grass, Electric, Dragon, etc.).
  - Filtro por Gerações (1ª Geração Kanto até a 9ª Geração Paldea).
- 📊 **Ordenação Inteligente**: Ordene por ID crescente/decrescente, Ordem Alfabética (A-Z / Z-A) ou por Total de Stats (mais fortes).
- 💖 **Sistema de Favoritos**: Salve seus Pokémon preferidos no navegador e filtre para visualizá-los a qualquer momento (`pokedex_favorites`).
- 📱 **Modal de Detalhes Completo**:
  - Artwork oficial em alta resolução com animações.
  - **Áudio Real (Pokémon Cry)**: Toque para ouvir o som original do Pokémon disponibilizado pela PokéAPI.
  - Medidas físicas (Altura, Peso) e lista de Habilidades.
  - Barras animadas e coloridas com valores de cada Status Base (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed).
  - Linha evolutiva completa e interativa (Evolution Chain).
- 🧭 **Navegação de Módulos**: Alternância integrada entre Pokédex, Meu Time e Arena de Batalha.
- 📱 **100% Responsivo**: Otimizado para smartphones (360px+), tablets e telas widescreen.

---

## 🛡️ Team Builder / Meu Time (100% Operacional — PBA-002)

- 👥 **Montagem de Equipe (0 a 3 Pokémon)**: Selecione estrategicamente até 3 Pokémon da Pokédex para compor seu time de combate.
- 👑 **Definição de Líder (Slot 1)**: O primeiro slot é destacado como Líder da equipe e iniciará as futuras batalhas.
- 🚫 **Bloqueio a Duplicatas**: Validação estrita para impedir Pokémon repetidos na mesma equipe.
- 🔄 **Reordenação Acessível**: Botões direcionais (`←` e `→`) para alternar a ordem dos Pokémon no time sem depender de gestos complexos.
- 💾 **Persistência Confiável no LocalStorage**: O time é salvo sob a chave `team.current`, com sanitização automática contra JSON corrompido ou IDs inválidos.
- 🏷️ **Indicadores Sincronizados**: Cards da Pokédex exibem a tag `✓ No time` em tempo real e o modal adapta seu botão para `[ Adicionar ]`, `[ No Time (Remover) ]` ou `[ Time Completo (3/3) ]`.
- 🗑️ **Limpeza Segura**: Opção de limpar a equipe com confirmação em duas etapas para evitar cliques acidentais.

---

## 🏗️ Arquitetura do Projeto

O projeto adota uma arquitetura em camadas visando desacoplar totalmente a lógica de negócio das representações visuais:

```text
Data / API (PokéAPI / TeamStore)
     ↓
Domain Model (Pokemon, Move, Team, Trainer)
     ↓
Game Engine (BattleEngine, TurnManager, DamageCalculator, BattleAI)
     ↓
Presentation Engine (AnimationQueue, AudioSystem, VFXManager)
     ↓
UI (DOM, Cards, Modais, Team UI)
```

### Regra de Ouro: Game Engine ≠ Presentation Engine
A **Game Engine** calcula estritamente a matemática do combate (iniciativa por velocidade, dano, acerto crítico, STAB, fraquezas/resistências, IA e fluxo de turnos) sem depender de elementos do DOM, CSS ou áudio. A **Presentation Engine** consome os eventos da batalha e controla as animações, áudio, partículas e transições visuais.

Para uma visão detalhada das decisões técnicas e fluxo de dados, consulte a [Documentação de Arquitetura](docs/battle-architecture.md).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Semântica e Acessibilidade)
- **CSS3 Moderno** (Custom Properties, Flexbox, CSS Grid, Glassmorphism, Keyframe Animations)
- **JavaScript ES6+** (Async/Await, Fetch API, Promises, Classes, LocalStorage)
- **[PokéAPI REST](https://pokeapi.co/)** (Dados públicos e sprites)
- **FontAwesome Icons & Google Fonts (Outfit / Inter)**

---

## 🚀 Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/spiritstonesrafa-ux/js-developer-pokedex.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd js-developer-pokedex
   ```

3. Abra o arquivo `index.html` diretamente em qualquer navegador moderno ou execute um servidor HTTP local simples (como a extensão **Live Server** do VS Code ou `npx serve`).

---

## 📂 Estrutura de Arquivos

```text
├── .gitignore               # Configurações de exclusão de arquivos
├── assets/
│   ├── css/
│   │   ├── reset.css        # Resets e variáveis de cores dos tipos/temas
│   │   ├── global.css       # Layout geral, cabeçalho, navegação, controles e Team Builder
│   │   ├── pokedex.css      # Grid e cards dos pokémons
│   │   ├── modal.css        # Estilos do modal com estatísticas e evolução
105: │   │   ├── battle-animations.css # Animações GPU-accelerated de sprites da arena (PBA-009)
106: │   │   └── move-vfx.css     # Estilização e keyframes dos efeitos visuais de golpes (PBA-010)
107: │   └── js/
108: │       ├── pokemon-model.js # Classe e modelo de dados do Pokémon
109: │       ├── poke-api.js      # Integração e requisições HTTP para a PokéAPI
110: │       ├── team/
111: │       │   ├── team-store.js   # Persistência e validação no LocalStorage (team.current)
112: │       │   ├── team-manager.js # Regras de negócio, limites e reordenação
113: │       │   └── team-ui.js      # Renderização dos slots e sincronização visual
114: │       ├── battle/
115: │       │   ├── battle-constants.js     # Estados, eventos, ações e catálogo de tipos
116: │       │   ├── type-chart.js           # Matriz completa de efetividade (324 relações)
117: │       │   ├── type-effectiveness.js   # Cálculo multiplicativo e validação single/dual-type
118: │       │   ├── move-model.js           # Modelo normalizado de golpes (Physical/Special/PP/Accuracy)
119: │       │   ├── damage-calculator.js    # Pipeline de dano v2 com Power, STAB e Efetividade
120: │       │   ├── turn-manager.js         # Iniciativa por Speed e desempate determinístico
121: │       │   ├── battle-engine.js        # Motor 1x1 e 3x3 com Battle State v2, turnos e eventos
122: │       │   ├── battle-evaluator.js     # Avaliador puro de dano esperado, STAB e matchups
123: │       │   └── battle-ai.js            # Inteligência artificial determinística (SIMPLE e SMART)
124: │       ├── presentation/
125: │       │   ├── battle-presentation-constants.js # Catálogo de comandos, status e durações padrão
126: │       │   ├── battle-presentation-adapter.js   # Interface assíncrona, NullAdapter e RecordingAdapter
127: │       │   ├── battle-presentation-scheduler.js # Agendador de delays (ImmediateScheduler e TimerScheduler)
128: │       │   ├── battle-presentation-mapper.js    # Mapeamento puro determinístico dos eventos da Engine
129: │       │   ├── battle-presentation-engine.js    # Orquestrador de timeline sequencial e cancelamento
130: │       │   ├── composite-battle-dom-adapter.js  # Adaptador composto (Pokemon Animation + Move VFX)
131: │       │   └── animation/
132: │       │       ├── pokemon-animation-constants.js   # Catálogo de animações, timings e classes
133: │       │       ├── pokemon-animation-registry.js    # Registro de alvos DOM e fallback de sprites
134: │       │       ├── pokemon-animation-controller.js  # Controle de ciclo de vida visual, idle e cancel
135: │       │       └── pokemon-animation-dom-adapter.js # Adaptador DOM ligando comandos às animações
136: │       ├── vfx/
137: │       │   ├── move-vfx-constants.js    # 18 Famílias de tipos, 8 arquétipos, intensidades e overrides
138: │       │   ├── move-vfx-resolver.js     # Mapeamento puro de golpes para descritores com fallback
139: │       │   ├── move-vfx-registry.js     # Registro de palco e combatentes com coordenadas relativas
140: │       │   ├── move-vfx-dom-renderer.js # Renderização DOM GPU, partículas leves e impacto/dissipação
141: │       │   └── move-vfx-controller.js   # Controle assíncrono de ciclo de vida de VFX e reduced motion
142: │       └── main.js          # Manipulação do DOM, eventos, filtros e navegação
143: ├── docs/
144: │   └── battle-architecture.md # Especificação técnica da Battle Arena
145: ├── tests/
146: │   ├── fixtures/
147: │   │   ├── pokemon-fixtures.js      # Fixtures offline com Combatant Model v3 e moves
148: │   │   ├── move-fixtures.js         # Catálogo estático de golpes para testes unitários
149: │   │   ├── team-fixtures.js         # Fixtures de equipes 3x3 para simulações e trocas
150: │   │   └── type-chart-reference.js  # Referência canônica independente para hardening (18x18)
151: │   ├── battle/
152: │   │   ├── battle-ai.test.js            # Suíte de testes da Battle AI (AI-01-AI-43)
153: │   │   ├── team-battle.test.js          # Suíte de testes 3x3 e trocas voluntárias/forçadas (B3-01-B3-35)
154: │   │   ├── move-system.test.js          # Suíte de testes do Move System (MV01-MV43)
155: │   │   ├── battle-engine.test.js        # Suíte de testes automatizados E01-E18 e TY21-TY25
156: │   │   ├── type-effectiveness.test.js   # Suíte de testes dos tipos TY01-TY15 e 324 relações
157: │   │   ├── damage-calculator.test.js    # Testes do cálculo de dano e gates TY16-TY20
158: │   │   └── turn-manager.test.js         # Testes unitários de ordem de iniciativa
159: │   ├── presentation/
160: │   │   └── battle-presentation.test.js  # Suíte de testes da Presentation Engine (PR01-PR40)
161: │   ├── animation/
162: │   │   └── pokemon-animation.test.js    # Suíte de testes das Animações de Pokémon (AN01-AN36)
163: │   ├── vfx/
164: │   │   └── move-vfx.test.js             # Suíte de testes de Efeitos Visuais de Golpes (VFX01-VFX40)
165: │   └── visual/
166: │       ├── pokemon-animation-harness.html # Harness visual de animações de sprites
167: │       └── move-vfx-harness.html          # Harness visual de efeitos de golpes (18 tipos, 8 arquétipos)
168: ├── index.html               # Estrutura principal da página
169: ├── progress.md              # Registro contínuo de status e fases para agentes
170: └── README.md                # Documentação oficial do projeto
171: ```
172: 
173: ---
174: 
175: ## 🗺️ Pokémon Battle Arena — Roadmap
176: 
177: O desenvolvimento do simulador de batalhas segue um planejamento incremental por fases:
178: 
179: - [x] **PBA-001 Foundation / Architecture Preparation** *(Fase Concluída)*: Auditoria do projeto existente, documentação técnica de arquitetura, separação conceitual Engine/Presentation, navegação entre módulos e padronização do repositório.
180: - [x] **PBA-002 Team Builder** *(Fase Concluída)*: Seleção de time tático (até 3 Pokémon), definição de Líder, reordenação acessível, persistência confiável em `localStorage` (`team.current`) e integração total com Pokédex e modal.
181: - [x] **PBA-003 Battle Engine v1** *(Fase Concluída)*: Núcleo matemático de combate 1x1 funcional, determinístico e testável, completamente desacoplado de DOM, PokéAPI e áudio. Gerenciamento de turnos por Speed, cálculo de dano puro, piso de HP em zero e emissão de eventos estruturados.
182: - [x] **PBA-004 Type System** *(Fase Concluída)*: Matriz completa dos 18 tipos modernos (324 relações), suporte integral a combatentes single e dual-type (multiplicadores 0, 0.25, 0.5, 1, 2, 4), prevalência absoluta de imunidades, classificação estruturada de eventos e integração matemática com o cálculo de dano.
183: - [x] **PBA-005 Move System** *(Fase Concluída)*: O Battle Engine agora utiliza golpes normalizados com Power real, Type, Accuracy determinística, PP (Power Points) e categorias Physical/Special. Introdução de STAB (1.5x), seleção de golpes no turno, eventos estruturados de HIT/MISS e hardening do Type Chart contra referência canônica independente.
184: - [x] **PBA-006 Battle 3x3** *(Fase Concluída)*: Suporte a batalhas de equipes (3 vs 3) com Battle State v2, Pokémon ativo vs banco, trocas voluntárias com prioridade sobre ataques (`SWITCH > MOVE`), trocas forçadas após nocaute (`AWAITING_REPLACEMENT` / `REPLACEMENT_REQUIRED`), preservação estrita de HP e PP no banco e condição de vitória por aniquilação completa da equipe adversária (`TEAM_DEFEATED`).
185: - [x] **PBA-007 Battle AI** *(Fase Concluída)*: Inteligência artificial adversária desacoplada e 100% determinística com estratégias `SIMPLE` e `SMART`. Avalia dano esperado ponderado por precisão, STAB, fraquezas/resistências, categorias físicas/especiais, administração de PP, descarte de imunidades, trocas voluntárias estratégicas e seleção inteligente de substituto pós-nocaute.
186: - [x] **PBA-008 Battle Presentation Engine** *(Fase Concluída)*: O projeto agora possui uma Battle Presentation Engine responsável por transformar eventos do motor de batalha em timelines estruturadas e assíncronas de apresentação. Orquestrador sequencial com suporte a cancelamento, agendador desacoplado (`ImmediateScheduler` e `TimerScheduler`), adaptadores assíncronos (`NullAdapter` e `RecordingAdapter`), proteção contra concorrência e preparação para acessibilidade (`reducedMotion`). 100% de cobertura de eventos do Battle Engine e zero regras de combate na camada visual.
187: - [x] **PBA-009 Pokemon Animations** *(Fase Concluída)*: A Battle Arena agora possui um sistema reutilizável de animações de Pokémon integrado à Presentation Engine, incluindo entrada, idle, ataque genérico, reação ao dano, faint, troca e vitória. Suporte completo a aceleração por hardware (GPU), orientações espelhadas para player/enemy, controle automático de idle, cancelamento limpo e acessibilidade com reduced motion.
188: - [x] **PBA-010 Move Visual Effects** *(Fase Concluída)*: A Battle Arena agora possui um sistema visual reutilizável para golpes, com famílias de efeitos baseadas nos 18 tipos Pokémon e arquétipos visuais compartilhados (`PROJECTILE`, `BEAM`, `STREAM`, `BURST`, `SLASH`, `IMPACT`, `WAVE`, `AURA`). Resolução pura de descritores visuais com fallback genérico por tipo, classificação por intensidade (`LOW`, `MEDIUM`, `HIGH`), tratamento visual de MISS e IMMUNITY sem impacto de dano, escala aprimorada para Super Effective, renderização acelerada por hardware (GPU) via CSS Variables, controle de concorrência com cancelamento limpo, acessibilidade integral (`reducedMotion`) e orquestração integrada via `CompositeBattleDomAdapter`.
189: - [ ] **PBA-011 Audio System**: Gerenciamento de trilha sonora, efeitos de impacto e controle de volume.
190: - [ ] **PBA-012 Battle Camera & Impact**: Screen shake, efeitos de acerto crítico e feedback dinâmico.
191: - [ ] **PBA-013 Final Battle UI**: Interface gráfica refinada de combate, logs de ação e status.
192: - [ ] **PBA-014 Trainer Profile**: Perfil do treinador, insígnias conquistadas e estatísticas.
193: - [ ] **PBA-015 Campaign Mode**: Modo campanha com progressão de ginásios e desafios crescentes.
194: - [ ] **PBA-016 Performance & Accessibility**: Otimização de renderização e suporte a `prefers-reduced-motion`.
195: - [ ] **PBA-017 Automated Tests**: Testes unitários para cálculos de dano e regras da engine.
196: - [ ] **PBA-018 Portfolio Release**: Documentação final, estudo de caso e publicação.
197: 
198: ---
199: 
200: Desenvolvido com 💜 por Rafael.
201: 
