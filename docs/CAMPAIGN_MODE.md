# Circuito dos Mestres

The campaign is independent from `team.current`: choose six campaign starters, earn one chosen recruit from each Master, then trial recruits and one Super recruit. `campaign.progress` is versioned, sanitizes invalid data, bounds idempotent battle IDs, and reset removes only campaign progress.

CampaignBattleCoordinator supplies the existing BattleSessionController with IDs, metadata and optional modifiers. Campaign results return to Campaign and pending rewards survive reload. Super victory uses champion context before recruit choice. Claiming it reveals the final Shadow challenge once. Shadow reuses the Super team and applies only `max(2, base multiplier)` to enemy attacks; player effectiveness remains canonical.

Trainer history supports optional campaign mode/kind/challenge fields without breaking old Quick records.

## Draft expansion: Seleção Inicial de 450 Pokémon

A seleção inicial de novos treinadores na campanha foi expandida de 144 para **450 Pokémon canônicos**, distribuídos uniformemente em exatamente **50 Pokémon por geração oficial** (da Geração 1 à Geração 9).

### Regras Fundamentais da Escolha Inicial

- **Escolha de 6 Pokémon:** O jogador escolhe exatamente 6 membros para iniciar sua jornada na campanha.
- **Zero Lendários e Míticos:** Nenhum Pokémon lendário ou mítico está disponível na seleção inicial.
- **Preservação dos 144 Pokémon Anteriores:** Todos os 16 Pokémon originais por geração foram integralmente preservados em suas respectivas posições.
- **Exclusividade das Recompensas Especiais:** Nenhum membro da `SUPER_TEAM` (Arceus, Eternatus, Mewtwo) nem das quatro Provas Finais (`LEGENDARY_TRIAL_TEAM`, `MYTHICAL_TRIAL_TEAM`, `TITANS_TRIAL_TEAM`, `CELESTIAL_TRIAL_TEAM`) está presente no draft.
- **Proteção `MASTER_REWARD_CONFLICT`:** Permanece ativa e estrita, impedindo que o jogador selecione inicialmente os 3 membros da equipe de um mesmo Mestre.

### Fonte Única da Verdade (`campaign-draft-ids.js`)

Todos os IDs do draft são governados por `assets/js/campaign/campaign-draft-ids.js`, eliminando duplicações entre scripts de build, auditorias, catálogo de dados e tempo de execução:
- `DRAFT_IDS_BY_GENERATION`: Mapeamento de 1 a 9, com 50 IDs únicos por geração.
- `DRAFT_IDS`: Vetor com os 450 IDs do draft.
- Utilizável em Node.js (via `module.exports`) e no navegador (via `window.PBACampaign`).

### Critérios de Curadoria dos 306 Novos Pokémon

A adição de 34 novos Pokémon por geração foi realizada considerando a realidade técnica do motor de combate do jogo:
1. **Atributos Reais:** Análise de BST, Ataque físico, Ataque Especial, Velocidade, Defesa e Defesa Especial.
2. **Diversidade Tática:** Equilíbrio entre atacantes físicos de alto impacto, atacantes especiais, "tanks" resistentes e sweepers velozes.
3. **Pseudo-Lendários e Formas Finais:** Inclusão das famílias canônicas como Dragonite, Tyranitar, Metagross, Garchomp, Hydreigon, Goodra, Kommo-o, Dragapult e Baxcalibur.
4. **Cobertura Elemental Útil:** Presença reforçada de tipos cruciais contra os desafios avançados e finais (Fairy, Ice, Dark, Ghost, Ground, Fighting, Steel, Water, Grass, Electric, Rock).
5. **Avaliação de Mecânicas Dependentes de Habilidades:**
   - **Shedinja (ID 292):** Excluído do draft. Como o motor atual não implementa a habilidade *Wonder Guard*, Shedinja com 1 HP seria derrotado instantaneamente por qualquer ataque.
   - **Slaking (ID 289):** Excluído do draft. Como o motor atual não implementa a habilidade penalizadora *Truant*, Slaking atacaria todos os turnos com 670 BST e 160 de Ataque físico, desequilibrando o jogo.
   - **Archeops (ID 567):** Excluído do draft. A ausência da habilidade *Defeatist* deixaria Archeops com 567 BST e 140 de Ataque sem a penalidade canônica.
   - **Pyukumuku (ID 771):** Substituído por Steenee (ID 762) na Geração 7, pois Pyukumuku não possui golpes ofensivos diretos no cânone.
   - **Ultra Beasts (Gen 7):** Todas as 11 Ultra Beasts foram excluídas do draft para manter estrita a regra de exclusão de sub-lendários.

