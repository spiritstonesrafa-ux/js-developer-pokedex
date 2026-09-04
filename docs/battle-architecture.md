# ⚔️ Arquitetura Técnica: Pokémon Battle Arena

Documento de especificação arquitetural para a evolução do projeto **Pokédex Pro** (desafio DIO) para a plataforma integrada **Pokédex Pro + Pokémon Battle Arena**.

---

## 1. Objetivo Geral

O objetivo deste projeto é expandir a Pokédex existente — construída com **HTML5**, **CSS3** e **JavaScript Vanilla** consumindo a **PokéAPI REST** — transformando-a em uma aplicação de portfólio robusta e completa, contendo:

1. **Pokédex Completa** (preservada e otimizada);
2. **Team Builder** (gerenciamento e persistência de equipes táticas de 1 a 6 Pokémon);
3. **Pokémon Battle Arena** (simulador de batalhas por turnos 1x1 e 3x3 contra inteligência artificial, cálculo de dano fiel às mecânicas clássicas, efetividade de tipos, sistema de movimentos, animações dinâmicas e efeitos visuais/sonoros).

A evolução ocorre de maneira **incremental e orientada a fases (PBA-001 a PBA-018)**, garantindo que o código existente nunca seja quebrado e que novas funcionalidades sejam introduzidas com separação estrita de responsabilidades.

---

## 2. Princípios Arquiteturais Fundamentais

1. **Preservação da Pokédex Atual**: Nenhuma refatoração deve introduzir regressões na listagem, busca, paginação, filtros, modal ou reprodução de áudio já existentes.
2. **Regra de Ouro: Game Engine ≠ Presentation Engine**: A lógica matemática e as regras de combate nunca dependem de elementos visuais, classes CSS, APIs de áudio ou manipulação de DOM.
3. **Pureza do Modelo de Domínio**: Entidades do jogo (`Pokemon`, `Move`, `Team`, `Trainer`) contêm dados e regras de negócio puras, operando independentemente de bibliotecas externas e da PokéAPI.
4. **Isolamento de Estado (Game State)**: O estado da batalha é serializável, determinístico e desacoplado da interface gráfica.
5. **Zero Dependências Pesadas / Vanilla First**: O projeto demonstra proficiência técnica em JavaScript Vanilla, arquitetura limpa, manipulação avançada de DOM e CSS moderno.
6. **Acessibilidade e Desempenho**: Suporte futuro a `prefers-reduced-motion`, controle de volume independente, contrastes adequados e carregamento sob demanda (*lazy loading*).

---

## 3. Separação em Camadas

A arquitetura do projeto adota uma estrutura em camadas unidirecional:

```text
       ┌───────────────────────────────┐
       │          Data / API           │  (poke-api.js / PokemonRepository)
       └──────────────┬────────────────┘
                      │ DTOs / JSON transformados
                      ▼
       ┌───────────────────────────────┐
       │         Domain Model          │  (Pokemon, Move, Team, Trainer)
       └──────────────┬────────────────┘
                      │ Entidades e atributos puros
                      ▼
       ┌───────────────────────────────┐
       │          Game Engine          │  (BattleEngine, TurnManager, DamageCalc)
       └──────────────┬────────────────┘
                      │ Eventos de Batalha (Action Events)
                      ▼
       ┌───────────────────────────────┐
       │      Presentation Engine      │  (AnimationQueue, AudioSystem, VFX)
       └──────────────┬────────────────┘
                      │ Atualizações Visuais / Áudio
                      ▼
       ┌───────────────────────────────┐
       │           UI / DOM            │  (Telas, Painéis, Healthbars, Modais)
       └───────────────────────────────┘
```

---

## 4. O Paradigma "Game Engine ≠ Presentation Engine"

Esta é a diretriz mais crítica para o desenvolvimento da Battle Arena.

### Battle Engine (Lógica Pura)
Responsável por:
- Determinar a iniciativa de ataque com base em *Speed* e prioridade do movimento;
- Calcular precisão (*accuracy*) e taxa de acerto crítico (*critical hit*);
- Calcular o dano real através da fórmula padrão considerando ataque, defesa, STAB (*Same-Type Attack Bonus*) e tabela de tipos;
- Gerenciar a fila de turnos e status de combate (*fainted*, trocas, turnos decorridos);
- Executar a tomada de decisão da IA adversária;
- Emitir uma sequência determinística de **Eventos de Ação** (*Action Events*).

### Presentation Engine (Efeitos, Som e Visuais)
Responsável por:
- Consumir os *Action Events* emitidos pela Battle Engine de forma assíncrona;
- Reproduzir animações de sprites (entrada, ataque corporal, projéteis, impacto, recuo);
- Sincronizar efeitos sonoros (*cry* do Pokémon, som de golpe, impacto, vitória/derrota);
- Controlar animações de barras de HP e feedback numérico de dano;
- Disparar efeitos visuais (tremores de tela / *shake*, flashes, partículas de fogo, água, eletricidade);
- Notificar a UI quando a apresentação do turno foi finalizada, liberando o próximo comando do jogador.

