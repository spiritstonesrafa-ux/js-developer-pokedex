# Encontros selvagens — Fase 2

## O que mudou

- As Regiões 1, 2 e 3 agora têm pontos opcionais de exploração no mapa. O avatar caminha até o bioma antes do encontro. A Região Final não tem encontros selvagens para preservar as recompensas dos desafios de elite.
- Os pools são formados a partir dos Pokémon do draft com golpes offline compatíveis, usando tipos e faixa de força adequados a cada mapa: mata/costa, cânion/picos e ruínas arcanas. Lendários, míticos e todas as espécies reservadas a Mestres, Super e Provas são excluídos.
- Em cada região, o pool é ordenado pelo BST: metade inferior é comum, 35% seguintes são incomuns e os 15% mais fortes são raros. No sorteio, as frequências dos níveis são **70% / 25% / 5%**. Dentro de cada nível, as espécies elegíveis têm chances iguais. Se um nível esgotar porque todas as espécies foram adquiridas, as chances restantes são normalizadas. O encontro não pode sortear espécie já possuída.
- A raridade e o bioma aparecem na preparação da batalha. O combate continua 3 contra 1 e a captura mantém uma tentativa com **72% de chance**, independentemente da raridade.
- Cada região permite até **duas capturas bem-sucedidas**, totalizando seis. Falhas, derrotas e encontros abandonados não consomem o limite. O limite da Região 1 existente foi preservado.

## Saves e progressão

- O save mantém `capturedIds` para o elenco e adiciona `captureRegions` para saber onde cada espécie foi capturada. Saves anteriores sem esse campo atribuem as capturas existentes à Região 1.
- Encontro ativo, captura pendente e resultado preservam a região. Dados de região/espécie inválidos são descartados na leitura.
- Com as seis capturas, o elenco permanente pode chegar a 35 após as recompensas fixas; o Shadow Final Stand pode oferecer 43 Pokémon ao incluir seus oito reforços temporários. Insígnias, quatro Provas, Super e Quick Battle mantêm suas regras.

## Validação

- Testes verificam composição dos três pools, exclusão de recompensas, frequências por nível, migração de saves, limites independentes, caminhada nos três mapas, apresentação da raridade e progressão até o Final Stand.
- Validação automatizada final: `npm run test:campaign` **178/178** e `npm test` **816/816**.
- Conferência visual manual em navegador ainda é recomendada; a conexão automatizada com o navegador falhou neste ambiente.
