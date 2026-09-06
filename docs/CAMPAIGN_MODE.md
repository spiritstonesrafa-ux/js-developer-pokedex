# Circuito dos Mestres

A Campanha é uma jornada independente de `team.current`. O jogador escolhe exatamente seis Pokémon do draft de 36 espécies (quatro de cada geração) e os mantém até o reset. Os dezoito Mestres ficam livres desde o início; cada primeira vitória concede uma insígnia e abre uma escolha de um recruta entre a equipe derrotada. O elenco é derivado: 6 iniciais + 18 recrutas + 1 elite.

`campaign.progress` (versão 1) mantém apenas IDs e estado. JSON inválido, versões desconhecidas, IDs fora do catálogo e recompensas inconsistentes retornam a um estado seguro. Resultados usam `battleId` e uma janela de 96 IDs para idempotência. Reset remove somente essa chave.

A CampaignBattleCoordinator fornece times, metadata e modificadores à BattleSessionController existente; não há segunda arena ou engine. Depois das 18 insígnias e recompensas, o Super Treinador usa as três espécies de BST 600 mais altas no ranking dos Mestres, com desempate por maior atributo ofensivo, Speed e ID. Após a recompensa há uma revelação final; o mesmo trio volta com Shadow Aura, que altera somente a efetividade ofensiva inimiga: `max(2, multiplicador-base)`. O jogador permanece na tabela normal. Vitória conclui a jornada sem novo recruta.

O Perfil registra as batalhas concluídas via o mesmo `battleId`; abandono não registra progresso nem estatísticas.
