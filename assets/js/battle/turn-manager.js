/**
 * ====================================================================
 * GERENCIADOR DE TURNOS E INICIATIVA: TURN MANAGER (turn-manager.js)
 * ====================================================================
 * Responsável por determinar a ordem de atuação dos combatentes no turno
 * com base na velocidade (Speed).
 * 
 * Regras das Fases PBA-003 e PBA-004:
 * - O combatente com maior Speed atua primeiro;
 * - Em caso de empate de Speed, o jogador atua primeiro (regra determinística).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
  } else {
    constants = {
      BATTLE_CONFIG: {
        PLAYER_FIRST_ON_SPEED_TIE: true
      }
    };
  }

  const TurnManager = (() => {
    /**
     * Determina a ordem de ação entre dois combatentes.
     * @param {{ speed: number }} playerCombatant - Combatente do jogador.
     * @param {{ speed: number }} enemyCombatant - Combatente adversário.
     * @returns {Array<'player'|'enemy'>} Array com a ordem dos papéis ['primeiro', 'segundo'].
     */
    function determineOrder(playerCombatant, enemyCombatant) {
      if (!playerCombatant || typeof playerCombatant.speed !== 'number' || Number.isNaN(playerCombatant.speed)) {
        throw new Error('Combatente do jogador com velocidade (speed) inválida.');
      }

      if (!enemyCombatant || typeof enemyCombatant.speed !== 'number' || Number.isNaN(enemyCombatant.speed)) {
        throw new Error('Combatente adversário com velocidade (speed) inválida.');
      }

      const playerSpeed = Number(playerCombatant.speed);
      const enemySpeed = Number(enemyCombatant.speed);

      if (playerSpeed > enemySpeed) {
        return ['player', 'enemy'];
      }

      if (enemySpeed > playerSpeed) {
        return ['enemy', 'player'];
      }

      // Empate (Speed Tie) -> Regra determinística de desempate
      const playerFirstOnTie = constants.BATTLE_CONFIG?.PLAYER_FIRST_ON_SPEED_TIE !== false;
      return playerFirstOnTie ? ['player', 'enemy'] : ['enemy', 'player'];
    }

    return {
      determineOrder
    };
  })();

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TurnManager;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    window.PBABattle.TurnManager = TurnManager;
  }
})();