> **Importante**: Se a camada de apresentação for desativada (por exemplo, em testes automatizados ou em modo de simulação rápida), a batalha pode ser executada instantaneamente em milissegundos sem qualquer erro ou dependência gráfica.

---

## 5. Fluxo Futuro de uma Batalha

```mermaid
sequenceDiagram
    autonumber
    actor Player as Treinador (UI)
    participant UI as Battle UI
    participant Engine as Battle Engine
    participant Presenter as Presentation Engine
    participant Audio as Audio System

    Player->>UI: Seleciona Ação (Ex: Atacar com Thunderbolt)
    UI->>Engine: dispatchAction({ type: 'MOVE', moveId: 'thunderbolt' })
    Note over Engine: 1. Processa Ação do Adversário (IA)<br/>2. Compara Velocidades (Speed Check)<br/>3. Calcula Efetividade & Dano<br/>4. Atualiza HP do Estado Interno
    Engine-->>UI: Retorna Batch de Eventos: [MoveStarted, DamageApplied, PokemonFainted]
    
    UI->>Presenter: playSequence(events)
    Presenter->>Audio: Tocar SFX do Golpe (Electric)
    Presenter->>UI: Animar Sprite de Ataque & Partículas de Raio
    Presenter->>UI: Animar Redução da Barra de HP
    Presenter->>UI: Exibir "Ataque Super Efetivo!" no Battle Log
    
    Presenter-->>UI: Sequência Concluída
    UI-->>Player: Desbloqueia Controles para o Próximo Turno
```

---

## 6. Responsabilidades dos Módulos Detalhados

| Módulo | Camada | Responsabilidade Técnica |
| :--- | :--- | :--- |
| `poke-api.js` | Data | Requisições HTTP com Fetch API para a PokéAPI REST, conversão de payloads brutos em instâncias do modelo. |
| `PokemonRepository` | Data | Gerenciamento de cache em memória e LocalStorage, reduzindo chamadas repetidas à rede. |
| `Pokemon` | Domain | Representação de atributos base (*hp, attack, defense, spAttack, spDefense, speed*), tipos, habilidades e dados de espécie. |
| `Move` | Domain | Representação de golpes: tipo, categoria (*physical, special, status*), poder (*power*), precisão (*accuracy*) e PP. |
| `TypeChart` | Domain | Matriz bidimensional de relações elementais (fraquezas 2x, resistências 0.5x e imunidades 0x). |
| `Team` | Domain | Estrutura de equipe (1 a 6 integrantes), validações de tamanho, Pokémon ativo e reservas. |
| `BattleEngine` | Engine | Controlador central da lógica de batalha, turnos, condições de vitória/derrota. |
| `DamageCalculator` | Engine | Implementação matemática da fórmula de dano dos jogos da franquia, aplicando modificadores. |
| `BattleAI` | Engine | Heurística adversária (seleção de movimentos por efetividade, trocas inteligentes). |
| `BattlePresentation` | Presentation | Orquestrador da fila de animações e transições entre estados gráficos. |
| `AudioSystem` | Presentation | Gerenciador de canais de áudio com canais separados (Música de Fundo, SFX de Ataque, Cry, Interface) e controle de volume. |
| `AnimationSystem` | Presentation | Execução de animações CSS/Canvas de movimentos de sprites e partículas elementais. |
| `BattleUI` | UI | Painéis de comando, caixas de diálogo (*Battle Log*), seletores de golpe e barras de status. |

---

## 7. Decisões Técnicas das Fases

### Fase PBA-001 (Foundation)
1. **Manutenção dos Scripts Globais Sem Quebra**: Os arquivos existentes (`pokemon-model.js`, `poke-api.js`, `main.js`) foram mantidos compatíveis com carregamento direto sem empacotadores, viabilizando execução direta no GitHub Pages e no protocolo local `file://`.
2. **Navegação Não-Destrutiva**: Introdução das abas de navegação no cabeçalho (`Pokédex`, `Meu Time`, `Batalhar`).
3. **Estrutura de Armazenamento com Namespaces**: Preservação de `pokedex_favorites` e `pokedex_theme`.

### Fase PBA-002 (Team Builder)
1. **Modelo do Time**: Capacidade máxima de 3 Pokémon (`TEAM_MAX_SIZE = 3`), proibição estrita de duplicatas (`DUPLICATE_POKEMON = FORBIDDEN`) e preservação da ordem (`ORDER_MATTERS = YES`), onde o **Slot 1** define o Líder (*Lead*) que iniciará futuras batalhas.
2. **Persistência Estruturada (`team.current`)**: Armazenamento serializado contendo apenas IDs essenciais (`{ "version": 1, "pokemonIds": [25, 6, 94] }`), com sanitização automática contra JSON corrompido, IDs inválidos ou arrays fora dos limites.
3. **Desacoplamento Modular**: Separação em três componentes especializados em `assets/js/team/`:
   - `TeamStore`: Manipulação e validação do `localStorage`;
   - `TeamManager`: Regras de negócio, reordenação e emissão de eventos;
   - `TeamUI`: Renderização dos slots (ocupados, vazios e erro), feedback dinâmico e botões de atalho.
