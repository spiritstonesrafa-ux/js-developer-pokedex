# Arquitetura de Descoberta de Golpes e Qualidade de Movesets (PBA-014C)

## 1. Visão Geral
Durante as partidas no GitHub Pages, observou-se que determinados Pokémon entravam na batalha com apenas 1 ou 2 golpes, enquanto outros tinham 3 ou 4. A auditoria detalhada revelou que a causa não era escassez de golpes na PokéAPI, mas sim **truncamento prematuro da lista de candidatos** (`candidates.slice(0, 8)`), combinado com descarte de golpes de status e ausência de resgate exaustivo.

Na Fase **PBA-014C**, foi implementada uma arquitetura de **Descoberta Progressiva com Parada Antecipada e Resgate Exaustivo**, com seletor determinístico de qualidade orientado a **STAB, afinidade de atributos (Físico/Especial), diversidade de cobertura e acurácia**.

---

## 2. Causa Raiz do Truncamento Anterior
No algoritmo legado:
1. `BattleTeamHydrator` obtinha a lista de candidatos da PokéAPI e executava:
   ```javascript
   const shortlist = candidates.slice(0, this.maxMoveRequests); // apenas os primeiros 8
   ```
2. Para cada candidato dessa lista de 8, consultava a PokéAPI.
3. Se o golpe fosse de categoria `status` (ex: *Tail Whip*, *Roar*, *Growl*, *Disable*, *Harden*) ou tivesse poder nulo (`power === null`), ele era descartado.
4. Se apenas 1 ou 2 golpes ofensivos restassem dentro dos primeiros 8, a busca encerrava.
5. O fallback determinístico só era acionado se `validMoves.length === 0`. Logo, espécies com 1 ou 2 golpes válidos nos primeiros 8 ficavam presas com movesets incompletos, ignorando dezenas de golpes válidos subsequentes da espécie.

---

## 3. Catálogo PokéAPI e Regra de Moveset Agnóstica de Versão
- **Ruleset**: `POKEAPI_SPECIES_MOVE_POOL_VERSION_AGNOSTIC`.
- O projeto não restringe o jogo exclusivamente a regras de uma geração específica (Red/Blue, Emerald, Platinum ou Scarlet/Violet).
- Toda a biblioteca de golpes possíveis aprendidos historicamente pela espécie é elegível.
- Os metadados de `version_group_details` são preservados em runtime e utilizados para priorização inteligente (golpes com método `level-up` são avaliados primeiro, aumentando a probabilidade de selecionar STABs naturais e golpes de identidade com menos requisições HTTP).

---

## 4. Descoberta Progressiva e Resgate Exaustivo
A nova busca opera sob os seguintes parâmetros:
- `MOVE_DISCOVERY_WINDOW_SIZE = 8`: Janela de busca processada em paralelo via `Promise.all`.
- `MOVE_DISCOVERY_INITIAL_BUDGET = 24`: Orçamento inicial para coletar candidatos.
- `MOVE_CANDIDATE_POOL_TARGET = 8`: Alvo de pool de ataques válidos suportados.
- `MOVE_LOADOUT_TARGET = 4`: Alvo de loadout jogável.

### Fluxo de Execução
```
Candidatos da espécie (ordenados com prioridade a level-up)
  ↓
Janela 1 (8 candidatos em paralelo)
  ↓
Filtra supported moves: (physical || special) && power > 0
  ↓
Pool de válidos >= 8 E possui ao menos 1 STAB?
  ├── SIM → Encerra com early-stop (economiza requisições)
  └── NÃO → Janela 2 (próximos 8 candidatos)
        ↓
Se atingir budget inicial (24) e validMoves.length < 4:
  └── RESGATE EXAUSTIVO: Continua abrindo janelas progressivas
      até atingir 4 ataques válidos ou esgotar a lista da PokéAPI.
```

---

## 5. Seletor Heurístico Determinístico de Qualidade
Após a obtenção da pool de candidatos válidos, o seletor pontua cada golpe segundo critérios de combate:
1. **Poder Base**: Pontuação inicial igual ao `power`.
2. **STAB (Same-Type Attack Bonus)**: Bônus de `+50` pontos para golpes do mesmo tipo do Pokémon.
3. **Afinidade Ofensiva (Physical / Special)**:
   - Se `attack >= specialAttack`: Bônus de `+20` para golpes físicos.
   - Se `specialAttack > attack`: Bônus de `+20` para golpes especiais.
4. **Fator de Acurácia**: `(accuracy - 80) * 0.2` para balancear golpes de acurácia baixa vs alta confiabilidade.
5. **Critério de Desempate Estável**: `score -> power -> accuracy -> localeCompare(name)`.

### Passos de Montagem do Loadout
1. **Garantia de STAB (MQ19)**: Se houver qualquer ataque STAB disponível, o mais bem pontuado é obrigatoriamente incluído.
2. **Diversidade de Cobertura (MQ21)**: Prioriza tipos elementais distintos dos já selecionados para evitar movesets redundantes (ex: 4 golpes de fogo).
3. **Preenchimento até 4**: Preenche as vagas restantes com os maiores scores disponíveis.
4. **Ordenação Final Estável (MQ26)**: Ordem consistente por score decrescente para apresentação ao jogador e à IA.

---

## 6. Estados e Razões de Moveset (PBA-014C-HARDENING)
O sistema estabelece uma separação semântica estrita entre **limitação do Engine** e **falha real de rede**:

