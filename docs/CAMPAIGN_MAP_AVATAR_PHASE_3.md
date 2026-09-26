# Avatar no mapa da campanha — Fase 3

## Entrega

- O avatar tem seis quadros originais com transparência: dois horizontais, dois descendo e dois subindo. Para caminhar à esquerda, os quadros horizontais são espelhados.
- A orientação acompanha a direção real de cada trecho da rota SVG. O primeiro trecho já define a direção antes do primeiro quadro de movimento.
- As pernas alternam a cada 48 unidades percorridas no mapa, e o pequeno movimento vertical acompanha essa troca. Assim, a passada segue o avanço do avatar, não um relógio independente.
- Ao mudar de região, o avatar aparece com uma entrada curta e suave. Com preferência por movimento reduzido, a entrada e a caminhada são omitidas como antes.
- No celular, **Pular caminhada** fica ancorado ao painel visível, fora da área do mapa que rola horizontalmente. Mantém alvo de toque com pelo menos 44 px.

## Arte

- Horizontal: `player-traveler.png` e `player-traveler-step-b.png` (já existentes).
- Descida: `player-traveler-down-a.png` e `player-traveler-down-b.png` (novos).
- Subida: `player-traveler-up-a.png` e `player-traveler-up-b.png` (novos).
- As quatro poses novas foram derivadas dos sprites existentes com a ferramenta integrada de geração de imagens, preservando personagem, roupas, estilo pixelado, dimensões e canal alfa. Cada par alterna qual perna avança.

## Limites e validação

- A troca de região ainda é entre mapas separados: não existe caminhada física de um mapa ao outro. Batalhas, desbloqueios, recompensas e save principal não mudaram.
- `npm run test:campaign`: 160 testes aprovados. `npm test`: 798 testes aprovados.
- Cobertura nova: arquivos e transparência dos seis quadros, seleção de direção, espelhamento, cadência por distância, entrada visual e botão de pular visível no layout móvel.
- A conexão com o navegador local falhou neste ambiente; a animação em execução não pôde ser inspecionada visualmente em desktop/celular. É necessária conferência manual jogando.
