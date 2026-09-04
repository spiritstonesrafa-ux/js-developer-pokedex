# 📋 Registro de Progresso Contínuo — Pokédex Pro + Battle Arena

Arquivo de governança técnica para alinhamento e continuidade entre diferentes sessões e agentes de IA.

---

## 1. Projeto

**Pokédex Pro + Pokémon Battle Arena**
- Repositório: `spiritstonesrafa-ux/js-developer-pokedex`
- Diretório de Trabalho: `D:\GamePokemon`

---

## 2. Objetivo Final

Evoluir uma Pokédex moderna (desafio DIO) para uma plataforma de portfólio completa contendo:
1. Pokédex interativa e rápida (HTML5, CSS3, JavaScript Vanilla, PokéAPI);
2. Team Builder tático para seleção, ordenação e persistência de equipes (até 3 integrantes);
3. Battle Simulator com simulação por turnos 1x1 e 3x3 contra IA, mecânica clássica de dano e efetividade, com alta qualidade estética, animações dinâmicas e efeitos visuais/sonoros desacoplados.

---

## 3. Arquitetura Obrigatória

```text
Data / API
     ↓
Domain Model
     ↓
Game Engine
     ↓
Presentation Engine
     ↓
UI
```

### Regra de Ouro Inviolável
**Game Engine ≠ Presentation Engine**
A Game Engine determina quem ataca, qual golpe é desferido, quanto dano ocorreu e o estado da batalha (lógica determinística e serializável). A Presentation Engine orquestra animações, partículas, sons, sprites e atualizações do DOM a partir dos eventos emitidos pela Engine.

---

## 4. Fases Concluídas

- **PBA-001 Foundation / Architecture Preparation**:
  - Auditoria completa do projeto existente;
  - Documentação da arquitetura em `docs/battle-architecture.md`;
  - Definição formal das fronteiras de Engine e Presentation;
  - Navegação não-destrutiva (`Pokédex`, `Meu Time`, `Batalhar`);
  - Criação do `.gitignore` e atualização do `README.md`;
  - Preservação total de funcionalidades originais da Pokédex.
- **PBA-002 Team Builder**:
  - Implementação modular em `assets/js/team/`: `team-store.js`, `team-manager.js` e `team-ui.js`;
  - Limite estrito de 3 integrantes (`TEAM_MAX_SIZE = 3`);
  - Proibição de duplicatas (`DUPLICATE_POKEMON = FORBIDDEN`);
  - Importância da ordem (`ORDER_MATTERS = YES`): Slot 1 como Líder (*Lead*);
  - Reordenação acessível com botões direcionais (`←` e `→`);
  - Persistência sob o namespace `team.current` com recuperação tolerante a falhas;
  - Indicadores sincronizados na Pokédex (`✓ No time`), no modal (`Adicionar`/`Remover`/`Completo`) e no cabeçalho;
  - Empty state encorajador e celebração de equipe completa (3/3);
  - 100% de testes obrigatórios T01–T12 aprovados.

- **PBA-003 Battle Engine v1**:
  - Implementação do núcleo matemático de combate 1x1 isolado em `assets/js/battle/`:
    - `battle-constants.js`: Estados (`READY`, `IN_PROGRESS`, `PLAYER_WIN`, `ENEMY_WIN`), eventos e configurações;
    - `damage-calculator.js`: Fórmula clássica determinística com nível simulado 50 e poder 40, piso de dano >= 1;
    - `turn-manager.js`: Ordem por Velocidade (*Speed*), com desempate determinístico em favor do jogador;
    - `battle-engine.js`: Criação de batalha, validações estritas contra NaN e entradas corrompidas, ciclo de turnos com suspensão de contra-ataque em nocaute e bloqueio pós-combate;
  - Barramento de eventos estruturados (`BATTLE_STARTED`, `TURN_STARTED`, `ACTION_STARTED`, `DAMAGE_APPLIED`, `POKEMON_FAINTED`, `BATTLE_ENDED`);
  - 100% de isolamento: `BATTLE_ENGINE_DOM_DEPENDENCIES = 0`, `BATTLE_ENGINE_FETCH_CALLS = 0`, `BATTLE_ENGINE_LOCALSTORAGE_DEPENDENCIES = 0`, `BATTLE_ENGINE_AUDIO_DEPENDENCIES = 0`;
  - Imutabilidade comprovada (`INPUT_MUTATION = NONE`);
  - 100% de testes automatizados E01–E18 e Simulação Completa aprovados com Node.js nativo (26/26 testes).

