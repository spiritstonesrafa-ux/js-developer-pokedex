# Avatar no mapa da campanha — Fase 4

## Entrega

- Escolher outra aba no modo Mapa faz o avatar seguir as trilhas SVG até uma saída sinalizada. Depois há uma curta saída de cena e entrada no mapa de destino.
- Cada par de regiões tem saída e chegada declaradas no catálogo, usando extremos das trilhas atuais. A chegada passa a ser a posição visual persistida da região de destino; a posição de saída também é guardada na origem.
- Chegar a um ponto de passagem **não inicia a batalha** daquele nó. A seleção de desafio continua separada.
- Pular caminhada conclui a transferência. Cliques repetidos ficam bloqueados durante caminhada e transição; sair da tela cancela o trabalho pendente.
- A Região Final continua exigindo 18 insígnias. No modo Lista, com movimento reduzido ou sem geometria SVG, a troca é imediata e preserva a última posição já conhecida da região.

## Decisão de mapa

Os quatro mapas são cenas separadas e não têm rotas físicas entre suas bordas. Por isso a Fase 4 usa pontos de passagem em nós existentes, sem criar desafios, mexer nas regras de campanha ou inventar trilhas entre cenários. As abas continuam sendo o seletor de destino; as placas **Saída** mostram os pontos de passagem no mapa.

## Validação

- Testes cobrem os 12 links dirigidos, seus nós válidos, caminhada, chegada automática, botão de pular, persistência, bloqueio da Região Final, alternativas diretas e cancelamento. `npm run test:campaign`: 163/163; `npm test`: 801/801.
- Conferência visual manual em desktop e celular ainda é recomendada para ajustar a posição das placas e o ritmo da transição.