### Fonte Central de Golpes Suportados vs Não Suportados

Para garantir que o Battle Engine não execute golpes com mecânicas ausentes de forma distorcida (como dano maciço sem recarga, sem preparação ou sem autodestruição), foi centralizada a definição `UNSUPPORTED_COMPLEX_MOVES` e o validador `isMechanicallySupportedMove(moveDetail)` em `assets/js/battle-session/battle-session-constants.js`.

Essa fonte única é compartilhada entre:
- Hidratação online de batalha (`BattleTeamHydrator`).
- Gerador do catálogo estático offline (`scripts/build-campaign-draft-catalog.js`).
- Script de auditoria determinística (`scripts/audit-campaign-draft.js`).
- Suítes de testes (`campaign-draft-expansion.test.js`, `battle-moveset.test.js`).

Categorias auditadas e estritamente rejeitadas no catálogo de draft e fallbacks:
- **Autodestruição:** `explosion`, `self-destruct`, `memento`, etc.
- **Recarga no turno seguinte:** `hyper-beam`, `giga-impact`, `frenzy-plant`, `blast-burn`, `hydro-cannon`, `roarcrash`, etc.
- **Preparação em dois turnos / Semi-invulnerabilidade:** `solar-beam`, `solar-blade`, `skull-bash`, `fly`, `dig`, `dive`, `bounce`, `phantom-force`, `shadow-force`, `meteor-beam`, `electro-shot`, etc.
- **Dano por Recoil / Crash:** `double-edge`, `take-down`, `brave-bird`, `flare-blitz`, `wood-hammer`, `head-smash`, `wave-crash`, `jump-kick`, `high-jump-kick`, etc.
- **Bloqueio/Confusão por múltiplos turnos:** `outrage`, `thrash`, `petal-dance`.
- **Dano com penalidade de status próprio:** `draco-meteor`, `overheat`, `leaf-storm`, `close-combat`, `superpower`, `headlong-rush`, `armor-cannon`, etc.
- **Poder variável por HP, peso ou velocidade:** `eruption`, `water-spout`, `flail`, `reversal`, `low-kick`, `grass-knot`, `heavy-slam`, `gyro-ball`, `electro-ball`.
- **Dano fixo ou baseado no HP do alvo:** `seismic-toss`, `night-shade`, `super-fang`, `nature-power`.
- **Contra-ataques e dano diferido:** `counter`, `mirror-coat`, `metal-burst`, `bide`, `future-sight`, `doom-desire`.
- **Múltiplos acertos (multi-hit):** `fury-swipes`, `bullet-seed`, `icicle-spear`, `scale-shot`, etc.
- **Dano condicional/dinâmico:** `facade`, `hex`, `weather-ball`, `hidden-power`.

`Body Press` é uma exceção implementada no motor: continua físico, mas usa a Defesa de quem ataca no lugar do Ataque. O mesmo cálculo é usado pela IA e pela curadoria dos conjuntos de golpes. `Sucker Punch`, `First Impression`, `Bolt Beak`, `Payback`, `Assurance`, `Stomping Tantrum`, `Temper Flare` e `Last Respects` permanecem excluídos até que o motor suporte suas condições de turno, prioridade ou poder variável.

### Preservação da Precisão Canônica (`accuracy`)

Todos os 1.800 golpes do catálogo offline (`assets/js/campaign/campaign-battle-fallback-catalog.js`) preservam explicitamente a precisão canônica fornecida pela PokéAPI:
- Número inteiro entre 1 e 100 quando o golpe possui taxa de erro (ex: `stone-edge: 80`, `power-whip: 85`, `icicle-crash: 90`).
- `null` estrito quando o golpe sempre acerta no cânone (ex: `aerial-ace`, `aura-sphere`).
- O hidratador respeita essa informação e não assume 100% de precisão para golpes com precisão imperfeita.

### Recomendações Derivadas do Loadout Real (`recommendedForEndgame`)

