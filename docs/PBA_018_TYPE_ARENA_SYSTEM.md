# PBA-018 — Type Arena System (Fases A, B & C: Conclusão & Aceitação Humana)

## 1. Visão Geral e Princípio de Arquitetura

O **Type Arena System** introduz arenas temáticas dinâmicas com identidade visual e atmosférica para todos os 18 Mestres da Campanha (`Campaign`), preservando integralmente o isolamento entre o motor de regras e a camada de apresentação:

```
Campaign Battle Context
        │
        ▼
   Master Type
        │
        ▼
TypeArenaRegistry (Resolução & Fallback)
        │
        ▼
BattleView / TypeArenaController (Apresentação DOM & Efeitos)
```

### Regras de Isolamento
- **Game Engine ≠ Presentation Engine**: `BattleEngine`, `DamageCalculator`, `BattleAI`, `TurnManager` e `TypeChart` não possuem conhecimento de backgrounds, partículas, iluminação ou decoração temática (`BATTLE_ENGINE_CHANGED = NO`, `GAMEPLAY_CHANGED = NO`).
- **One Battle View**: Não existem telas HTML fragmentadas (`battle-fire.html`, etc.). A mesma `BattleView` recebe e aplica dinamicamente o tema resolvido (`ONE_BATTLE_VIEW = YES`).
- **Isolamento de Modos**:
  - **Quick Battle**: utiliza sempre a arena padrão (`QUICK_BATTLE_VISUAL_REGRESSION = NO`).
  - **Endgame Trials**: preservam apresentação própria/padrão (`TRIAL_VISUAL_CHANGED = NO`).
  - **Super Trainer & Shadow Final Stand**: preservam suas identidades visuais exclusivas (`SUPER_VISUAL_CHANGED = NO`, `SHADOW_VISUAL_CHANGED = NO`).

---

## 2. Matriz Completa das 18 Arenas Temáticas

| # | Tipo | Mestre | Nome da Arena | Identidade Visual & Atmosfera | Arquivo de Asset (WebP) | Partículas |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Normal** | Aster | Estádio da Liga | Estádio de torneio profissional clássico, holofotes e arquibancada | `arena-normal.webp` | `stadium` |
| 2 | **Fire** | Kael | Caldeira Vulcânica | Ambiente vulcânico, magma e calor com brasas suaves | `arena-fire.webp` | `embers` |
| 3 | **Water** | Marina | Santuário das Marés | Templo das marés com reflexos de água e micro-bolhas | `arena-water.webp` | `bubbles` |
| 4 | **Electric** | Volt | Cúpula Tecnológica | Cúpula de alta tecnologia, pulsos de energia e circuitos neon | `arena-electric.webp` | `pulses` |
| 5 | **Grass** | Flora | Bosque Ancestral | Santuário florestal com folhas e luz solar entre as copas | `arena-grass.webp` | `leaves` |
| 6 | **Ice** | Yara | Caverna Glacial | Caverna de estalactites cristalinas e cristais de gelo | `arena-ice.webp` | `snow` |
| 7 | **Fighting**| Dante | Dojo Marcial | Tatame marcial tradicional, lanternas japonesas e disciplina | `arena-fighting.webp`| `focus` |
| 8 | **Poison** | Vesper | Complexo Químico | Cisterna química subterrânea, vapores tóxicos e calhas | `arena-poison.webp` | `toxic` |
| 9 | **Ground** | Terra | Cânion Terracota | Cânion árido de arenito vermelho e poeira quente | `arena-ground.webp` | `dust` |
| 10 | **Flying** | Aero | Templo dos Céus | Plataforma de templo flutuante acima das nuvens | `arena-flying.webp` | `wind` |
| 11 | **Psychic** | Orion | Observatório Astral | Observatório cósmico celestial, anéis planetários e runas | `arena-psychic.webp`| `astral` |
| 12 | **Bug** | Nilo | Bosque dos Esporos | Oco de árvore primeval com cogumelos e esporos brilhantes | `arena-bug.webp` | `spores` |
| 13 | **Rock** | Petra | Pedreira Monolítica | Pedreira montanhosa com pilares monolíticos e pedras | `arena-rock.webp` | `pebbles` |
| 14 | **Ghost** | Nyra | Mausoléu Espectral | Cemitério gótico assombrado com lápides e névoa espectral | `arena-ghost.webp` | `wisps` |
| 15 | **Dragon** | Riven | Santuário Dracônico | Santuário milenar nos picos vulcânicos com braseiros de ouro | `arena-dragon.webp` | `draconic` |
| 16 | **Dark** | Noctis | Ruínas do Eclipse | Ruínas sob eclipse solar com runas arcanas e sombras | `arena-dark.webp` | `shadows` |
| 17 | **Steel** | Ferrum | Fortaleza Siderúrgica| Complexo siderúrgico industrial, vigas de aço e rebites | `arena-steel.webp` | `sparks` |
| 18 | **Fairy** | Lumi | Clareira Encantada | Clareira mágica com cristais pastéis e flores luminosas | `arena-fairy.webp` | `sparkles` |

