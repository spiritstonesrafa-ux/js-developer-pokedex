# PBA-019A — Special Boss & Endgame Trial Arenas

## 1. Visão Geral e Princípio de Arquitetura

O sistema de arenas introduzido em PBA-018 foi expandido em **PBA-019A** para cobrir as 6 arenas especiais de Bosses e Endgame Trials da Campanha:

- **Super Trainer**: Arena do Campeão
- **Shadow Super Trainer**: Trono do Eclipse (Arena do Campeão Corrompida)
- **Legendary Trial**: Santuário das Lendas
- **Mythical Trial**: Santuário Mítico
- **Titans Trial**: Arena dos Titãs
- **Celestial Trial**: Templo Celestial

A arquitetura aprovada em PBA-018 foi integralmente preservada:

```
Battle Context
      │
      ▼
Arena Resolver (TypeArenaRegistry)
      │
      ▼
Presentation Layer (BattleView / TypeArenaController)
```

### Regras Estritas de Separação
- **Game Engine ≠ Presentation Layer**: O `BattleEngine`, as regras de batalha, balanceamento, dano, turnos, HP, PP e IA continuam intactos e desacoplados (`BATTLE_ENGINE_CHANGED = NO`, `GAMEPLAY_CHANGED = NO`, `AI_CHANGED = NO`).
- **One Battle View**: O jogo continua operando com uma única `BattleView` dinâmica (`ONE_BATTLE_VIEW = YES`).
- **Zero Regressão Visual no Quick Battle**: Quick Battle continua utilizando a arena padrão (`QUICK_BATTLE_VISUAL_REGRESSION = NO`).
- **Zero Regressão nas 18 Arenas de Mestres**: Todas as 18 arenas de tipo permanecem ativas e funcionais (`TYPE_MASTER_ARENAS_REGRESSION = NO`).

---

## 2. Catálogo das 6 Arenas Especiais

| # | Chave / Contexto | Nome Conceitual | Identidade Visual & Atmosfera | Arquivo de Asset (WebP) | Partículas |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | `super` (Super Trainer) | **Arena do Campeão** | Estádio monumental de campeonato final, mármore branco nobre, pilares com acabamento dourado, holofotes triunfais e atmosfera de clímax da Liga. | `arena-super.webp` | `champion` (brilhos dourados nobres) |
| 2 | `shadow` (Shadow Final Stand) | **Trono do Eclipse** | Versão corrompida e despedaçada do estádio do campeão, sol negro de eclipse no céu tempestuoso, fendas abissais magenta, plataforma fragmentada e névoa instável. | `arena-shadow.webp` | `corruption` (motes de energia abissal) |
| 3 | `legendary` (Legendary Trial) | **Santuário das Lendas** | Templo ancestral nas montanhas sagradas com cascatas, ruínas de pedra veneráveis, céu cerimonial heróico e atmosfera de lendas vivas. | `arena-trial-legendary.webp` | `sanctuary` (névoa de água sagrada) |
| 4 | `mythical` (Mythical Trial) | **Santuário Mítico** | Clareira secreta entre ruínas celestiais ao crepúsculo, espelho d'água sob céu estrelado, cristais bioluminescentes delicados e aura mágica benevolente. | `arena-trial-mythical.webp` | `mythic` (cintilações místicas) |
| 5 | `titans` (Titans Trial) | **Arena dos Titãs** | Campo colossal de cataclismo telúrico, pilares maciços de basalto, fissuras de magma primordial, céu de tempestade vulcânica e sensação de força bruta. | `arena-trial-titans.webp` | `cataclysm` (cinzas vulcânicas ascendentes) |
| 6 | `celestial` (Celestial Trial) | **Templo Celestial** | Plataforma monumental flutuante no vazio cósmico, arcos dourados sublimes, nebulosas azul-safira, poeira estelar divina e runas astrais gravadas. | `arena-trial-celestial.webp` | `celestial` (poeira cósmica divina) |

---

## 3. Mapeamento Determinístico de Contexto

O resolvedor central (`TypeArenaRegistry.resolve(context)`) aplica a hierarquia:

1. **Validação de Modo**:
   - Se `context.mode !== 'CAMPAIGN'` -> `DEFAULT_ARENA_THEME` (Quick Battle garantido sem regressão).
2. **Boss Context Mapping (2/2 PASS)**:
   - `isShadowFinalStand || kind === 'SHADOW' || battleFormat === 'FINAL_STAND'` -> `ARENA_CATALOG.shadow`
   - `isSuperTrainer || kind === 'SUPER'` -> `ARENA_CATALOG.super`
3. **Trial Context Mapping (4/4 PASS)**:
   - `kind === 'LEGENDARY_TRIAL'` ou identificador compatível -> `ARENA_CATALOG.legendary`
   - `kind === 'MYTHICAL_TRIAL'` ou identificador compatível -> `ARENA_CATALOG.mythical`
   - `kind === 'TITANS_TRIAL'` ou identificador compatível -> `ARENA_CATALOG.titans`
   - `kind === 'CELESTIAL_TRIAL'` ou identificador compatível -> `ARENA_CATALOG.celestial`
4. **Master Context Mapping (18/18 PASS)**:
   - `kind === 'MASTER'` -> Resolve entre os 18 tipos elementais Pokémon.
5. **Fallback Obrigatório**:
   - Dados nulos, inválidos ou desconhecidos retornam com segurança o tema `default`.

---

## 4. Compatibilidade com Shadow Aura e Final Stand

A arena do Shadow Super Trainer coexiste harmonicamente com os sistemas já existentes:
- **Shadow Aura**: A classe visual `.shadow-aura-active` e o badge informativo de combate continuam ativos sem conflito com `.arena-theme-shadow`.
- **Tema Procedural de Áudio**: O tema musical do Shadow Boss é acionado normalmente.
- **Seletor de Exército / Final Stand**: As 37 cartas do exército e regras do Final Stand permanecem inalteradas.

---

## 5. Acessibilidade, Reduced Motion e Flash Safety

- **prefers-reduced-motion**:
  - Partículas das 6 arenas especiais desativadas via CSS (`display: none !important`) e suprimidas em runtime pelo `TypeArenaController`.
  - Transições e animações suprimidas.
- **Flash Safety**:
  - Sem estroboscópios, sem flashes rápidos e sem pulsos agressivos.
- **Contraste de UI**:
  - Vinheta radial de alto contraste protege sprites, nomes, barras de HP/PP, botões de golpes e battle log.

---

## 6. Métricas de Assets (WebP)

- **Total de novos assets**: 6 arquivos WebP locais (1024x576)
- **Peso total novo**: 755.010 bytes (~737.3 KB)
- **Média por asset**: 125.835 bytes (~122.9 KB)
- **Maior asset**: `arena-trial-mythical.webp` (158.018 bytes / ~154.3 KB)
- **Menor asset**: `arena-shadow.webp` (95.380 bytes / ~93.1 KB)
- **Dependência externa em runtime**: ZERO (100% assets locais otimizados)
