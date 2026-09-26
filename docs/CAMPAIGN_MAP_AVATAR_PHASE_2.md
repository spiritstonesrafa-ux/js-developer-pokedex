# Avatar no mapa da campanha — Fase 2

## Entrega

- A região ativa e o último nó alcançado pelo avatar em cada região sobrevivem a recargas da página.
- Trocar de aba entre regiões mantém a posição anterior de cada mapa. Na primeira visita a uma região, o avatar aparece no primeiro nó visível.
- A posição é gravada somente quando o avatar chega ao destino (inclusive ao pular a caminhada ou seguir pelo modo Lista) e quando a região ativa muda. Uma recarga no meio da caminhada recupera o último nó confirmado, não um ponto intermediário.
- O reset da campanha limpa as posições e volta à Região 1. Dados de outra campanha, corrompidos, IDs inexistentes ou regiões bloqueadas não burlam a progressão.
- Falhas ou bloqueio do armazenamento local não impedem navegação, escolha do time ou batalha.

## Decisões técnicas

- A continuidade usa a chave local `campaign_map_avatar_progress_v1`, separada do save principal. Seu conteúdo é vinculado ao `startedAt` da campanha e validado contra o catálogo de regiões e nós. O save da campanha permanece na versão 1.
- A Região Final continua sujeita ao modelo de desbloqueio existente; restaurar uma aba salva não concede acesso antecipado.
- As quatro regiões são mapas separados, sem rotas SVG entre elas. A troca de região usa a transição de tela já existente; esta fase não inventa uma trilha física entre mapas.

## Validação

- `npm run test:campaign`: 158 testes aprovados.
- `npm test`: 796 testes aprovados.
- Casos novos: posições independentes por região, recarga, prioridade de região inicial explícita, reset, dados corrompidos/antigos, IDs inválidos, Região Final bloqueada e armazenamento indisponível.
- A experiência visual da troca de regiões ainda pede conferência manual em desktop e celular.
