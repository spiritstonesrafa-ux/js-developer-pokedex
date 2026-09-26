# Encontros selvagens — Fase 1

## Escopo jogável

- Na Região 1, o jogador pode clicar em **Explorar mata**. O avatar caminha até a área e encontra um Pokémon sorteado entre 87 espécies compatíveis com o bioma. A exploração é opcional; viajar até Mestres não dispara encontros.
- A lista exclui lendários, míticos, todos os candidatos reservados aos Mestres, Super e quatro Provas, além das espécies já possuídas. O sorteio fica salvo antes da batalha e não muda ao recarregar a página.
- O combate usa a mesma Battle Engine e o catálogo offline de quatro golpes da campanha, em formato 3 contra 1. Uma derrota não concede captura.
- Após a vitória, aparece uma tentativa de lançar Poké Bola: **72% de chance**, uma tentativa. Sucesso adiciona a espécie exata ao elenco permanente; falha faz o selvagem fugir. O resultado é mostrado antes do retorno ao mapa.
- A animação mostra a bola atingir o Pokémon, absorvê-lo, fechar, cair e balançar antes de revelar o resultado. Em caso de fuga, a bola abre e o Pokémon reaparece. A preferência por movimento reduzido revela o resultado imediatamente.
- O protótipo permite até **duas capturas bem-sucedidas na Região 1**. Não altera insígnias, recompensas de Mestres ou o desbloqueio por 18 insígnias.

## Persistência e compatibilidade

- Encontro ativo, captura pendente, capturas e resultado são guardados no save da campanha (versão 1). Saves anteriores sem estes campos recebem estado selvagem vazio.
- Capturas duplicadas, espécies reservadas, dados inválidos e captura pendente sem batalha registrada são descartados na leitura. Reset remove as capturas e o encontro.
- Capturados entram em `getRosterIds()`, no seletor de equipe e na personalização de golpes. Quick Battle continua independente.

## Próximas fases

- Fase 2: listas temáticas e frequência/raridade nas outras regiões.
- Fase 3: acabamento visual e sonoro da captura e do encontro, com revisão de celular e acessibilidade.
- Fase 4: balanceamento jogando, casos de save e regressão final.

## Validação

- Testes automatizados cobrem pool, sorteio, recarga, batalha real offline 3 contra 1, captura, derrota, fuga, limite, recompensa de Mestre, dados inválidos, reset, interface, suspense da animação e progressão completa até o Final Stand com 39 Pokémon. `npm run test:campaign`: **172/172**; `npm test`: **810/810**.
- Inspeção visual automatizada não foi possível neste ambiente porque a conexão local com o navegador falhou. Conferência manual no jogo permanece pendente.
