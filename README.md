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
│   │   └── modal.css        # Estilos do modal com estatísticas e evolução
│   └── js/
│       ├── pokemon-model.js # Classe e modelo de dados do Pokémon
│       ├── poke-api.js      # Integração e requisições HTTP para a PokéAPI
│       ├── team/
│       │   ├── team-store.js   # Persistência e validação no LocalStorage (team.current)
│       │   ├── team-manager.js # Regras de negócio, limites e reordenação
│       │   └── team-ui.js      # Renderização dos slots e sincronização visual
│       ├── battle/
│       │   ├── battle-constants.js     # Estados, eventos, ações e catálogo de tipos
│       │   ├── type-chart.js           # Matriz completa de efetividade (324 relações)
│       │   ├── type-effectiveness.js   # Cálculo multiplicativo e validação single/dual-type
│       │   ├── move-model.js           # Modelo normalizado de golpes (Physical/Special/PP/Accuracy)
│       │   ├── damage-calculator.js    # Pipeline de dano v2 com Power, STAB e Efetividade
│       │   ├── turn-manager.js         # Iniciativa por Speed e desempate determinístico
│       │   ├── battle-engine.js        # Motor 1x1 e 3x3 com Battle State v2, turnos e eventos
│       │   ├── battle-evaluator.js     # Avaliador puro de dano esperado, STAB e matchups
│       │   └── battle-ai.js            # Inteligência artificial determinística (SIMPLE e SMART)
│       └── main.js          # Manipulação do DOM, eventos, filtros e navegação
├── docs/
│   └── battle-architecture.md # Especificação técnica da Battle Arena
├── tests/
│   ├── fixtures/
│   │   ├── pokemon-fixtures.js      # Fixtures offline com Combatant Model v3 e moves
│   │   ├── move-fixtures.js         # Catálogo estático de golpes para testes unitários
│   │   ├── team-fixtures.js         # Fixtures de equipes 3x3 para simulações e trocas
│   │   └── type-chart-reference.js  # Referência canônica independente para hardening (18x18)
│   └── battle/
│       ├── battle-ai.test.js            # Suíte de testes da Battle AI (AI-01-AI-43)
│       ├── team-battle.test.js          # Suíte de testes 3x3 e trocas voluntárias/forçadas (B3-01-B3-35)
│       ├── move-system.test.js          # Suíte de testes do Move System (MV01-MV43)
│       ├── battle-engine.test.js        # Suíte de testes automatizados E01-E18 e TY21-TY25
│       ├── type-effectiveness.test.js   # Suíte de testes dos tipos TY01-TY15 e 324 relações
│       ├── damage-calculator.test.js    # Testes do cálculo de dano e gates TY16-TY20
│       └── turn-manager.test.js         # Testes unitários de ordem de iniciativa
├── index.html               # Estrutura principal da página
├── progress.md              # Registro contínuo de status e fases para agentes
└── README.md                # Documentação oficial do projeto
```

---

## 🗺️ Pokémon Battle Arena — Roadmap

O desenvolvimento do simulador de batalhas segue um planejamento incremental por fases:

- [x] **PBA-001 Foundation / Architecture Preparation** *(Fase Concluída)*: Auditoria do projeto existente, documentação técnica de arquitetura, separação conceitual Engine/Presentation, navegação entre módulos e padronização do repositório.
- [x] **PBA-002 Team Builder** *(Fase Concluída)*: Seleção de time tático (até 3 Pokémon), definição de Líder, reordenação acessível, persistência confiável em `localStorage` (`team.current`) e integração total com Pokédex e modal.
- [x] **PBA-003 Battle Engine v1** *(Fase Concluída)*: Núcleo matemático de combate 1x1 funcional, determinístico e testável, completamente desacoplado de DOM, PokéAPI e áudio. Gerenciamento de turnos por Speed, cálculo de dano puro, piso de HP em zero e emissão de eventos estruturados.
- [x] **PBA-004 Type System** *(Fase Concluída)*: Matriz completa dos 18 tipos modernos (324 relações), suporte integral a combatentes single e dual-type (multiplicadores 0, 0.25, 0.5, 1, 2, 4), prevalência absoluta de imunidades, classificação estruturada de eventos e integração matemática com o cálculo de dano.
- [x] **PBA-005 Move System** *(Fase Concluída)*: O Battle Engine agora utiliza golpes normalizados com Power real, Type, Accuracy determinística, PP (Power Points) e categorias Physical/Special. Introdução de STAB (1.5x), seleção de golpes no turno, eventos estruturados de HIT/MISS e hardening do Type Chart contra referência canônica independente.
- [x] **PBA-006 Battle 3x3** *(Fase Concluída)*: Suporte a batalhas de equipes (3 vs 3) com Battle State v2, Pokémon ativo vs banco, trocas voluntárias com prioridade sobre ataques (`SWITCH > MOVE`), trocas forçadas após nocaute (`AWAITING_REPLACEMENT` / `REPLACEMENT_REQUIRED`), preservação estrita de HP e PP no banco e condição de vitória por aniquilação completa da equipe adversária (`TEAM_DEFEATED`).
- [x] **PBA-007 Battle AI** *(Fase Concluída)*: Inteligência artificial adversária desacoplada e 100% determinística com estratégias `SIMPLE` e `SMART`. Avalia dano esperado ponderado por precisão, STAB, fraquezas/resistências, categorias físicas/especiais, administração de PP, descarte de imunidades, trocas voluntárias estratégicas e seleção inteligente de substituto pós-nocaute.
- [ ] **PBA-008 Battle Presentation Engine**: Desacoplamento assíncrono entre eventos da engine e camada visual.
- [ ] **PBA-008 Battle Presentation Engine**: Desacoplamento assíncrono entre eventos da engine e camada visual.
- [ ] **PBA-009 Pokemon Animations**: Sprites animados, efeitos de entrada, ataque e recuo.
- [ ] **PBA-010 Move Visual Effects**: Partículas elementais (fogo, água, trovão, etc.).
- [ ] **PBA-011 Audio System**: Gerenciamento de trilha sonora, efeitos de impacto e controle de volume.
- [ ] **PBA-012 Battle Camera & Impact**: Screen shake, efeitos de acerto crítico e feedback dinâmico.
- [ ] **PBA-013 Final Battle UI**: Interface gráfica refinada de combate, logs de ação e status.
- [ ] **PBA-014 Trainer Profile**: Perfil do treinador, insígnias conquistadas e estatísticas.
- [ ] **PBA-015 Campaign Mode**: Modo campanha com progressão de ginásios e desafios crescentes.
- [ ] **PBA-016 Performance & Accessibility**: Otimização de renderização e suporte a `prefers-reduced-motion`.
- [ ] **PBA-017 Automated Tests**: Testes unitários para cálculos de dano e regras da engine.
- [ ] **PBA-018 Portfolio Release**: Documentação final, estudo de caso e publicação.

---

Desenvolvido com 💜 por Rafael.