54 Pokémon do catálogo (exatamente 6 por geração) possuem a propriedade booleana `recommendedForEndgame: true`:
- **Cálculo Pós-Loadout:** A pontuação é computada **após** a determinação dos 4 golpes finais de fallback de cada espécie.
- **Requisitos Estritos:**
  - Presença obrigatória de pelo menos 1 golpe STAB no loadout real.
  - Alinhamento da categoria dos golpes (físico/especial) com os melhores atributos ofensivos da espécie.
  - Avaliação de vantagens de tipo e eficácia contra os 15 Pokémon chefes do endgame (`SUPER_TEAM`, `LEGENDARY_TRIAL_TEAM`, `MYTHICAL_TRIAL_TEAM`, `TITANS_TRIAL_TEAM`, `CELESTIAL_TRIAL_TEAM`) utilizando o `TypeChart` canônico.
  - Avaliação de durabilidade (HP + Defesas), velocidade e BST total.
  - Pseudo-lendários canônicos com loadouts corrigidos e válidos (Dragonite, Tyranitar, Metagross, Salamence, Garchomp, Hydreigon, Goodra, Kommo-o, Dragapult, Baxcalibur) confirmados como recomendados.
  - Casos dependentes exclusivamente de golpes de status ou habilidades não implementadas (como Shuckle) não são recomendados.
- Identificados na interface por uma badge dourada sutil (`⭐ Endgame`).

### Catálogo Estático e Suporte Offline

- **Sem requisições de rede ao abrir a campanha:** `assets/js/campaign/campaign-pokemon-catalog.js` contém os metadados dos 450 Pokémon do draft e de combatentes especiais/legados (492 entradas no total).
- **Hidratação de Batalha Offline (`campaign-battle-fallback-catalog.js`):** Cada um dos 450 Pokémon possui uma ficha canônica estática completa com:
  - ID, nome e tipos corretos.
  - Atributos base reais (HP, Atk, Def, SpA, SpD, Spe).
  - Conjunto de 4 golpes ofensivos compatíveis com o motor do jogo, com tipo, poder, categoria, PP e precisão canônica.
  - Fotos e sprites estáticos.
  - Zero combatentes genéricos com atributos 50 e apenas Tackle.

### Golpes fixos e prévia fiel da campanha

- `campaign-fixed-battle-catalog.js` combina os 450 conjuntos do draft com 18 conjuntos adicionais dos Mestres, Super Treinador e quatro Provas. Os 468 Pokémon atualmente obtíveis na campanha possuem quatro golpes distintos e aceitos pelo motor. Seis espécies têm três golpes ofensivos e um golpe de status curado: Venusaur, Roserade, Ninetales, Gengar, Pikachu e Luxray.
- Quando `metadata.mode === 'CAMPAIGN'`, `BattleSessionController` envia fichas locais ao hidratador para as duas equipes. Os quatro golpes são preservados em ordem, com poder, precisão e PP próprios, sem consulta à PokéAPI. A Batalha Rápida continua usando a seleção dinâmica existente.
- `campaign-matchup-guide.js` usa o mesmo catálogo para listar os quatro golpes do jogador e avaliar cobertura e riscos pelos golpes reais dos adversários. A prévia continua sendo apenas orientação: efetividade elemental não representa dano garantido nem chance de vitória.
- Pokémon fora desse catálogo que só apareçam em saves antigos mantêm a rota de hidratação anterior; o comparador avisa quando não pode prometer a mesma prévia. Nenhuma migração ou alteração do progresso salvo é necessária.

### Status de gameplay: veneno, queimadura e paralisia