---

## 3. Fallback Obrigatório (`DEFAULT_FALLBACK = PASS`)

Se:
- Tipo desconhecido (ex: tipos customizados ou inválidos);
- Metadados ausentes ou corrompidos;
- Batalha fora do modo Mestre de Campanha (ex: Quick Battle, Trials);
- Batalhas especiais com visuais próprios (Super Trainer, Shadow Final Stand);

o resolvedor retorna imediatamente o tema `default`:
- Fundo em gradiente suave escuro slate/indigo;
- Plataforma neutra iluminada;
- Zero partículas e zero dependência de arquivos externos;
- A batalha inicia normalmente sem atrasos (`ARENA_LOADING_BLOCKS_BATTLE = NO`).

---

## 4. Ciclo de Vida e Gerenciamento de Partículas (`TypeArenaController`)

Para garantir `PARTICLE_LEAKS = 0` e `ARENA_STATE_LEAK = NO`:

1. **Mount**:
   - Limpa previamente quaisquer elementos remanescentes (`cleanup()`).
   - Verifica `prefers-reduced-motion`: se ativo, nenhuma partícula é instanciada.
   - Instancia nós decorativos leves (`pointer-events: none`, transform e opacity acelerados por GPU).
   - Registra todos os nós em `activeElements` e timers em `activeTimers`.
2. **Update**:
   - Animações controladas via CSS Keyframes determinísticos sem layout thrashing.
3. **Unmount / Cleanup**:
   - Chamado automaticamente em `BattleView.resetArena()`, `leaveBattle()`, vitórias, derrotas e saídas voluntárias.
   - Esvazia `#arenaAmbientContainer` e limpa todos os listeners e referências.

---

## 5. Acessibilidade e Segurança Visual

- **Reduced Motion (`prefers-reduced-motion: reduce`)**:
  - Partículas desativadas completamente (0 partículas geradas no DOM e `display: none` via CSS).
  - Transições e animações de entrada suprimidas.
  - Background e atmosfera estáticos mantidos sem perda de contraste.
- **Segurança de Flash (Fotossensibilidade)**:
  - Frequências seguras em todas as animações; ausência total de efeitos estroboscópicos ou flashes agressivos no palco (revisado com atenção para Electric, Psychic, Ghost, Fairy).
- **Contraste de UI**:
  - Vinheta radial escura (`.arena-backdrop::after`) protege os sprites dos Pokémon e os painéis de HP, PP e mensagens de combate contra interferências visuais em todas as 18 arenas.

---

## 6. Orçamento e Estatísticas de Assets

- **Formato**: WebP local (1024x576)
- **Total de Arenas**: 18
- **Tamanho Total**: 1.553.746 bytes (~1.51 MB)
- **Média por Arena**: 86.319 bytes (~84.3 KB)
- **Maior Asset**: `arena-grass.webp` (133.0 KB)
- **Menor Asset**: `arena-ghost.webp` (28.7 KB)
- **Dependências Externas / CDNs**: 0 (zero requisições de rede externas em runtime).

---

## 7. Validação Visual Humana e Conclusão (PBA-018C)

- **Aprovação Humana**: `TYPE_ARENA_HUMAN_ACCEPTANCE = PASS` (todas as 18 arenas aprovadas formalmente pelo proprietário).
- **Arenas Aprovadas sem Modificações Desnecessárias**: `APPROVED_ARENAS_MODIFIED = 0`.
- **Status da Fase**: `PBA-018 = PASS` | `TYPE_ARENAS = COMPLETE`.
