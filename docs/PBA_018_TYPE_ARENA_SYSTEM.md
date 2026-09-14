# PBA-018 — Type Arena System (Fase A: Fundação & 3 Protótipos)

## 1. Visão Geral e Princípio de Arquitetura

O **Type Arena System** introduz arenas temáticas dinâmicas com identidade visual e atmosférica para os Mestres da Campanha (`Campaign`), preservando integralmente o isolamento entre o motor de regras e a camada de apresentação:

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
- **Game Engine ≠ Presentation Engine**: `BattleEngine`, `DamageCalculator`, `BattleAI` e `TypeChart` não possuem conhecimento de backgrounds, partículas, iluminação ou decoração temática (`BATTLE_ENGINE_CHANGED = NO`, `GAMEPLAY_CHANGED = NO`).
- **One Battle View**: Não existem telas HTML fragmentadas (`battle-fire.html`, etc.). A mesma `BattleView` recebe e aplica dinamicamente o tema resolvido (`ONE_BATTLE_VIEW = YES`).
- **Isolamento de Modos**:
  - **Quick Battle**: utiliza sempre a arena padrão (`QUICK_BATTLE_VISUAL_REGRESSION = NO`).
  - **Super Trainer & Shadow Final Stand**: preservam suas identidades visuais exclusivas (`SUPER_VISUAL_CHANGED = NO`, `SHADOW_VISUAL_CHANGED = NO`).

---

## 2. Type Arena Registry (`assets/js/arena/type-arena-registry.js`)

O `TypeArenaRegistry` é a fonte central e única de verdade para resolução de temas de arena:

- **Chaves de Catálogo**:
  - `default`: Arena padrão (gradiente slate/indigo, plataforma neutra, 0 partículas).
  - `fire`: Caldeira Vulcânica (`assets/images/arenas/arena-fire.webp`, brasas flutuantes, acento `#f97316`).
  - `water`: Santuário das Marés (`assets/images/arenas/arena-water.webp`, micro-bolhas flutuantes, acento `#00b4d8`).
  - `electric`: Cúpula Tecnológica (`assets/images/arenas/arena-electric.webp`, pulsos de circuito, acento `#facc15`).

### Fallback Obrigatório (`ARENA_FALLBACK = PASS`)
Se o tipo for desconhecido, a configuração estiver ausente, ou o contexto não for um Mestre de Campanha, o resolver retorna imediatamente `DEFAULT_ARENA_THEME`. A arena nunca impede ou atrasa o início do combate.

---

## 3. Ciclo de Vida e Gerenciamento de Partículas (`TypeArenaController`)

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

## 4. Acessibilidade e Segurança Visual

- **Reduced Motion (`prefers-reduced-motion: reduce`)**:
  - Partículas desativadas completamente (0 partículas geradas no DOM e `display: none` via CSS).
  - Transições e animações de entrada suprimidas.
  - Background e atmosfera estáticos mantidos sem perda de contraste.
- **Segurança de Flash (Fotossensibilidade)**:
  - Frequências seguras em todas as animações; ausência total de efeitos estroboscópicos ou flashes agressivos no palco.
- **Contraste de UI**:
  - Vinheta radial escura (`.arena-backdrop::after`) protege os sprites dos Pokémon e os painéis de HP, PP e mensagens de combate contra interferências visuais.

---

## 5. Novos Assets Locais

| Asset | Formato | Dimensões | Tamanho |
| :--- | :--- | :--- | :--- |
| `assets/images/arenas/arena-fire.webp` | WebP | 1024x576 | ~59.7 KB |
| `assets/images/arenas/arena-water.webp` | WebP | 1024x576 | ~80.0 KB |
| `assets/images/arenas/arena-electric.webp` | WebP | 1024x576 | ~113.6 KB |
| **Total** | | | **~253.3 KB** |

*Zero dependências externas ou requisições de CDN em runtime.*

---

## 6. Plano de Expansão para os 18 Tipos (PBA-018B Futura)

Na fase subsequente (**PBA-018B**), o catálogo será estendido para cobrir todos os 18 tipos elementais mantendo a mesma infraestrutura:
- `grass`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`, `normal`.
- A adição de novos tipos exigirá apenas novos registros no `TypeArenaRegistry` e adição no array `ACTIVE_PROTOTYPE_TYPES`, sem qualquer alteração na `BattleView` ou no `BattleEngine`.