- Os únicos golpes de status habilitados são `poison-powder` (#77; Venusaur #3 e Roserade #407; precisão 75, PP 35), `will-o-wisp` (#261; Ninetales #38 e Gengar #94; precisão 85, PP 15) e `thunder-wave` (#86; Pikachu #25 e Luxray #405; precisão 90, PP 20). Cada golpe substitui um dos quatro ofensivos anteriores; o catálogo gerado do draft mantém quatro ofensivos.
- Ao acertar um alvo elegível, o golpe consome PP e um turno, sem causar dano imediato. O veneno retira `max(1, floor(maxHp / 8))` HP ao fim de cada turno enquanto o Pokémon está ativo. O status persiste quando ele vai para a reserva e não persiste entre batalhas.
- Queimadura retira `max(1, floor(maxHp / 16))` HP ao fim do turno e reduz à metade o dano final de golpes físicos do afetado (mínimo 1 se haveria dano); não altera golpes especiais. Pokémon Fire são imunes ao Will-O-Wisp.
- Paralisia reduz a velocidade efetiva à metade (arredondada para baixo, mínimo 1 quando positiva) e tem 25% de chance de impedir cada ação de golpe, consumindo PP; a rolagem externa 1–100 é reproduzível. A ordem é calculada no início do turno, e uma paralisia aplicada antes da segunda ação já pode impedi-la. Pokémon Electric são imunes à paralisia e Pokémon Ground são imunes a Thunder Wave.
- Pokémon Poison e Steel não podem ser envenenados; Grass é imune ao golpe em pó. Golpes errados não aplicam status. Só uma condição principal pode afetar cada Pokémon. O status persiste na reserva durante a luta, mas só causa dano residual enquanto ativo, e termina com a batalha.
- Motor, IA, comparador, mensagens e badges acessíveis compartilham essas regras. Dano residual de veneno ou queimadura é resolvido ao fim do turno; se ambos os últimos Pokémon caírem juntos, empate conta como derrota do jogador.
- O balanceamento final foi conservador: os quatro conjuntos das Provas e o Super Treinador mantêm os golpes anteriores, enquanto o jogador pode levar esses controles táticos aos desafios. A Batalha Rápida conserva o seletor ofensivo. Toxic, curas, habilidades, itens e outros golpes de status continuam fora do escopo.

### Interface da Seleção Inicial e Ciclo de Vida do Debounce

A interface (`assets/js/campaign/campaign-view.js` e `assets/css/campaign.css`) foi otimizada para navegação fluida entre os 450 Pokémon:
- **Filtros Combináveis:** Busca instantânea por nome ou número, seletor de Geração (1 a 9 ou Todas), seletor de Tipo elemental (18 tipos) e alternador "⭐ Recomendados para o final".
- **Debounce Seguro e Anti-Race Condition:**
  - Timer de 180ms com cancelamento explícito (`clearDraftDebounce()`) ao confirmar equipe, ao trocar filtros, ao paginar, ao selecionar/remover cards, ao trocar de aba e na desativação da view (`deactivate()`).
  - O callback do timer valida se a campanha já foi iniciada (`manager.isStarted()`) antes de executar, redirecionando para a renderização geral do mapa e impedindo a sobreposição do draft no mapa da campanha.
- **Renderização Paginada em Lotes de 50:** Limita o DOM a 50 cards por página, com botões "Anterior" / "Próxima" e indicador claro de página.
- **Carregamento Preguiçoso de Imagens:** Sprites renderizados com `loading="lazy"`.
- **Persistência Visual dos Selecionados:** A barra superior com os 6 Pokémon escolhidos permanece visível e acessível independentemente da página ou filtros ativos.
- **Acessibilidade e Responsividade:** Suporte completo para teclado (`Tab`, `Enter`), atributos WAI-ARIA (`aria-pressed`, `aria-label`), e layout totalmente adaptado para telas mobile.

### Compatibilidade Retroativa

- Campanhas iniciadas antes da expansão continuam perfeitamente funcionais (`VERSION = 1`), preservando suas equipes sem reset nem perda de progresso.
- Pokémon legados fora do novo draft inicial (como Rayquaza em saves antigos de teste) continuam sendo reconhecidos pelo catálogo canônico.

---

## Scripts de Manutenção e Auditoria

### 1. `scripts/build-campaign-draft-catalog.js`
Gera os catálogos estáticos a partir dos dados do PokéAPI em cache local (`.cache_pokeapi`).
```bash
node scripts/build-campaign-draft-catalog.js
```
Gera:
- `assets/js/campaign/campaign-pokemon-catalog.js`: Catálogo com 492 registros canônicos.
- `assets/js/campaign/campaign-battle-fallback-catalog.js`: Catálogo com os 450 combatentes offline com 4 golpes ofensivos e atributos genuínos.

### 2. `scripts/audit-campaign-draft.js`
Auditoria determinística do draft inicial da campanha.
```bash
node scripts/audit-campaign-draft.js
```
Valida:
- Total selecionado (450) e 50 por geração.
- Ausência de duplicatas, lendários e míticos.
- Ausência de sobreposição com `SUPER_TEAM` e Provas Finais.
- Existência de atributos e 4 golpes ofensivos suportados para cada um dos 450 selecionáveis.
- Contagem e distribuição das recomendações de endgame (54 no total, 6 por geração).
- Retorna código `0` em caso de sucesso e `1` em caso de violação de regra.
