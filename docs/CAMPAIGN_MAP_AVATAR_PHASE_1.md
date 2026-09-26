# Avatar no mapa da campanha — Fase 1

## Entrega

- O modo Mapa exibe um sprite original do jogador sobre o primeiro nó visível da região. A posição visual é lembrada por região enquanto a instância da tela da campanha existir; não altera o save.
- Clicar em um nó continua abrindo os detalhes. Ao selecionar **Enfrentar**, o avatar percorre as rotas SVG já existentes até o destino, inclusive no sentido inverso. O caminho é calculado apenas entre nós e rotas visíveis.
- O seletor de time só abre após a chegada. A batalha continua iniciando somente depois que o jogador escolhe o time, preservando as regras de desbloqueio e recompensa.
- Durante a caminhada, ações concorrentes não iniciam outro desafio. Há um botão **Pular caminhada** com foco de teclado e aviso para leitor de tela.
- No modo Lista, com preferência de movimento reduzido, quando o alvo já é o nó atual ou se a geometria SVG não estiver disponível, o fluxo segue diretamente para o seletor de time.
- Sair da tela ou recriá-la cancela a animação sem iniciar desafio pendente.

## Arquitetura

- `campaign-map-model.js`: `findTravelPath` calcula o menor caminho bidirecional no grafo local da região, sem modificar catálogo nem estado da campanha.
- `campaign-map-view.js`: mantém posição visual temporária por região, amostra pontos reais de cada caminho SVG com `getPointAtLength`, limita a duração a 650–2600 ms e só então dispara `onChallenge`.
- `campaign-map.css`: camada visual do avatar, alternância de dois quadros de passada, movimento vertical discreto e controle de pular.
- `assets/images/campaign/player-traveler.png` e `player-traveler-step-b.png`: arte raster original, transparente, com pernas e braços em poses opostas.

## Limites desta fase

- Nesta fase não havia persistência de posição após recarregar a página nem continuidade ao trocar de região; essas duas limitações foram tratadas na [Fase 2](CAMPAIGN_MAP_AVATAR_PHASE_2.md). Ainda não há navegação livre ou percurso físico entre mapas. A caminhada tem dois quadros; uma animação mais rica e direcional pode ficar para uma fase futura.
- A arte e a animação ainda pedem conferência visual manual em desktop e celular; os testes automatizados verificam fluxo e contratos, não substituem essa avaliação.

## Validação

- `npm run test:campaign`: 155 testes aprovados.
- `npm test`: 793 testes aprovados.
- Cobertura nova: ida/volta e continuidade da rota, exclusão de nó oculto, abertura do seletor após chegar, pular, proteção contra clique repetido, memória temporária, movimento reduzido e cancelamento por destruição da tela.