- **PBA-004 Type System**:
  - Implementação da matriz completa de 18x18 tipos modernos (`type-chart.js`) com todas as 324 relações resolvíveis;
  - Módulo puro de cálculo de efetividade (`type-effectiveness.js`) com suporte integral a combatentes single e dual-type;
  - Multiplicadores elementais canônicos suportados: `0` (imune), `0.25` (dupla resistência), `0.5` (resistido), `1` (neutro), `2` (super efetivo) e `4` (dupla fraqueza);
  - Prevalência estrita de imunidade em Pokémon dual-type ($x \times 0 = 0$);
  - Classificação semântica de eventos: `IMMUNE`, `RESISTED`, `NEUTRAL` e `SUPER_EFFECTIVE`;
  - Combatant Model v2 atualizado com validação e normalização de 1 a 2 tipos únicos;
  - Integração com `DamageCalculator`: dano zero para imunidades absolutas e piso mínimo de $1$ para ataques não-imunes;
  - Emissão do evento `TYPE_EFFECTIVENESS_RESOLVED` antes de `DAMAGE_APPLIED`;
  - Ponte transitória: `BASIC_ATTACK` adota temporariamente o tipo primário do atacante (`attacker.types[0]`), sem STAB;
  - 100% de isolamento mantido: `DOM = 0`, `FETCH = 0`, `LOCALSTORAGE = 0`, `AUDIO = 0`;
  - Encapsulamento de todos os módulos de batalha em IIFE para prevenir colisões de escopo no navegador;
  - 100% de aprovação nos testes automatizados: 52 testes (TY01–TY25, integridade das 324 relações e regressão completa E01–E18).

- **PBA-005 Move System**:
  - Implementação do modelo normalizado de golpes (`MoveModel` em `assets/js/battle/move-model.js`) com `id`, `name`, `type`, `power`, `accuracy`, `pp` e `damageClass`;
  - Suporte completo às categorias de dano `physical` e `special`;
  - Golpes da categoria `status` (ex: *Growl*) são reconhecidos na validação, mas rejeitados como `UNSUPPORTED_IN_PBA_005` (sem danos fictícios);
  - Combatant Model v3: incorporação de `specialAttack`, `specialDefense` e loadout de 1 a 4 moves (`MOVE_LOADOUT_MIN = 1`, `MOVE_LOADOUT_MAX = 4`) sem duplicatas;
  - Resolução de atributos ofensivos e defensivos:
    - Físico: `attacker.attack` vs `defender.defense`;
    - Especial: `attacker.specialAttack` vs `defender.specialDefense`;
    - Independência estatística comprovada por testes (alterar stats físicos não altera danos especiais e vice-versa);
  - Desativação do tipo primário temporário: o tipo elemental da ação agora é estritamente regido pelo golpe (`BASIC_ATTACK_PRIMARY_TYPE_BRIDGE_ACTIVE = NO`);
  - Sistema de PP: estado runtime isolado, decremento de 1 PP em hits e misses, bloqueio em zero PP (`ACTION_REJECTED`), e preservação de PP do defensor em caso de nocaute no primeiro ataque;
  - Resolução determinística de Precisão (Accuracy): sem `Math.random()`, rolls externos ($1 \le \text{roll} \le 100$), suporte a *Always-Hit* (`accuracy: null`), com miss causando 0 dano e deixando o HP intacto;
  - STAB (Same-Type Attack Bonus): multiplicador de $1.5\times$ quando o tipo do golpe coincide com os tipos do atacante ($1.0\times$ caso contrário);
  - Prevalência estrita de imunidade: multiplicador elemental $0$ anula o dano final independentemente de STAB ou poder base;
  - Pipeline de dano v2: $\lfloor \text{baseDamage} \times \text{stabMultiplier} \times \text{typeMultiplier} \rfloor$;
  - Fronteira de dados da PokéAPI: `pokeApi.getMoveDetail` com cache em memória (`Map`) e adaptador para `MoveModel`, mantendo o Battle Engine 100% isolado de chamadas `fetch`;
  - Hardening do Type Chart: verificação independente de todas as 324 relações $18 \times 18$ contra fixture canônica autônoma (`type-chart-reference.js`);
