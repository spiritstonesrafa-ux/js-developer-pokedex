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
  - 100% de aprovação nos testes automatizados: 130 testes (35 novos testes B3-01 a B3-35 + 95 testes anteriores) sem nenhuma falha ou regressão.

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
- **Working Tree**: Limpo (pré-commit da fase PBA-006)

---

## 7. Próxima Fase Planejada

```text
NEXT_PHASE = PBA-007 — Battle AI
```

*(Atenção: A Fase PBA-007 NÃO deve ser iniciada automaticamente; aguardar solicitação explícita do usuário).*