4. **Sincronização em Tempo Real**: Atualização instantânea dos cards da Pokédex (`✓ No time`), botões do modal e contadores do cabeçalho sem necessidade de recarregamento.

### Fase PBA-003 (Battle Engine v1)
1. **Núcleo Matemático Isolado e Desacoplado**:
   - Criação dos módulos em `assets/js/battle/`:
     - `battle-constants.js`: Estados (`BATTLE_STATUS`), eventos (`BATTLE_EVENTS`), ações (`BATTLE_ACTIONS`) e configurações (`BATTLE_CONFIG`);
     - `damage-calculator.js`: Cálculo de dano determinístico baseado estritamente em Ataque e Defesa;
     - `turn-manager.js`: Gerenciador de iniciativa baseado em Velocidade (*Speed*);
     - `battle-engine.js`: Criação do estado de combate, normalização de combatentes, validações contra estados inválidos/NaN, resolução de turnos e emissão de eventos ordenados.
2. **Modelo do Combatente Normalizado**:
   - Estrutura pura e independente da PokéAPI ou do DOM:
     ```json
     {
       "id": 4,
       "name": "charmander",
       "maxHp": 39,
       "currentHp": 39,
       "attack": 52,
       "defense": 43,
       "speed": 65
     }
     ```
   - Validação estrita: rejeita `id <= 0`, `name` vazio, `hp <= 0`, `attack <= 0`, `defense <= 0`, `speed < 0`, `NaN`, `Infinity`, `null` ou `undefined`.
3. **Estado de Batalha v1 (Battle State)**:
   - Serializável, determinístico e imutável nas entradas:
     ```json
     {
       "version": 1,
       "status": "IN_PROGRESS",
       "turn": 1,
       "player": { "id": 4, "name": "charmander", "maxHp": 39, "currentHp": 39, "attack": 52, "defense": 43, "speed": 65 },
       "enemy": { "id": 1, "name": "bulbasaur", "maxHp": 45, "currentHp": 45, "attack": 49, "defense": 49, "speed": 45 },
       "winner": null
     }
     ```
   - Estados: `READY`, `IN_PROGRESS`, `PLAYER_WIN`, `ENEMY_WIN`.
4. **Fórmula de Dano da PBA-003**:
   - Inspirada na estrutura clássica da franquia, porém estritamente determinística (sem randomização, sem fraquezas/resistências de tipo e sem acertos críticos):
     ```text
     SIMULATION_LEVEL = 50
     BASIC_ATTACK_POWER = 40
     
     damage = floor(((((2 * SIMULATION_LEVEL / 5) + 2) * BASIC_ATTACK_POWER * attack / defense) / 50) + 2)
     damage = max(1, damage)
     ```
   - Piso de HP: o dano recebido nunca deixa o combatente com HP negativo (`currentHp = max(0, previousHp - damage)`).
5. **Regra de Iniciativa e Desempate**:
   - O combatente com maior *Speed* atua primeiro;
   - Em caso de empate de *Speed*, aplica-se a regra determinística da fase: `PLAYER_FIRST_ON_SPEED_TIE = true` (jogador sempre atua primeiro no desempate da PBA-003).
6. **Fluxo do Turno e Suspensão de Contra-Ataque**:
   - Turno inicia -> Ordem definida -> 1º Pokémon ataca -> Dano aplicado -> Verificação de nocaute (`currentHp === 0`).
   - Se o primeiro combatente nocautear o alvo: o combate encerra imediatamente (`POKEMON_FAINTED` e `BATTLE_ENDED`), status atualizado para vitória/derrota, e o Pokémon derrotado **NÃO contra-ataca**.
   - Bloqueio pós-combate: tentativas de invocar `resolveTurn()` em batalha já encerrada são rejeitadas com erro controlado, sem corromper o estado.
7. **Barramento de Eventos Estruturados**:
   - Eventos emitidos em sequência ordenada:
     - `BATTLE_STARTED`
     - `TURN_STARTED` (com número do turno)
     - `ACTION_STARTED` (com ator e ação executada)
     - `DAMAGE_APPLIED` (com fonte, alvo, dano numérico, HP anterior e HP resultante)
     - `POKEMON_FAINTED` (com alvo derrotado)
     - `BATTLE_ENDED` (com vencedor e causa)