- **PBA-006 Battle 3x3 & Switching**:
  - Implementação completa do conceito de Battle Team com tamanho obrigatório de 3 Pokémon (`TEAM_SIZE = 3`);
  - Rejeição estrita de equipes inválidas (0, 1, 2 ou 4+ Pokémon) e espécies duplicadas (`DUPLICATE_SPECIES = REJECTED`);
  - Preservação do Líder: Slot 1 da equipe (índice 0) entra automaticamente como o primeiro combatente ativo;
  - Battle State v2 serializável e determinístico com rastreamento isolado de `activeIndex`, equipe ativa e reservas no banco;
  - Regra de ouro mantida: `team.current` (LocalStorage) $\neq$ Battle Runtime State (cópias profundas independentes);
  - Apenas o Pokémon ativo pode atacar, receber danos e gastar PP; o banco é totalmente protegido de ações e danos;
  - Troca Voluntária (`SWITCH`):
    - Prioridade estrita da troca sobre ataques ofensivos ($\text{SWITCH} > \text{MOVE}$);
    - Em `SWITCH vs MOVE`, o Pokémon reserva entra em campo e recebe o golpe adversário;
    - Em `SWITCH vs SWITCH`, ambas as trocas ocorrem deterministicamente antes de qualquer dano;
    - Validação rígida: impede troca para Pokémon inexistente, fora da equipe, já ativo ou nocauteado;
  - Persistência incondicional de HP e PP no banco (`SWITCH_HP_PERSISTENCE = PASS`, `SWITCH_PP_PERSISTENCE = PASS`);
  - Troca Forçada após Nocaute (`AWAITING_REPLACEMENT`):
    - Nocaute com reservas vivas não finaliza o combate;
    - Emissão do evento semântico `REPLACEMENT_REQUIRED` contendo o ID nocauteado e os IDs disponíveis no banco;
    - API explícita `BattleEngine.resolveReplacement(state, replacementActions)` desacoplada da UI e da IA;
    - Suspensão de contra-ataque fantasma do Pokémon nocauteado no mesmo turno;
  - Derrota da Equipe e Vitória (`TEAM_DEFEATED`):
    - O combate só termina quando os 3 Pokémon adversários estiverem nocauteados;
    - Emissão encadeada de `POKEMON_FAINTED` $\to$ `TEAM_DEFEATED` $\to$ `BATTLE_ENDED`;
  - Compatibilidade 100% preservada com confrontos 1x1 da PBA-003/004/005 (`LEGACY_1V1_REGRESSION = NONE`);
- **PBA-007 Battle AI**:
  - Separação arquitetural estrita: `BATTLE ENGINE ≠ BATTLE AI` e `ENGINE_DEPENDS_ON_AI = NO`;
  - Implementação do avaliador puro `BattleEvaluator` (`evaluateMove` e `evaluateMatchup`) calculando dano esperado ponderado por Precisão (Accuracy), STAB, fraquezas, imunidades e categorias Physical/Special sem efeitos colaterais (`AI_EVALUATION_MUTATES_STATE = NO`);
  - Estratégias programáticas `SIMPLE` (rígida, primeiro golpe utilizável, sem troca voluntária) e `SMART` (heurística de dano esperado, bonificação de KO, mitigação de riscos defensivos);
  - Descarte estrito de golpes com imunidade absoluta (0x) quando alternativas com dano positivo estão disponíveis;
  - Trocas voluntárias inteligentes (`SWITCH`):
    - Regra SW1: Imunidade total no ativo com reserva viável no banco (`AVOID_IMMUNITY_SWITCH`);
    - Regra SW2: Matchup muito desfavorável ($\le 0.5\times$) com reserva super efetiva ($\ge 2.0\times$) superando `SMART_SWITCH_MARGIN = 1.3` (`STRATEGIC_MATCHUP_SWITCH`);
    - Regra SW3: Ativo sem PP com reserva funcional no banco (`NO_PP_SWITCH`);
  - Substituição forçada inteligente pós-nocaute (`chooseReplacement`): prioriza reserva com melhor pontuação composta (dano efetivo, sobrevivência defensiva e HP remanescente);
  - Zero Trapaça (`AI_FUTURE_PLAYER_ACTION_ACCESS = NO`): a IA não conhece a ação futura do jogador nem os rolls de acurácia antes de escolher sua ação;
  - Zero RNG Interno (`AI_MATH_RANDOM_CALLS = 0`, `AI_CRYPTO_RANDOM_CALLS = 0`): determinismo e reprodutibilidade 100% comprovados por testes;
  - 100% de aprovação nos testes automatizados: 173 testes (43 novos testes AI-01 a AI-43 + 130 testes anteriores) sem nenhuma falha ou regressão.

