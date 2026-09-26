# Encontros selvagens — Fase 3

## Acabamento implementado

- A tela do encontro surge com transição curta e cenário próprio para cada região: mata/costa, cânion/picos e ruínas arcanas. A tela de captura usa as mesmas cores do bioma. A apresentação não muda o sorteio, a batalha nem a chance de captura.
- Os efeitos de encontro, lançamento, absorção, fechamento, queda, três balanços, captura e fuga são gerados com Web Audio. Não há arquivo de som novo nem outro contexto de áudio: os efeitos usam o canal UI do mixer existente e respeitam o mudo da batalha.
- O botão **Som ligado/desligado** nas telas do encontro e da captura guarda a preferência no navegador. Falha, bloqueio ou indisponibilidade do áudio não interrompem a captura.
- Títulos recebem foco ao entrar em uma tela nova, sem roubar o foco repetidamente quando a equipe é selecionada. O estado do lançamento e do resultado é comunicado por texto, além da animação. O foco retorna ao ponto de exploração (ou à aba da região quando o limite foi atingido).
- Botões têm alvo de pelo menos 44 px e foco visível. Layouts estreitos preservam a cena e os controles. A preferência do sistema por movimento reduzido elimina a transição visual e revela o resultado da captura sem espera.

## Validação

- Testes automatizados: `npm run test:campaign` **181/181** e `npm test` **819/819**. Incluem o mixer, mudo, preferência de som, aba oculta, foco, temas regionais e estilos de celular/movimento reduzido.
- A inspeção visual automatizada em navegador não pôde ser concluída por falha na conexão local. Conferência manual recomendada: abrir encontros nas três regiões em desktop e celular; capturar e deixar escapar; alternar o som; repetir com movimento reduzido; navegar por teclado e leitor de tela.

## Regras preservadas

- Duas capturas por região, até seis no total; 70%/25%/5% de frequência comum/incomum/rara; uma tentativa com 72% de chance de captura; nenhum lendário, mítico ou candidato a recompensa fixa nos encontros.
