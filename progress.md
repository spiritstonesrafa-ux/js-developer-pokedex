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
5. **Game Engine Pura na PBA-003**: Sem tipos, vantagens elementais, golpes reais ou IA nesta fase. As regras matemáticas de tipos serão introduzidas estritamente na PBA-004.

---

## 6. Estado Atual do Repositório

- **Branch**: `main`
- **Status das Fases**:
  - `PBA-001 = PASS`
  - `PBA-002 = PASS`
  - `PBA-003 = PASS`
- **Working Tree**: Limpo (pré-commit da fase PBA-003)

---

## 7. Próxima Fase Planejada

```text
NEXT_PHASE = PBA-004 — Type System
```

*(Atenção: A Fase PBA-004 NÃO deve ser iniciada automaticamente; aguardar solicitação explícita do usuário).*