- **PBA-008 Battle Presentation Engine**:
  - Implementação do orquestrador de apresentação desacoplado em `assets/js/presentation/`:
    - `battle-presentation-constants.js`: Catálogo de 16 comandos de apresentação (`BATTLE_INTRO`, `TURN_INDICATOR`, `ACTION_FOCUS`, `MOVE_FOCUS`, `MOVE_ANNOUNCEMENT`, `PP_TRANSITION`, `MOVE_MISS_FEEDBACK`, `STAB_METADATA`, `EFFECTIVENESS_FEEDBACK`, `HP_TRANSITION`, `FAINT_SEQUENCE`, `SWITCH_OUT_SEQUENCE`, `SWITCH_IN_SEQUENCE`, `REPLACEMENT_PROMPT`, `TEAM_DEFEAT_SEQUENCE`, `BATTLE_RESULT`), estados e durações padrão;
    - `battle-presentation-adapter.js`: Interface abstrata `BattlePresentationAdapter`, com `NullAdapter` (no-op para headless) e `RecordingAdapter` (gravação ordenada de comandos para testes);
    - `battle-presentation-scheduler.js`: Agendador temporal desacoplado com `ImmediateScheduler` (0ms para testes) e `TimerScheduler` (com suporte a cancelamento de timers);
    - `battle-presentation-mapper.js`: Mapeamento puro e determinístico de 100% dos eventos da Battle Engine para comandos de apresentação, com validação estrita de payload (`UNKNOWN_ENGINE_EVENT` e `INVALID_EVENT_PAYLOAD` são rejeitados);
    - `battle-presentation-engine.js`: Motor de orquestração de timeline com execução estritamente sequencial (`MAX_CONCURRENT_COMMANDS = 1`), proteção contra execuções concorrentes (`CONCURRENT_PLAYBACK_REJECTED`), cancelamento limpo (`cancel()`), reset de ciclo de vida (`reset()`) e barreira de contenção de erros (falhas no adapter não corrompem o estado da batalha);
  - 100% de separação de responsabilidades e ausência de regras de jogo na apresentação:
    - `PRESENTATION_DAMAGE_CALCULATION = 0`
    - `PRESENTATION_TYPE_CALCULATION = 0`
    - `PRESENTATION_AI_DECISIONS = 0`
    - `PRESENTATION_BATTLE_RULES = 0`
    - `PRESENTATION_FETCH_CALLS = 0`
    - `PRESENTATION_LOCALSTORAGE = 0`
    - `PRESENTATION_AUDIO_CALLS = 0`
  - Preparação para acessibilidade: suporte injetável a `reducedMotion: true` e `skipAnimations: true` zerando durações sem acessar DOM diretamente;
  - 100% de aprovação nos testes automatizados: 213 testes (40 novos testes PR01 a PR40 + 173 testes de fases anteriores) com 0 regressões.

