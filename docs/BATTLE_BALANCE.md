# ⚖️ Battle Balance Foundation (PBA-014B)

Documento técnico de pesquisa e governança do modelo de balanceamento matemático implementado na Battle Arena.

---

## 1. Contexto & Causa-Raiz dos OHKOs Prematuros

Durante testes de gameplay, observou-se que confrontos de batalha terminavam frequentemente em **1 único golpe (OHKO)**, inclusive em situações neutras (sem fraqueza elemental).

### Diagnóstico Técnico da Causa-Raiz:
- A **PokéAPI** fornece **Base Stats** (ex: Charizard HP = 78, Pikachu HP = 35, Bulbasaur HP = 45).
- A Pokédex utiliza esses números legitimamente para exibição de dados da espécie.
- Anteriormente, o `BattleTeamHydrator` repassava os Base Stats diretamente para o combate (`combatant.hp = baseStats.hp`).
- Ao mesmo tempo, o `DamageCalculator` simulava dano sob a escala canônica de **Level 50** (`SIMULATION_LEVEL = 50`).
- **Incompatibilidade**: Golpes neutros calculados para Level 50 causavam entre 40 e 70 pontos de dano. Quando aplicados contra um HP base de 35 a 78, o dano excedia 100% da vida total do defensor em 1 turno.
- **Conclusão**: O problema não era dano excessivo, mas sim que os combatentes estavam com HP/atributos de nível básico em vez de atributos reais de Level 50.

---

## 2. Modelo Matemático Implementado (Generation III onward)

Em vez de nerfs arbitrários de dano ou multiplicadores artificiais de HP, adotou-se a normalização matemática oficial da série principal:

### 2.1 Linha de Base Padronizada
- **Level**: `50` (Fonte única de verdade: `BATTLE_CONFIG.SIMULATION_LEVEL`).
- **IV (Individual Value)**: `31` (perfeito para todos os combatentes).
- **EV (Effort Value)**: `0` (neutro, sem especializações ocultas).
- **Nature**: Neutra (`1.0` multiplicador para todos os atributos).

### 2.2 Fórmulas Canônicas
1. **HP de Combate**:
   $$\text{HP} = \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\text{EV}}{4} \rfloor) \times \text{Level}}{100} \right\rfloor + \text{Level} + 10$$
   - *Bulbasaur* (Base 45) $\to$ **120 HP**
   - *Pikachu* (Base 35) $\to$ **110 HP**
   - *Charizard* (Base 78) $\to$ **153 HP**
   - *Blastoise* (Base 79) $\to$ **154 HP**
   - *Snorlax* (Base 160) $\to$ **235 HP**

2. **Outros Atributos** (Attack, Defense, Sp. Atk, Sp. Def, Speed):
   $$\text{Stat} = \left\lfloor \left( \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\text{EV}}{4} \rfloor) \times \text{Level}}{100} \right\rfloor + 5 \right) \times \text{Nature} \right\rfloor$$

3. **Caso Especial Auditado — Shedinja (#292)**:
   - Política: `SHEDINJA_POLICY = SPECIAL_CASE_HP_1_EXCLUDED_FROM_COHORT`.
   - Shedinja possui por definição 1 HP nos jogos canônicos. Como habilidades passivas (Wonder Guard) ainda não estão presentes nesta fase, seu HP é rigorosamente fixado em 1 e ele é excluído das médias estatísticas sistêmicas do cohort.

---

## 3. Pipeline de Dano & Variação Aleatória (85% .. 100%)

A fórmula de dano preserva rigorosamente a estrutura da série principal:

$$\text{Base Damage} = \left\lfloor \frac{\left( \lfloor \frac{2 \times \text{Level}}{5} \rfloor + 2 \right) \times \text{Power} \times \frac{\text{Atk}}{\text{Def}}}{50} \right\rfloor + 2$$

### Modificadores em Cascata:
1. **Base Damage** (calculado via Attack/Defense físico ou especial).
2. **Variação Aleatória de Dano**: Rolagem inteira externa entre 85 e 100 ($\lfloor \text{Base} \times \frac{\text{Roll}}{100} \rfloor$).
3. **STAB (Same-Type Attack Bonus)**: $1.5\times$ para tipos coincidentes ($\lfloor \text{Dano} \times 1.5 \rfloor$).
4. **Efetividade Elemental**: Multiplicador de $0\times$, $0.25\times$, $0.5\times$, $1.0\times$, $2.0\times$ ou $4.0\times$.
   - Imunidade ($0\times$) anula o golpe para dano $0$.
   - Ataques não-imunes preservam piso mínimo de $1$.

### Arquitetura de Aleatoriedade:
- `ENGINE_INTERNAL_RNG = 0` (O motor de combate é 100% determinístico e recebe `damageRoll` na ação).
- `AI_INTERNAL_RNG = 0` (A IA avalia dano médio esperado deterministicamente via `calculateDamageRange`).
- No navegador, `BattleRandomSource` consome `crypto.getRandomValues()`.

---

## 4. Decisões de Design Justificadas

### 4.1 Por que NÃO utilizar "Global Damage Nerf" (ex: dano * 0.5)?
Um multiplicador global de redução mascararia a causa-raiz, distorcendo o equilíbrio entre golpes fracos e fortes, quebrando fórmulas consolidadas e introduzindo dívida técnica matemática para futuras expansões.

### 4.2 Por que NÃO utilizar "Level Balancing por Espécie" nesta fase?
Simuladores como o *Pokémon Showdown (Random Battles)* ajustam o nível de cada Pokémon (ex: Caterpie Level 88, Rayquaza Level 72) com base em **milhões de partidas reais telemetradas**.
Como a nossa Battle Arena ainda está em fase inicial e não dispõe de grande volume estatístico de partidas disputadas por humanos, qualquer ajuste de nível por espécie seria puro *guesswork*.
A prioridade técnica é primeiro unificar a **escala matemática** em Level 50 uniforme.

### 4.3 Possibilidade Futura: Data-Driven Level Balancing
Após a coleta de volume expressivo de estatísticas de vitórias e derrotas por espécie (via Trainer Profile / telemetria), um balanceamento estatístico orientado a dados poderá ser revisitado na evolução de modos competitivos.