### 6.1 Fontes (`moveLoadoutSource`)
- `API_MOVESET`: Obteve o alvo completo de 4 golpes válidos a partir da PokéAPI.
- `LIMITED_API_MOVESET`: A espécie possui entre 1 e 3 golpes ofensivos suportados pelo Engine na totalidade da biblioteca da PokéAPI (ex: Metapod com 2). Zero golpes falsos injetados.
- `UNSUPPORTED_ENGINE_MOVESET`: A PokéAPI respondeu corretamente, mas 100% dos golpes da espécie dependem de mecânicas ainda não suportadas pelo Engine (ex: *Transform* em Ditto, *Counter*/*Mirror Coat* em Wobbuffet, *Sketch* em Smeargle, *Hidden Power* em Unown). O combatente recebe `moves = []`. Zero golpes falsos injetados.
- `NETWORK_FALLBACK_MOVESET`: Ocorre **estritamente** quando há evidência de falha de rede/PokéAPI indisponível. Requer `NETWORK_OR_API_FAILURE_DETECTED = YES`.

### 6.2 Motivos (`moveLoadoutReason`)
- `NONE`: Carga completa e normal de 4 golpes.
- `ENGINE_CAPABILITY_LIMIT`: Espécie com 1 a 3 golpes suportados na PokéAPI.
- `ZERO_SUPPORTED_ENGINE_MOVES`: Espécie com 0 golpes suportados no Engine atual.
- `NETWORK_FALLBACK`: Contingência por indisponibilidade de rede ou falha total de requisições.

---

## 7. Classificação de Complex Move Mechanics (PBA-014C-FINAL-HARDENING)
A regra de suporte a golpes estabelece que **`damageClass === 'physical'|'special'` e `power > 0` não são suficientes para garantir suporte**. Um golpe só é aceito se sua mecânica essencial de dano e tipo puder ser modelada fielmente pelas regras do Engine atual.

### 7.1 Categorias Conceituais
- `SUPPORTED_SIMPLE_DAMAGE`: Golpes com dano estático, tipo elemental fixo e acurácia padrão (ex: *Tackle*, *Flamethrower*, *Surf*, *Thunderbolt*, *Psychic*, *Ice Beam*, *Shadow Ball*, *Body Slam*).
- `UNSUPPORTED_STATUS`: Golpes sem dano direto (`status`).
- `UNSUPPORTED_DYNAMIC_TYPE`: Golpes cujo tipo depende de fatores em tempo de execução ou atributos individuais fora do modelo atual.
  - **`hidden-power`**: Tipo dinâmico derivado dos IVs do Pokémon (`DYNAMIC_TYPE_FROM_IVS`). Status: **DEFERRED**. Não é aceito como ataque normal estático.
- `UNSUPPORTED_VARIABLE_DAMAGE`: Golpes cujo poder base é variável e dependente de mecânicas complexas não modeladas (quando `power === null` na PokéAPI: *Low Kick*, *Grass Knot*, *Flail*, *Reversal*, *Counter*, *Mirror Coat*, ou quando o poder na PokéAPI é positivo mas depende de runtime dinâmico não modelado):
  - **`eruption`**: Poder proporcional à razão de HP atual do usuário $\lfloor 150 \times \text{currentHp} / \text{maxHp} \rfloor$ (`POWER_FROM_USER_HP`). Status: **DEFERRED**. Não é aceito como poder constante 150.
  - **`water-spout`**: Poder proporcional à razão de HP atual do usuário $\lfloor 150 \times \text{currentHp} / \text{maxHp} \rfloor$ (`POWER_FROM_USER_HP`). Status: **DEFERRED**. Não é aceito como poder constante 150.

### 7.2 Consequência para Unown (#201)
Como *Hidden Power* é o único golpe da biblioteca de Unown na PokéAPI, e *Hidden Power* é classificado como `UNSUPPORTED_DYNAMIC_TYPE`:
- `supportedCount = 0`
- `moves = []`
- `source = UNSUPPORTED_ENGINE_MOVESET`
- `reason = ZERO_SUPPORTED_ENGINE_MOVES`
- `BATTLE_COMPATIBLE = NO`

---

## 8. Preflight de Compatibilidade e Proteção da Arena (Battle Session Preflight)
Para manter a integridade das regras de combate sem enfraquecer ou crashar o Battle Engine:
- Se qualquer Pokémon escalado na equipe do jogador ou do adversário possuir `moves.length === 0` ou `moveLoadoutReason === ZERO_SUPPORTED_ENGINE_MOVES`:
  - A camada `BattleSessionController.prepareBattle()` e `startBattle()` bloqueia o início da batalha de forma controlada.
  - O `BattleEngine.createTeamBattle()` **não é executado**.
  - A UI exibe mensagem clara e amigável ao jogador (ex: *"Unown ainda não é compatível com a Battle Arena porque seus golpes dependem de mecânicas que ainda não são suportadas."*).
  - O jogador recebe um botão direto *"Voltar para Meu Time"*, mantendo o Pokémon normalmente utilizável na Pokédex, detalhes e favoritos.

---

## 9. Desempenho de Rede e Cache em Memória
- O cache em memória `pokeApi.moveDetailCache` é compartilhado entre todas as espécies hidratadas na mesma sessão.
- Durante a hidratação de 6 combatentes (3 do jogador + 3 do oponente), golpes comuns (como *Tackle*, *Double-Edge*, *Body Slam*, *Hydro Pump*, *Flamethrower*) são buscados na rede apenas uma vez.
- O tempo médio de hidratação das equipes é de $\approx 1.2$ a $1.8$ segundos na primeira execução e inferior a $100\text{ ms}$ com cache preenchido.