- **PBA-009 Pokémon Animations**:
  - Implementação do primeiro subsistema visual real para movimentação dos sprites de Pokémon na Battle Arena em `assets/js/presentation/animation/` e `assets/css/battle-animations.css`:
    - `pokemon-animation-constants.js`: Catálogo de 8 animações corporais (`ENTER`, `IDLE`, `ATTACK`, `DAMAGE`, `FAINT`, `SWITCH_OUT`, `SWITCH_IN`, `VICTORY`), durações nominais centralizadas, multiplicadores direcionais (+1 player, -1 enemy) e classes CSS de transição;
    - `battle-animations.css`: Estilização GPU-accelerated via `transform` e `opacity` sem layout thrashing, responsividade com `clamp()` e suporte completo a acessibilidade via `@media (prefers-reduced-motion: reduce)` e classes `.pba-reduced-motion`;
    - `pokemon-animation-registry.js`: Registro determinístico de combatentes e alvos DOM (`player`/`enemy`) com suporte nativo a fallback de imagem caso sprite animado falhe;
    - `pokemon-animation-controller.js`: Controlador mestre de ciclo de vida visual com métodos dedicados, gerenciamento automático de pausa/retomada de idle, política de concorrência `CANCEL_PREVIOUS`, cancelamento seguro e reset completo de estado base;
    - `pokemon-animation-dom-adapter.js`: Adaptador real implementando a interface `BattlePresentationAdapter` da PBA-008, conectando Presentation Commands aos métodos do Animation Controller, com bloqueio estrito de reação a dano quando `damage === 0`;
    - `tests/visual/pokemon-animation-harness.html`: Harness visual dedicado e isolado para testes manuais e em navegadores reais;
  - 100% de separação e conformidade arquitetural:
    - `PRESENTATION ENGINE ≠ ANIMATION IMPLEMENTATION`
    - `ANIMATION_DAMAGE_CALCULATION = 0`
    - `ANIMATION_TYPE_CALCULATION = 0`
    - `ANIMATION_AI_DECISIONS = 0`
    - `ANIMATION_BATTLE_RULES = 0`
    - `ANIMATION_FETCH_CALLS = 0`
    - `ANIMATION_LOCALSTORAGE = 0`
    - `ANIMATION_AUDIO_CALLS = 0`
  - Fronteira estrita respeitada: Move VFX (fogo, água, raio, partículas) NÃO implementados nesta fase (escopo exclusivo da PBA-010);
  - 100% de aprovação nos testes automatizados: 249 testes (36 novos testes AN01 a AN36 + 213 testes de fases anteriores) com 0 falhas e 0 regressões.

- **PBA-010 Move Visual Effects**:
  - Implementação de subsistema profissional, reutilizável e escalável de efeitos visuais para golpes Pokémon na Battle Arena em `assets/js/vfx/` e `assets/css/move-vfx.css`:
    - `move-vfx-constants.js`: 18 Type Families (`VFX_TYPE_COUNT = 18`), 8 Effect Archetypes (`PROJECTILE`, `BEAM`, `STREAM`, `BURST`, `SLASH`, `IMPACT`, `WAVE`, `AURA`), thresholds de intensidade (`LOW` <= 50, `MEDIUM` 51..90, `HIGH` > 90), tempos nominais, limites de partículas (`MAX_PARTICLES_PER_EFFECT = 12`), camadas z-index e catálogo de overrides para golpes icônicos;
    - `move-vfx-resolver.js`: Resolver puro `MoveVfxResolver.resolve(moveData)` mapeando golpes para descritores imutáveis com fallback genérico por tipo, rejeição controlada de golpes inválidos e status moves não suportados;
    - `move-vfx-registry.js`: Registro de palco e combatentes (`player`, `enemy`) com cálculo de trajetórias dinâmicas e fallback virtual para testes headless em Node.js;
    - `move-vfx-dom-renderer.js`: Renderizador DOM baseado em CSS custom properties (`--vfx-dir`, `--vfx-scale`, `--vfx-color-*`), transformações aceleradas por GPU (`translate3d`, `scale`, `opacity`), impacto no alvo, dissipação controlada em Miss (`MISS_IMPACT_EFFECT = NO`) e Imunidade (`IMMUNITY_DAMAGE_IMPACT = NO`) e zero vazamento de nós DOM (`VFX_DOM_LEAK = NONE`);
    - `move-vfx-controller.js`: Controlador assíncrono do ciclo de vida de VFX com política de concorrência `CANCEL_PREVIOUS`, métodos `cancel()`, `reset()`, limpeza automática de nós/timers/listeners e suporte estrito a `reducedMotion`;
    - `move-vfx.css`: Estilização CSS completa para todos os 8 arquétipos, partículas leves, anéis e bursts com `@media (prefers-reduced-motion: reduce)`;
    - `composite-battle-dom-adapter.js`: Adaptador composto orquestrando `PokemonAnimationController` (movimento de ataque do atacante) + `MoveVfxController` (trajetória e impacto do VFX) durante `MOVE_ANNOUNCEMENT`, mantendo a reação de dano do defensor sincronizada no comando `HP_TRANSITION`;
    - `tests/visual/move-vfx-harness.html`: Harness visual completo com suporte a 18 tipos, 8 arquétipos, 3 intensidades, 4 desfechos (Hit, Miss, Immune, Super Effective), 6 presets icônicos e inspeção responsiva;
  - 100% de separação e conformidade arquitetural:
    - `POKEMON ANIMATION ≠ MOVE VISUAL EFFECT`
    - `VFX_DAMAGE_CALCULATION = 0`
    - `VFX_TYPE_CALCULATION = 0`
    - `VFX_AI_DECISIONS = 0`
    - `VFX_BATTLE_RULES = 0`
    - `VFX_FETCH_CALLS = 0`
    - `VFX_LOCALSTORAGE = 0`
    - `VFX_AUDIO_CALLS = 0`
  - 100% de aprovação nos testes automatizados: 289 testes (40 novos testes VFX01 a VFX40 + 249 testes de fases anteriores) com 0 falhas e 0 regressões.

