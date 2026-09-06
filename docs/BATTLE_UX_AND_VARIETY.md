# Battle UX and Quick Battle Variety (PBA-014D)

## Problemas resolvidos

A Battle Arena ativa era uma coluna longa dentro da Pokédex: em desktop desperdiçava largura e, em mobile, exigia rolagem para chegar aos quatro golpes. O Quick Battle também sorteava três integrantes, de forma independente, de uma pool de apenas 13 espécies.

A solução permanece na mesma SPA. Não existe battle.html, nova rota, nova sessão, novo Battle Engine ou acoplamento da seleção à Battle AI.

## Arquitetura imersiva

    Battle Session state
            ↓
    BattleView (UI)
            ↓
    body.battle-immersive-active
            ↓
    fixed shell / 100dvh / no document scroll

BattleView ativa o shell nos estados BATTLE, AWAITING_PLAYER_ACTION, RESOLVING, AWAITING_PLAYER_REPLACEMENT, VICTORY e DEFEAT. Cabeçalho, navegação e rodapé permanecem no DOM, mas não ocupam espaço enquanto a batalha está ativa. A saída cancela Scheduler, animações, VFX, áudio e câmera através dos contratos existentes e remove a classe global.

Em desktop, CSS Grid cria duas zonas: palco à esquerda e HUDs, narrativa, troca e grade 2×2 à direita. Em mobile, a ordem é top bar, HUD inimigo, palco, HUD jogador, narrativa e ações. O palco usa clamp() e dvh; os quatro golpes permanecem em 2×2. O shell suporta env(safe-area-inset-*), 100dvh com fallback 100vh e proíbe scroll vertical do documento. Somente modais podem rolar internamente.

## Fluxo de saída e resultado

A top bar contém Sair, os dois indicadores de equipe, turno e mute. Sair durante uma partida pede confirmação. Ao confirmar, a partida é abandonada sem registrar vitória/derrota no Perfil. Vitória e derrota permanecem no shell imersivo com Rematch e Voltar; rematch cria novo battleId e nova equipe adversária.

## Seleção de oponentes

    Quick Battle Roster
            ↓
    QuickBattleOpponentSelector
            ↓
    BattleOpponentFactory (hidrata somente 3)
            ↓
    Battle Session → Battle Engine → Battle AI

A Battle AI continua decidindo apenas golpe, troca e substituição. O seletor usa BattleRandomSource injetável e nunca usa o RNG de acurácia/dano.

O catálogo possui 72 espécies: oito por geração, nove gerações e todos os 18 tipos. Ditto, Unown, Wobbuffet e Smeargle não entram. Auditoria real contra a PokéAPI confirmou 72/72 IDs válidos e 72/72 loadouts finais com quatro golpes suportados.

### Roster por geração

- Gen 1: Venusaur, Charizard, Blastoise, Raichu, Machamp, Gengar, Lapras, Dragonite.
- Gen 2: Meganium, Typhlosion, Feraligatr, Ampharos, Scizor, Heracross, Houndoom, Tyranitar.
- Gen 3: Sceptile, Blaziken, Swampert, Gardevoir, Breloom, Flygon, Milotic, Metagross.
- Gen 4: Torterra, Infernape, Empoleon, Staraptor, Luxray, Roserade, Garchomp, Weavile.
- Gen 5: Serperior, Emboar, Samurott, Excadrill, Krookodile, Galvantula, Chandelure, Haxorus.
- Gen 6: Chesnaught, Delphox, Greninja, Talonflame, Aegislash, Sylveon, Hawlucha, Goodra.
- Gen 7: Decidueye, Incineroar, Primarina, Lycanroc, Mudsdale, Golisopod, Mimikyu, Kommo-o.
- Gen 8: Rillaboom, Cinderace, Inteleon, Corviknight, Toxtricity, Centiskorch, Hatterene, Dragapult.
- Gen 9: Meowscarada, Skeledirge, Quaquaval, Lokix, Pawmot, Tinkaton, Kingambit, Baxcalibur.

## Shuffle bag, anti-repeat e persistência

battle.quick.opponentRotation armazena schema versionado (version: 1), IDs vistos no ciclo e até dez trios recentes. A política:

1. exclui as espécies do time do jogador;
2. prioriza espécies ainda não vistas no ciclo;
3. exclui espécies das últimas cinco equipes enquanto houver candidatos;
4. seleciona três IDs únicos com RNG injetado;
5. impede repetição exata recente, ignorando a ordem;
6. grava a rotação somente após hidratação bem-sucedida;
7. reinicia o ciclo quando restam menos de três candidatos.

JSON corrompido ou versão desconhecida recupera estado limpo. seenInCycle e recentTeams são limitados. Pools artificiais muito pequenas de teste possuem fallback seguro; o roster normal sempre preserva a exclusão jogador/inimigo.

## Evidências técnicas

- Baseline: 521/521 testes.
- Simulação determinística de 30 batalhas: 69 espécies únicas, zero trio repetido, zero repetição nas cinco equipes anteriores, máximo de duas aparições.
- Simulação de 100 batalhas: 69/72 espécies (95,83%); as três restantes eram o time fixo do jogador.
- Chromium: 1366×768, 360×700, 390×844 e 412×915 com scrollY = 0, scrollHeight = innerHeight, sem overflow horizontal e todos os controles críticos visíveis.
- Dez preparações reais consecutivas: 30 espécies distintas.
- Hidratação quente medida: 44 ms; preparação fria observada: 6,592 s, dependente de rede/PokéAPI.