8. **Critérios de Isolamento Absoluto**:
   - `BATTLE_ENGINE_DOM_DEPENDENCIES = 0` (nenhum `document.*` ou `window.*` de interface);
   - `BATTLE_ENGINE_FETCH_CALLS = 0` (sem chamadas à PokéAPI durante a simulação);
   - `BATTLE_ENGINE_LOCALSTORAGE_DEPENDENCIES = 0` (sem persistência acoplada);
   - `BATTLE_ENGINE_AUDIO_DEPENDENCIES = 0` (sem dependências sonoras);
   - `INPUT_MUTATION = NONE` (entradas são clonadas e imutáveis).

### Fase PBA-004 (Type System)
1. **Catálogo Canônico dos 18 Tipos**:
   - `POKEMON_TYPES`: `normal`, `fire`, `water`, `electric`, `grass`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`.
   - Normalização rigorosa de casing e espaçamento (`" FIRE "` -> `"fire"`), com rejeição estrita de tipos inválidos, vazios ou desconhecidos (`shadow`, `unknown`, etc.).
2. **Matriz Completa de Efetividade (Type Chart)**:
   - Implementação em `assets/js/battle/type-chart.js` cobrindo todas as 324 relações elementais ($18 \times 18$) das gerações modernas (Gen 6+ com tipo Fairy).
   - Multiplicadores para defensores single-type: `0` (imune), `0.5` (resistido), `1` (neutro), `2` (super efetivo).
3. **Cálculo e Combinações de Dual-Type (`TypeEffectiveness`)**:
   - Módulo puro `assets/js/battle/type-effectiveness.js` calculando a efetividade combinada:
     $$\text{multiplier} = \text{chart}[A][D_1] \times \text{chart}[A][D_2]$$
   - Suporte completo aos multiplicadores resultantes: `0`, `0.25`, `0.5`, `1`, `2` e `4`.
   - Prevalência estrita de imunidade: se qualquer relação elemental for $0$, o multiplicador final é necessariamente $0$ ($x \times 0 = 0$).
   - Validações: rejeita defensores com tipos duplicados (`['water', 'water']`), mais de 2 tipos ou listas vazias.
   - Classificação estruturada: `IMMUNE` (0), `RESISTED` (< 1), `NEUTRAL` (1), `SUPER_EFFECTIVE` (> 1).
4. **Combatant Model v2**:
   - Normalização de combatentes com tipos canônicos validados:
     ```json
     {
       "id": 4,
       "name": "charmander",
       "types": ["fire"],
       "maxHp": 39,
       "currentHp": 39,
       "attack": 52,
       "defense": 43,
       "speed": 65
     }
     ```
5. **Integração com a Calculadora de Dano (`DamageCalculator`)**:
   - Separação modular de responsabilidades:
     - `calculateBaseDamage(attack, defense, power, level)`: gera o dano base puro ($\ge 1$).
     - `applyModifier(baseDamage, multiplier)`: aplica a efetividade com piso em zero para imunidade e piso mínimo de $1$ para não-imunidades:
       ```javascript
       if (multiplier === 0) return 0;
       return Math.max(1, Math.floor(baseDamage * multiplier));
       ```
6. **Barramento de Eventos Atualizado**:
   - Inclusão do evento `TYPE_EFFECTIVENESS_RESOLVED` disparado imediatamente antes de `DAMAGE_APPLIED`:
     ```json
     {
       "type": "TYPE_EFFECTIVENESS_RESOLVED",
       "source": "player",
       "target": "enemy",
       "attackType": "fire",
       "defenderTypes": ["grass", "poison"],
       "multiplier": 2,
       "classification": "SUPER_EFFECTIVE"
     }
     ```
   - Ordem estrita do ciclo de ação: `ACTION_STARTED` -> `TYPE_EFFECTIVENESS_RESOLVED` -> `DAMAGE_APPLIED` (-> `POKEMON_FAINTED` -> `BATTLE_ENDED`).
7. **Ponte Temporária do `BASIC_ATTACK`**:
   - Enquanto o catálogo de movimentos (*Move System*) não é introduzido na Fase PBA-005, o `BASIC_ATTACK` adota temporariamente o tipo primário do atacante (`attacker.types[0]`).
   - STAB (*Same-Type Attack Bonus*) **não foi implementado**, permanecendo reservado para fases futuras.

---

## 8. Decisões Explicitamente Adiadas

### Fase PBA-005 (Move System)
1. **Modelo Canônico de Golpe (`MoveModel`)**:
   - Estrutura imutável normalizada com validação rigorosa (`assets/js/battle/move-model.js`):
     ```json
     {
       "id": 85,
       "name": "thunderbolt",
       "type": "electric",
       "power": 90,
       "accuracy": 100,
       "pp": 15,
       "damageClass": "special"
     }
     ```
   - Categoria de dano (`damageClass`): `physical` e `special`.
   - Golpes da categoria `status` (ex: *Growl*, *Thunder Wave*) são reconhecidos pelo modelo, porém rejeitados com erro controlado (`UNSUPPORTED_IN_PBA_005`), sem conversão para danos fictícios.
   - Suporte a golpes *Always-Hit* (com `accuracy: null`), dispensando checagem de acurácia.
2. **Combatant Model v3**:
   - Expansão dos atributos de combate para incluir ataque/defesa especial e catálogo de movimentos:
     ```json
     {
       "id": 6,
       "name": "charizard",
       "types": ["fire", "flying"],
       "maxHp": 78,
       "currentHp": 78,
       "attack": 84,
       "defense": 78,
       "specialAttack": 109,
       "specialDefense": 85,
       "speed": 100,
       "moves": [
         { "id": 53, "name": "flamethrower", "type": "fire", "power": 90, "accuracy": 100, "maxPp": 15, "currentPp": 15, "damageClass": "special" },
         { "id": 337, "name": "dragon-claw", "type": "dragon", "power": 80, "accuracy": 100, "maxPp": 15, "currentPp": 15, "damageClass": "physical" },
         { "id": 10, "name": "scratch", "type": "normal", "power": 40, "accuracy": 100, "maxPp": 35, "currentPp": 35, "damageClass": "physical" }
       ]
     }
     ```
   - Regras de loadout: mínimo de 1 golpe, máximo de 4 golpes (`MOVE_LOADOUT_MIN = 1`, `MOVE_LOADOUT_MAX = 4`), sem duplicatas por ID ou nome.
3. **Divisão Físico vs Especial e Seleção de Atributos**:
   - Golpes Físicos: utilizam `attacker.attack` contra `defender.defense`.
   - Golpes Especiais: utilizam `attacker.specialAttack` contra `defender.specialDefense`.
   - Independência cruzada comprovada: alterar `specialAttack` não altera o dano físico, e alterar `attack` não altera o dano especial.
4. **Move Power & Desativação do Tipo Primário Temporário**:
   - O poder do ataque agora é dinâmico e fornecido pelo golpe selecionado (`move.power`).
   - O tipo da ação agora é derivado exclusivamente do golpe (`attackType = move.type`).
   - A regra de ponte temporária da PBA-004 (`BASIC_ATTACK_PRIMARY_TYPE_BRIDGE_ACTIVE`) foi desativada no caminho ativo do Battle Engine (`NO`).
5. **Sistema de PP (Power Points)**:
   - Estado runtime (`currentPp`) isolado do modelo estático (`maxPp`).
   - Consumo de 1 PP ocorre no início da execução da ação, tanto em acertos (*hit*) quanto em erros (*miss*).
   - Bloqueio estrito de golpes com `currentPp <= 0` (`ACTION_REJECTED`).
   - Preservação em nocaute: se o primeiro atacante nocautear o adversário, o golpe do defensor **não é executado e seu PP permanece inalterado**.
6. **Resolução Determinística de Precisão (Accuracy)**:
   - A Battle Engine não invoca `Math.random()`.
   - Ações externas recebem opcionalmente `accuracyRoll` ($1 \le \text{roll} \le 100$).
   - Condição de acerto: $\text{roll} \le \text{move.accuracy}$ (ou golpe *Always-Hit*).
   - Em caso de *miss*: emite evento `MOVE_MISSED`, consome PP, não emite `DAMAGE_APPLIED` e mantém o HP do defensor intacto.
7. **STAB (Same-Type Attack Bonus) e Pipeline de Dano v2**:
   - Multiplicador de $1.5\times$ caso `attacker.types.includes(move.type)`, e $1.0\times$ caso contrário.
   - Prevalência estrita de imunidade: se `typeMultiplier === 0`, o dano final é impreterivelmente $0$ (STAB jamais supera imunidade).
   - Pipeline de cálculo:
     $$\text{baseDamage} = \text{calculateBaseDamage}(\text{attackStat}, \text{defenseStat}, \text{power}, \text{level})$$
     $$\text{finalDamage} = \text{applyModifier}(\text{baseDamage}, \text{typeMultiplier}, \text{stabMultiplier})$$
     $$\text{danoModificado} = \lfloor \text{baseDamage} \times \text{stabMultiplier} \times \text{typeMultiplier} \rfloor$$
     $$\text{finalDamage} = \begin{cases} 0 & \text{se } \text{typeMultiplier} = 0 \\ \max(1, \text{danoModificado}) & \text{se } \text{typeMultiplier} > 0 \end{cases}$$
8. **Fronteira de Dados e Integração com a PokéAPI**:
   - `pokeApi.getMoveDetail(moveOrIdOrUrl)` implementado em `assets/js/poke-api.js` com cache em memória (`Map`) para evitar requisições repetidas.
   - A Battle Engine permanece 100% isolada de chamadas `fetch()`.
9. **Barramento de Eventos do Move System**:
   - Fluxo completo em caso de HIT:
     $$\text{TURN\_STARTED} \to \text{ACTION\_STARTED} \to \text{MOVE\_SELECTED} \to \text{MOVE\_USED} \to \text{PP\_CHANGED} \to \text{STAB\_RESOLVED} \to \text{TYPE\_EFFECTIVENESS\_RESOLVED} \to \text{DAMAGE\_APPLIED}$$
     (seguido de $\text{POKEMON\_FAINTED} \to \text{BATTLE\_ENDED}$ em caso de nocaute).
   - Fluxo em caso de MISS:
     $$\text{TURN\_STARTED} \to \text{ACTION\_STARTED} \to \text{MOVE\_SELECTED} \to \text{MOVE\_USED} \to \text{PP\_CHANGED} \to \text{MOVE\_MISSED}$$

---

## 8. Arquitetura da Batalha 3x3 e Sistema de Trocas (PBA-006)

A Fase PBA-006 evoluiu o motor matemático de combate de 1x1 para confrontos completos de equipes 3x3 (**3 Pokémon contra 3 Pokémon**), introduzindo:

### 8.1 Battle Team Model e Validação Estrita
- **Tamanho Fixo**: Exatamente 3 integrantes por lado (`TEAM_SIZE = 3`). Batalhas com 0, 1, 2 ou 4+ Pokémon são rejeitadas com erro explícito (`INVALID_TEAM_SIZE`).
- **Unicidade de Espécies**: Proibição de Pokémon duplicados na mesma equipe pelo `id`.
- **Validação Individual**: Cada combatente continua sendo validado pelas regras do *Combatant Model v3* (HP, stats, loadout de 1 a 4 moves válidos).
- **Líder Inicial**: O Pokémon fornecido no índice 0 (Slot 1 do Team Builder) é preservado rigorosamente como o combatente ativo inicial (`activeIndex: 0`).

### 8.2 Separação de Responsabilidade: Team Builder vs Battle State
$$\text{team.current (LocalStorage)} \neq \text{Battle Runtime State}$$
O Team Builder armazena apenas a seleção do usuário (`pokemonIds`). A Battle Engine cria instâncias runtime totalmente desacopladas, com clones profundos independentes para `currentHp`, `currentPp` e flags de estado. A persistência do time nunca é alterada pelo combate.

### 8.3 Battle State v2
Estrutura determinística, serializável e livre de DOM:
```json
{
  "version": 2,
  "status": "IN_PROGRESS",
  "turn": 1,
  "player": {
    "activeIndex": 0,
    "team": [
      { "id": 4, "name": "charmander", "currentHp": 39, "moves": [...] },
      { "id": 25, "name": "pikachu", "currentHp": 35, "moves": [...] },
      { "id": 7, "name": "squirtle", "currentHp": 44, "moves": [...] }
    ]
  },
  "enemy": {
    "activeIndex": 0,
    "team": [
      { "id": 1, "name": "bulbasaur", "currentHp": 45, "moves": [...] },
      { "id": 74, "name": "geodude", "currentHp": 40, "moves": [...] },
      { "id": 130, "name": "gyarados", "currentHp": 95, "moves": [...] }
    ]
  },
  "winner": null
}
```

### 8.4 Pokémon Ativo vs Banco
- **Ativo**: Exatamente um Pokémon por lado (`state[side].activeIndex`). Apenas o ativo pode desferir golpes (`MOVE`), receber danos e consumir PP.
- **Banco**: Membros reservas (`activeIndex !== index`) não atacam, não recebem dano passivo e mantêm seu HP e PP estritamente intactos.

### 8.5 Prioridade da Troca Voluntária (Switch Priority)
$$\text{SWITCH} > \text{MOVE}$$
- Quando um treinador seleciona uma ação `SWITCH`, ela possui prioridade estrita de fase e ocorre **antes** de qualquer ataque `MOVE`, ignorando comparações de *Speed*.
- O novo Pokémon entra em campo imediatamente, tornando-se o novo alvo do golpe adversário no mesmo turno.
- Em caso de `SWITCH vs SWITCH`, ambas as trocas ocorrem antes de qualquer ação ofensiva, de forma determinística (Player depois Enemy), sem geração de dano.

### 8.6 Persistência Rigorosa de HP e PP no Banco
- Trocar de Pokémon não restaura HP nem recupera PP (`SWITCH_HP_PERSISTENCE = PASS`, `SWITCH_PP_PERSISTENCE = PASS`).
- Um Pokémon ferido ou com PP consumido que vai para o banco e posteriormente retorna ao campo preserva exatamente os mesmos valores.

### 8.7 Troca Forçada após Nocaute (Forced Replacement)
- Se o Pokémon ativo tem seu HP reduzido a 0 e a equipe ainda possui reservas com HP > 0:
  - A batalha **não termina**;
  - O estado transita para `AWAITING_REPLACEMENT`;
  - O motor emite o evento `REPLACEMENT_REQUIRED` contendo o ID do Pokémon nocauteado e os IDs disponíveis na reserva;
  - A troca forçada é resolvida explicitamente via `BattleEngine.resolveReplacement(state, replacementActions)`, desacoplando a decisão (feita futuramente por UI ou IA) do motor.
- O substituto entra com o status retornando para `IN_PROGRESS` e o turno é incrementado para o próximo ciclo de decisões. O Pokémon substituto **não** recebe o golpe que já havia sido concluído no turno anterior.

### 8.8 Derrota da Equipe e Fim da Batalha (Team Defeat)
- Um lado só é considerado derrotado quando **todos os 3 integrantes** estiverem com `currentHp === 0`.
- Nesse momento, são emitidos em sequência ordenada: `POKEMON_FAINTED`, `TEAM_DEFEATED` e `BATTLE_ENDED`.
- O status transita para `PLAYER_WIN` ou `ENEMY_WIN`.

### 8.9 Novos Eventos Estruturados
| Evento | Payload Semântico | Descrição |
|---|---|---|
| `SWITCH_STARTED` | `{ side, currentPokemonId, targetPokemonId }` | Início de uma troca voluntária |
| `POKEMON_SWITCHED` | `{ side, previousPokemonId, newPokemonId, reason }` | Troca concretizada (`reason: 'VOLUNTARY'` ou `'FAINT_REPLACEMENT'`) |
| `REPLACEMENT_REQUIRED` | `{ side, faintedPokemonId, availablePokemonIds }` | Notificação de necessidade de substituição obrigatória pós-nocaute |
| `TEAM_DEFEATED` | `{ side, teamSize }` | Notificação de que todos os 3 membros da equipe caíram |

---

## 9. Arquitetura da Inteligência Artificial: Battle AI (PBA-007)

A Fase PBA-007 implementou um subsistema dedicado e determinístico de Inteligência Artificial para controle do adversário (ou de qualquer combatente), mantendo a separação estrita:
$$\text{BATTLE ENGINE} \neq \text{BATTLE AI}$$
- **Battle Engine**: Autoridade absoluta das regras de combate (turnos, efetividade, cálculo e aplicação de dano, consumo de PP, transição de estados e eventos).
- **Battle AI**: Analisador estratégico do estado atual visível que escolhe uma ação legal (`MOVE` ou `SWITCH`) sem mutar o estado e sem executar efeitos colaterais.

### 9.1 Avaliador Puro de Combate (BattleEvaluator)
- **Função**: `BattleEvaluator.evaluateMove(attacker, defender, move)` e `BattleEvaluator.evaluateMatchup(candidate, opponent)`.
- **Dano Esperado (Expected Value)**:
  $$\text{expectedDamage} = \lfloor \text{damageIfHit} \times (\text{accuracy} / 100) \rfloor$$
  Para golpes *Always Hit* (`accuracy: null` ou `'ALWAYS_HIT'`), o fator de acurácia é $1.0$.
- **Classificação de Nocaute**: `wouldKo = damageIfHit >= defender.currentHp`.
- **Garantia de Imutabilidade**: Não altera HP, PP, flags ou listas do atacante e do defensor.

### 9.2 Estratégias Programáticas
1. **SIMPLE**:
   - Totalmente previsível e rígida;
   - Nunca realiza troca voluntária (`SIMPLE_AI_VOLUNTARY_SWITCH = NO`);
   - Seleciona o primeiro golpe com `currentPp > 0` do loadout;
   - Em caso de substituição obrigatória pós-nocaute, seleciona o primeiro Pokémon vivo na ordem da equipe.
2. **SMART**:
   - Avalia profundamente todos os golpes utilizáveis e os confrontos de banco;
   - Pondera dano esperado, STAB ($1.5\times$), fraquezas e resistências elementais, atributos físicos/especiais e probabilidade de acerto;
   - Descarta estritamente golpes imunes ($0\times$) quando alternativas com dano positivo existem;
   - Prioriza nocaute garantido através de bonificação (`KO_BONUS = 1000`);
   - Realiza trocas voluntárias estratégicas e conservadoras.

### 9.3 Regras de Troca Voluntária da SMART AI
- **SW1 (Imunidade Total)**: Se todos os golpes utilizáveis do ativo possuem eficácia $0\times$ (imunidade absoluta) e existe reserva capaz de causar dano positivo.
- **SW2 (Matchup Severamente Desfavorável)**: Se o melhor multiplicador de tipo do ativo for $\le 0.5\times$ (sem KO garantido) e houver reserva com golpe super efetivo ($\ge 2.0\times$) cuja pontuação composta supere o ativo pela margem estratégica (`SMART_SWITCH_MARGIN = 1.3`), sem risco defensivo extremo (reserva não sofre 1-hit KO se o ativo não sofria).
- **SW3 (Esgotamento de PP)**: Se todos os golpes do ativo estão com 0 PP e há membros no banco com golpes utilizáveis.

### 9.4 Substituição Forçada Pós-Nocaute
- Avalia todos os reservas vivos (`currentHp > 0`, `index !== activeIndex`);
- Pontuação composta:
  $$\text{score} = (\text{effectiveDamage} \times 2.5) + (\text{remainingHpAfterHit} \times 1.5) - (\text{defensiveRisk} \times 150) + \text{bônusKO} - \text{penalidadeKO}$$
- Prioriza reservas com alto dano efetivo, alta sobrevivência defensiva e maior HP remanescente.

### 9.5 Desempate Determinístico e Segurança
- Desempate de golpes: 1º maior `score`, 2º maior `expectedDamage`, 3º maior `currentPp`, 4º menor posição no loadout.
- **Zero RNG Interno**: 0 chamadas a `Math.random()` ou `crypto`. O roll de acurácia é injetado externamente ao enviar a ação ao Engine.
- **Zero Trapaça**: A IA não inspeciona variáveis externas de ações futuras do jogador ou intenções de turno.

---

## 10. Decisões Explicitamente Adiadas

- **Golpes de Status (Status Moves)**: Reconhecidos na validação, porém com efeitos (Burn, Poison, Paralysis, Sleep, Freeze, Buffs/Debuffs) reservados para fases futuras.
- **Acertos Críticos (Critical Hits) e Variação de RNG de Dano**: Reservados para uma expansão posterior com semente controlada.
- **Camada Visual e Sonora da Arena**: Reservada para as fases PBA-008 a PBA-013.

---

## 11. Riscos Técnicos e Estratégias de Mitigação

1. **Rate Limiting da PokéAPI**:
   - *Risco*: Múltiplas requisições simultâneas para carregar dados de golpes de vários Pokémon durante a batalha podem saturar a API ou atrasar o início do combate.
   - *Mitigação*: Armazenar golpes comuns em um dicionário estático local e carregar dados sob demanda com cache em memória (*PokemonRepository* / `moveDetailCache`).
2. **Políticas de Autoplay de Áudio nos Navegadores**:
   - *Risco*: Navegadores modernos bloqueiam reprodução automática de áudio sem interação prévia do usuário.
   - *Mitigação*: Inicializar o contexto de áudio somente após o primeiro clique do usuário (ex: botão "Batalhar" ou clique nos controles).
3. **Direitos Autorais e Licenciamento de Assets**:
   - *Risco*: Utilizar músicas ou efeitos sonoros proprietários da Nintendo/Game Freak.
   - *Mitigação*: Usar efeitos de domínio público ou licença aberta (CC0 / OpenGameArt / som gerado via Web Audio API) para a arena de batalha, mantendo apenas os *cries* públicos disponibilizados pela própria PokéAPI.
4. **Performance com Múltiplas Animações e Sprites**:
   - *Risco*: Queda de framerate em dispositivos móveis menos potentes.
   - *Mitigação*: Uso de transformações CSS aceleradas por hardware (`transform: translate3d`, `opacity`), desativação de partículas quando detectado `prefers-reduced-motion`.

---

## 12. Roadmap Técnico Oficial

```text
[x] PBA-001 Foundation (Preparação e Arquitetura) ──────────── [CONCLUÍDA]
[x] PBA-002 Team Builder (Montagem e Persistência de Equipe) ── [CONCLUÍDA]
[x] PBA-003 Battle Engine v1 (Estrutura Básica de Combate 1x1) ─ [CONCLUÍDA]
[x] PBA-004 Type System (Tabela Completa de Tipos e Efetividades) ── [CONCLUÍDA]
[x] PBA-005 Move System (Sistemas de Golpes, Categorias e PP) ─ [CONCLUÍDA]
[x] PBA-006 Battle 3x3 (Batalha em Equipe com Trocas de Pokémon) ── [CONCLUÍDA]
[x] PBA-007 Battle AI (Algoritmos e Heurísticas de Adversários) ── [CONCLUÍDA]
[ ] PBA-008 Battle Presentation Engine (Desacoplamento Visual da Lógica)
[ ] PBA-009 Pokemon Animations (Sprites Animados e Movimentos Corporais)
[ ] PBA-010 Move Visual Effects (Partículas de Fogo, Água, Trovão, etc.)
[ ] PBA-011 Audio System (Músicas de Fundo, Golpes e Controles de Som)
[ ] PBA-012 Battle Camera & Impact (Screen Shake, Zooms e Críticos)
[ ] PBA-013 Final Battle UI (Interface Polida e Responsiva de Combate)
[ ] PBA-014 Trainer Profile (Estatísticas, Histórico e Insígnias)
[ ] PBA-015 Campaign Mode (Trilha de Desafios e Líderes de Ginásio)
[ ] PBA-016 Performance & Accessibility (Otimizações Finais)
[ ] PBA-017 Automated Tests (Testes de Regras, Cálculos e Efetividade)
[ ] PBA-018 Portfolio Release (Deploy Final e Documentação de Caso de Estudo)
```