---

## 5. Decisões Importantes Já Tomadas

1. **Stack Tecnológica**: JavaScript Vanilla ES6+, CSS3 modular e HTML5 semântico, sem migração forçada para frameworks (React/Vue/Svelte) ou empacotadores pesados antes da necessidade técnica real.
2. **Compatibilidade com GitHub Pages e Local**: Execução garantida via protocolo `file://`, servidores de desenvolvimento locais e GitHub Pages.
3. **Namespaces de Armazenamento**:
    - `pokedex_favorites`: IDs favoritos (preservado);
    - `pokedex_theme`: tema visual `'dark'` ou `'light'` (preservado);
    - `team.current`: `{ version: 1, pokemonIds: [25, 6, 94] }` (PBA-002);
    - `battle.*`: reservado para estados da Battle Arena (PBA-003+).
4. **Resiliência de Rede**: Dados de Pokémon do time são buscados sob demanda com cache em memória, apresentando estado localizado de erro caso a PokéAPI esteja indisponível sem quebrar a aplicação.
5. **Configurações Oficiais do Move System (PBA-005)**:
   ```text
   MOVE_SYSTEM = COMPLETE_V1
   PHYSICAL_MOVES = YES
   SPECIAL_MOVES = YES
   STATUS_MOVES = NOT_YET
   PP = YES
   ACCURACY = YES
   STAB = YES
   INTERNAL_RNG = NO
   ```
6. **Configurações Oficiais da Batalha 3x3 (PBA-006)**:
   ```text
   BATTLE_3V3 = YES
   PLAYER_TEAM_SIZE = 3
   ENEMY_TEAM_SIZE = 3
   VOLUNTARY_SWITCH = YES
   SWITCH_PRIORITY = YES
   FORCED_REPLACEMENT = YES
   HP_PERSISTS_ACROSS_SWITCH = YES
   PP_PERSISTS_ACROSS_SWITCH = YES
   TEAM_DEFEAT = YES
   AI = NOT_YET
   ```
7. **Configurações Oficiais da Battle AI (PBA-007)**:
   ```text
   BATTLE_AI = YES
   AI_SIMPLE = YES
   AI_SMART = YES
   AI_MOVE_SELECTION = YES
   AI_VOLUNTARY_SWITCH = YES
   AI_FORCED_REPLACEMENT = YES
   AI_EXPECTED_DAMAGE = YES
   AI_INTERNAL_RNG = NO
   AI_CHEATING = NO
   ```
