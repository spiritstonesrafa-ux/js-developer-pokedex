/**
 * ====================================================================
 * INTELIGÊNCIA ARTIFICIAL DE BATALHA: BATTLE AI (battle-ai.js)
 * ====================================================================
 * Módulo puro e determinístico da Fase PBA-007 (Battle AI).
 * 
 * Regras Arquiteturais Permanentes:
 * - BATTLE ENGINE ≠ BATTLE AI (A IA escolhe ações legais; o Engine as executa);
 * - ENGINE_DEPENDS_ON_AI = NO;
 * - AI_MAY_DEPEND_ON_ENGINE_MATH = YES (reutiliza BattleEvaluator);
 * - ZERO RNG INTERNO (determinismo estrito, sem aleatoriedade);
 * - ZERO TRAPAÇA (não lê ações futuras do jogador, nem rolls futuros de acurácia);
 * - ESTRATÉGIAS: SIMPLE (básica e sem troca voluntária) e SMART (avaliação profunda de dano esperado, STAB, fraquezas, imunidades e trocas estratégicas);
 * - Suporte genérico para 'enemy' e 'player'.
 * 
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

(function () {
  let constants;
  let BattleEvaluator;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
    BattleEvaluator = require('./battle-evaluator.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
    BattleEvaluator = window.PBABattle.BattleEvaluator;
  }

  const BattleAI = (() => {
    const STRATEGY = (constants && constants.AI_STRATEGY) || {
      SIMPLE: 'SIMPLE',
      SMART: 'SMART'
    };

    const REASON = (constants && constants.AI_DECISION_REASON) || {
      FIRST_USABLE_MOVE: 'FIRST_USABLE_MOVE',
      BEST_EXPECTED_DAMAGE: 'BEST_EXPECTED_DAMAGE',
      GUARANTEED_KO: 'GUARANTEED_KO',
      AVOID_IMMUNITY_SWITCH: 'AVOID_IMMUNITY_SWITCH',
      STRATEGIC_MATCHUP_SWITCH: 'STRATEGIC_MATCHUP_SWITCH',
      NO_PP_SWITCH: 'NO_PP_SWITCH',
      FIRST_HEALTHY_RESERVE: 'FIRST_HEALTHY_RESERVE',
      BEST_MATCHUP_REPLACEMENT: 'BEST_MATCHUP_REPLACEMENT',
      NO_USABLE_ACTION: 'NO_USABLE_ACTION'
    };

    const CONFIG = (constants && constants.AI_CONFIG) || {
      KO_BONUS: 1000,
      SMART_SWITCH_MARGIN: 1.3
    };

    /**
     * Valida o estado de batalha e os parâmetros fornecidos à IA.
     */
    function validateInput(state, side, strategy) {
      if (!state || typeof state !== 'object') {
        throw new Error('Estado de batalha inválido fornecido para BattleAI.');
      }
      if (!state.player || !state.enemy) {
        throw new Error('Estrutura de Battle State corrompida: "player" ou "enemy" ausente.');
      }
      if (side !== 'player' && side !== 'enemy') {
        throw new Error(`Lado de batalha inválido: "${side}". Deve ser "player" ou "enemy".`);
      }
      if (strategy !== STRATEGY.SIMPLE && strategy !== STRATEGY.SMART) {
        throw new Error(`Estratégia de IA inválida: "${strategy}". Suportadas: "SIMPLE", "SMART".`);
      }
    }

    /**
     * Escolhe a próxima ação (MOVE ou SWITCH) para o lado especificado.
     * 
     * @param {Object} state - Battle State atual (v2).
     * @param {'player'|'enemy'} side - Lado controlado pela IA.
     * @param {Object} [options] - Opções ({ strategy: 'SIMPLE'|'SMART', accuracyRoll: number }).
     * @returns {{ action: Object|null, diagnostics: Object }}
     */
    function chooseAction(state, side, options = {}) {
      const strategy = (options && options.strategy) || STRATEGY.SMART;
      validateInput(state, side, strategy);

      if (state.status === constants.BATTLE_STATUS.AWAITING_REPLACEMENT) {
        throw new Error('Batalha aguardando substituição obrigatória. Utilize chooseReplacement() em vez de chooseAction().');
      }

      const mySide = state[side];
      const oppSideRole = side === 'player' ? 'enemy' : 'player';
      const oppSide = state[oppSideRole];

      const myTeam = Array.isArray(mySide.team) ? mySide.team : [mySide.activePokemon || mySide];
      const myActiveIndex = mySide.activeIndex !== undefined ? mySide.activeIndex : 0;
      const myActive = myTeam[myActiveIndex];

      const oppTeam = Array.isArray(oppSide.team) ? oppSide.team : [oppSide.activePokemon || oppSide];
      const oppActiveIndex = oppSide.activeIndex !== undefined ? oppSide.activeIndex : 0;
      const oppActive = oppTeam[oppActiveIndex];

      if (!myActive || myActive.currentHp === 0) {
        throw new Error(`Pokémon ativo de "${side}" está nocauteado ou inexistente.`);
      }

      // 1. Golpes utilizáveis do ativo (PP > 0 e dano físico/especial)
      const activeMoves = Array.isArray(myActive.moves) ? myActive.moves : [];
      const usableMoves = activeMoves
        .map((m, idx) => ({ ...m, loadoutIndex: idx }))
        .filter(m => (m.currentPp === undefined || m.currentPp > 0) && m.damageClass !== 'status');

      // 2. Candidatos do banco vivos
      const livingBench = myTeam
        .map((p, idx) => ({ pokemon: p, teamIndex: idx }))
        .filter(item => item.teamIndex !== myActiveIndex && item.pokemon.currentHp > 0);

      // Candidatos do banco vivos que possuem pelo menos 1 golpe utilizável com PP
      const livingBenchWithMoves = livingBench.filter(item => {
        const mvs = Array.isArray(item.pokemon.moves) ? item.pokemon.moves : [];
        return mvs.some(m => (m.currentPp === undefined || m.currentPp > 0) && m.damageClass !== 'status');
      });

      // ================================================================
      // ESTRATÉGIA SIMPLE
      // ================================================================
      if (strategy === STRATEGY.SIMPLE) {
        // Se possui golpe utilizável, escolhe sempre o primeiro
        if (usableMoves.length > 0) {
          const selectedMove = usableMoves[0];
          const action = {
            type: constants.BATTLE_ACTIONS.MOVE,
            moveId: selectedMove.id
          };
          if (options && options.accuracyRoll !== undefined) {
            action.accuracyRoll = options.accuracyRoll;
          }
          return {
            action,
            diagnostics: {
              strategy: STRATEGY.SIMPLE,
              reason: REASON.FIRST_USABLE_MOVE,
              selectedScore: 0,
              candidateCount: usableMoves.length
            }
          };
        }

        // Sem PP no ativo: tenta trocar para o primeiro banco vivo COM GOLPES DISPONÍVEIS
        if (livingBenchWithMoves.length > 0) {
          const firstHealthy = livingBenchWithMoves[0].pokemon;
          return {
            action: {
              type: constants.BATTLE_ACTIONS.SWITCH,
              targetPokemonId: firstHealthy.id
            },
            diagnostics: {
              strategy: STRATEGY.SIMPLE,
              reason: REASON.NO_PP_SWITCH,
              candidateCount: livingBenchWithMoves.length
            }
          };
        }

        // Sem ações legais possíveis na equipe inteira
        return {
          action: null,
          diagnostics: {
            strategy: STRATEGY.SIMPLE,
            reason: REASON.NO_USABLE_ACTION,
            candidateCount: 0
          }
        };
      }

      // ================================================================
      // ESTRATÉGIA SMART
      // ================================================================

      // Caso o ativo esteja sem nenhum golpe com PP
      if (usableMoves.length === 0) {
        if (livingBenchWithMoves.length > 0) {
          // Escolhe o melhor banco disponível com golpes
          const bestReserve = livingBenchWithMoves[0].pokemon;
          return {
            action: {
              type: constants.BATTLE_ACTIONS.SWITCH,
              targetPokemonId: bestReserve.id
            },
            diagnostics: {
              strategy: STRATEGY.SMART,
              reason: REASON.NO_PP_SWITCH,
              candidateCount: livingBenchWithMoves.length
            }
          };
        }

        return {
          action: null,
          diagnostics: {
            strategy: STRATEGY.SMART,
            reason: REASON.NO_USABLE_ACTION,
            candidateCount: 0
          }
        };
      }

      // 3. Avaliação pura do confronto do ativo atual
      const activeMatchup = BattleEvaluator.evaluateMatchup(myActive, oppActive);

      // Avaliação detalhada de cada golpe utilizável do ativo
      const evaluatedMoves = usableMoves.map(m => {
        const evalData = BattleEvaluator.evaluateMove(myActive, oppActive, m);
        let score = evalData.expectedDamage;

        // Bônus decisivo para KO garantido vs possível (PBA-014B)
        if (evalData.guaranteedKo) {
          score += CONFIG.KO_BONUS;
        } else if (evalData.possibleKo) {
          score += Math.floor(CONFIG.KO_BONUS / 2);
        }

        // Anulação estrita de golpes imunes
        if (evalData.typeMultiplier === 0) {
          score = 0;
        }

        return {
          ...evalData,
          loadoutIndex: m.loadoutIndex,
          score
        };
      });

      // 4. Verificação de Troca Voluntária (Voluntary Switch)
      if (livingBench.length > 0) {
        // Regra SW1: Imunidade Total do Ativo
        // Se nenhum golpe utilizável do ativo causa dano (todos 0x)
        const hasDamagingMove = evaluatedMoves.some(m => m.typeMultiplier > 0 && m.damageIfHit > 0);
        if (!hasDamagingMove) {
          // Avalia se algum membro do banco consegue causar dano (> 0)
          let bestSwitchCandidate = null;
          let bestSwitchDamage = 0;

          for (const item of livingBench) {
            const benchMatchup = BattleEvaluator.evaluateMatchup(item.pokemon, oppActive);
            if (benchMatchup.bestExpectedDamage > bestSwitchDamage && benchMatchup.bestTypeMultiplier > 0) {
              bestSwitchDamage = benchMatchup.bestExpectedDamage;
              bestSwitchCandidate = item.pokemon;
            }
          }

          if (bestSwitchCandidate) {
            return {
              action: {
                type: constants.BATTLE_ACTIONS.SWITCH,
                targetPokemonId: bestSwitchCandidate.id
              },
              diagnostics: {
                strategy: STRATEGY.SMART,
                reason: REASON.AVOID_IMMUNITY_SWITCH,
                selectedScore: bestSwitchDamage,
                candidateCount: livingBench.length
              }
            };
          }
        }

        // Regra SW2: Matchup Muito Desfavorável
        // Ativo tem eficácia muito baixa (<= 0.5x) e NÃO garante KO
        const bestActiveMultiplier = evaluatedMoves.reduce((max, m) => Math.max(max, m.typeMultiplier), 0);
        const activeGuaranteesKo = evaluatedMoves.some(m => m.wouldKo);

        if (bestActiveMultiplier <= 0.5 && !activeGuaranteesKo) {
          // Busca reserva com golpe super efetivo (>= 2.0x) e vantagem clara
          let eligibleCandidate = null;
          let highestCandidateScore = -Infinity;

          for (const item of livingBench) {
            const candidate = item.pokemon;
            const bMatchup = BattleEvaluator.evaluateMatchup(candidate, oppActive);

            // Apenas considera se a reserva tem golpe super efetivo contra o oponente
            if (bMatchup.bestTypeMultiplier >= 2.0) {
              // Risco defensivo da reserva não pode ser catastroficamente pior que o do ativo
              // Se a reserva sofre KO em 1 golpe e o ativo não sofria, a troca é evitada
              if (bMatchup.opponentWouldKo && !activeMatchup.opponentWouldKo) {
                continue;
              }

              // Pontuação composta de matchup da reserva
              const candidateScore = (bMatchup.bestExpectedDamage * 2.0) - (bMatchup.opponentBestExpectedDamage * 1.0) + (bMatchup.currentHp * 0.5);
              const activeScore = (activeMatchup.bestExpectedDamage * 2.0) - (activeMatchup.opponentBestExpectedDamage * 1.0) + (activeMatchup.currentHp * 0.5);

              // Exige margem estratégica mínima sobre o ativo
              if (candidateScore > activeScore * CONFIG.SMART_SWITCH_MARGIN) {
                if (candidateScore > highestCandidateScore) {
                  highestCandidateScore = candidateScore;
                  eligibleCandidate = candidate;
                }
              }
            }
          }

          if (eligibleCandidate) {
            return {
              action: {
                type: constants.BATTLE_ACTIONS.SWITCH,
                targetPokemonId: eligibleCandidate.id
              },
              diagnostics: {
                strategy: STRATEGY.SMART,
                reason: REASON.STRATEGIC_MATCHUP_SWITCH,
                selectedScore: highestCandidateScore,
                candidateCount: livingBench.length
              }
            };
          }
        }
      }

      // 5. Seleção de Golpe (Move Selection)
      // Se existem golpes que causam dano, filtra e descarta golpes com imunidade absoluta (0x)
      let candidates = evaluatedMoves;
      const nonImmuneMoves = evaluatedMoves.filter(m => m.typeMultiplier > 0 && m.damageIfHit > 0);
      if (nonImmuneMoves.length > 0) {
        candidates = nonImmuneMoves;
      }

      // Desempate determinístico rigoroso:
      // 1. Maior score (inclui bônus de KO garantido)
      // 2. Maior expectedDamage
      // 3. Maior currentPp
      // 4. Menor posição no loadout (0 a 3)
      candidates.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.expectedDamage !== a.expectedDamage) return b.expectedDamage - a.expectedDamage;
        if (b.currentPp !== a.currentPp) return b.currentPp - a.currentPp;
        return a.loadoutIndex - b.loadoutIndex;
      });

      const selected = candidates[0];
      const reasonCode = selected.wouldKo ? REASON.GUARANTEED_KO : REASON.BEST_EXPECTED_DAMAGE;

      const action = {
        type: constants.BATTLE_ACTIONS.MOVE,
        moveId: selected.moveId
      };
      if (options && options.accuracyRoll !== undefined) {
        action.accuracyRoll = options.accuracyRoll;
      }

      return {
        action,
        diagnostics: {
          strategy: STRATEGY.SMART,
          reason: reasonCode,
          selectedScore: selected.score,
          expectedDamage: selected.expectedDamage,
          candidateCount: candidates.length
        }
      };
    }

    /**
     * Escolhe o Pokémon substituto para o lado especificado após nocaute (Forced Replacement).
     * 
     * @param {Object} state - Battle State atual em AWAITING_REPLACEMENT.
     * @param {'player'|'enemy'} side - Lado que necessita de substituição.
     * @param {Object} [options] - Opções ({ strategy: 'SIMPLE'|'SMART' }).
     * @returns {{ targetPokemonId: number, diagnostics: Object }}
     */
    function chooseReplacement(state, side, options = {}) {
      const strategy = (options && options.strategy) || STRATEGY.SMART;
      validateInput(state, side, strategy);

      const mySide = state[side];
      const oppSideRole = side === 'player' ? 'enemy' : 'player';
      const oppSide = state[oppSideRole];

      const myTeam = Array.isArray(mySide.team) ? mySide.team : [mySide.activePokemon || mySide];
      const myActiveIndex = mySide.activeIndex !== undefined ? mySide.activeIndex : 0;

      const oppTeam = Array.isArray(oppSide.team) ? oppSide.team : [oppSide.activePokemon || oppSide];
      const oppActiveIndex = oppSide.activeIndex !== undefined ? oppSide.activeIndex : 0;
      const oppActive = oppTeam[oppActiveIndex];

      // Candidatos válidos: não podem ser o Pokémon que acabou de ser nocauteado e não podem ter HP zero
      const livingReserves = myTeam
        .map((p, idx) => ({ pokemon: p, teamIndex: idx }))
        .filter(item => item.teamIndex !== myActiveIndex && item.pokemon.currentHp > 0);

      if (livingReserves.length === 0) {
        throw new Error(`Não existem Pokémon vivos na reserva para "${side}".`);
      }

      // Se há apenas 1 opção no banco, seleciona-a diretamente
      if (livingReserves.length === 1) {
        const choice = livingReserves[0].pokemon;
        return {
          targetPokemonId: choice.id,
          diagnostics: {
            strategy,
            reason: strategy === STRATEGY.SIMPLE ? REASON.FIRST_HEALTHY_RESERVE : REASON.BEST_MATCHUP_REPLACEMENT,
            selectedScore: choice.currentHp,
            candidateCount: 1
          }
        };
      }

      // SIMPLE: seleciona o primeiro saudável na ordem original da equipe
      if (strategy === STRATEGY.SIMPLE) {
        const choice = livingReserves[0].pokemon;
        return {
          targetPokemonId: choice.id,
          diagnostics: {
            strategy: STRATEGY.SIMPLE,
            reason: REASON.FIRST_HEALTHY_RESERVE,
            selectedScore: choice.currentHp,
            candidateCount: livingReserves.length
          }
        };
      }

      // SMART: avalia matchups de todos os candidatos contra o ativo oponente
      const evaluatedReserves = livingReserves.map(item => {
        const candidate = item.pokemon;
        const matchup = BattleEvaluator.evaluateMatchup(candidate, oppActive);

        // Dano efetivo limitado ao HP do oponente para valorizar KO sem superdimensionar overkill
        const effectiveDamage = Math.min(matchup.bestExpectedDamage, oppActive.currentHp || 1);
        const defensiveRisk = candidate.currentHp > 0 ? (matchup.opponentBestExpectedDamage / candidate.currentHp) : 1;
        const remainingHpAfterHit = Math.max(0, candidate.currentHp - matchup.opponentBestExpectedDamage);

        // Pontuação composta:
        // + Dano efetivo ponderado (* 2.5)
        // + HP remanescente após sofrer o maior golpe adversário (* 1.5)
        // - Penalidade de risco defensivo proporcional (% do HP perdido * 150)
        let score = (effectiveDamage * 2.5) + (remainingHpAfterHit * 1.5) - (defensiveRisk * 150);

        // Bônus para candidato capaz de nocautear imediatamente o oponente
        if (matchup.bestMove && matchup.bestMove.wouldKo) {
          score += 500;
        }

        // Penalidade severa se o candidato sofrer KO em 1 golpe (defensive risk crítico)
        if (matchup.opponentWouldKo) {
          score -= 400;
        }

        return {
          pokemon: candidate,
          teamIndex: item.teamIndex,
          score,
          currentHp: candidate.currentHp
        };
      });

      // Desempate determinístico:
      // 1. Maior score de matchup
      // 2. Maior HP atual
      // 3. Menor índice na equipe (preserva a ordem do Team Builder)
      evaluatedReserves.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.currentHp !== a.currentHp) return b.currentHp - a.currentHp;
        return a.teamIndex - b.teamIndex;
      });

      const selected = evaluatedReserves[0];

      return {
        targetPokemonId: selected.pokemon.id,
        diagnostics: {
          strategy: STRATEGY.SMART,
          reason: REASON.BEST_MATCHUP_REPLACEMENT,
          selectedScore: selected.score,
          candidateCount: livingReserves.length
        }
      };
    }

    return {
      STRATEGY,
      REASON,
      CONFIG,
      chooseAction,
      chooseReplacement
    };
  })();

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleAI;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    window.PBABattle.BattleAI = BattleAI;
  }
})();