8. **Configurações Oficiais da Battle Presentation Engine (PBA-008)**:
   ```text
   PRESENTATION_ENGINE = YES
   EVENT_TO_COMMAND_MAPPING = YES
   ENGINE_EVENT_COVERAGE = 100%
   SEQUENTIAL_TIMELINE = YES
   MAX_CONCURRENT_COMMANDS = 1
   ASYNC_ADAPTER = YES
   RECORDING_ADAPTER = YES
   NULL_ADAPTER = YES
   CANCELLATION = YES
   RESET_AFTER_CANCEL = YES
   REDUCED_MOTION_READY = YES
   SKIP_PRESENTATION_READY = YES
   CONCURRENT_PLAYBACK_PROTECTION = YES
   PRESENTATION_DAMAGE_CALCULATION = 0
   PRESENTATION_TYPE_CALCULATION = 0
   PRESENTATION_AI_DECISIONS = 0
   PRESENTATION_BATTLE_RULES = 0
   PRESENTATION_FETCH_CALLS = 0
   PRESENTATION_LOCALSTORAGE = 0
   PRESENTATION_AUDIO_CALLS = 0
   REAL_POKEMON_ANIMATIONS = NOT_YET
   REAL_MOVE_EFFECTS = NOT_YET
   AUDIO = NOT_YET
   FINAL_BATTLE_UI = NOT_YET
   ```
9. **Configurações Oficiais das Pokémon Animations (PBA-009)**:
   ```text
   POKEMON_ANIMATION_SYSTEM = YES
   ENTER_ANIMATION = YES
   IDLE_ANIMATION = YES
   ATTACK_MOTION = YES
   DAMAGE_REACTION = YES
   FAINT_ANIMATION = YES
   SWITCH_OUT = YES
   SWITCH_IN = YES
   VICTORY_ANIMATION = YES
   PLAYER_ENEMY_ORIENTATION = YES
   GPU_HARDWARE_ACCELERATION = YES
   REDUCED_MOTION_SUPPORT = YES
   IDLE_LIFECYCLE_MANAGEMENT = YES
   CONCURRENCY_POLICY = CANCEL_PREVIOUS
   SPRITE_FALLBACK = YES
   MOVE_VFX = NOT_YET
   AUDIO = NOT_YET
   CAMERA_EFFECTS = NOT_YET
   FINAL_BATTLE_UI = NOT_YET
   ```
10. **Configurações Oficiais dos Move Visual Effects (PBA-010)**:
   ```text
   MOVE_VFX_SYSTEM = YES
   TYPE_FAMILIES = 18
   REUSABLE_ARCHETYPES = YES
   INTENSITY_CLASSIFICATION = YES
   GENERIC_FALLBACK = YES
   MISS_VFX = YES
   IMMUNITY_VFX = YES
   SUPER_EFFECTIVE_VFX = YES
   REDUCED_MOTION = YES
   COMPOSITE_ADAPTER = YES
   MAX_PARTICLES_PER_EFFECT = 12
   VFX_DOM_LEAK = NONE
   VFX_RESOURCE_LEAK = NONE
   AUDIO = NOT_YET
   CAMERA_EFFECTS = NOT_YET
   FINAL_BATTLE_UI = NOT_YET
   ```

---

## 6. Estado Atual do Repositório

- **Branch**: `main`
- **Status das Fases**:
  - `PBA-001 = PASS`
  - `PBA-002 = PASS`
  - `PBA-003 = PASS`
  - `PBA-004 = PASS`
  - `PBA-005 = PASS`
  - `PBA-006 = PASS`
  - `PBA-007 = PASS`
  - `PBA-008 = PASS`
  - `PBA-009 = PASS`
  - `PBA-010 = PASS`
- **Working Tree**: Atualizado com os subsistemas de Move VFX, Composite Adapter, CSS e suíte VFX01–VFX40

---

## 7. Próxima Fase Planejada

```text
NEXT_PHASE = PBA-011 — Audio System
```

*(Atenção: A Fase PBA-011 NÃO deve ser iniciada automaticamente; aguardar solicitação explícita do usuário).*

