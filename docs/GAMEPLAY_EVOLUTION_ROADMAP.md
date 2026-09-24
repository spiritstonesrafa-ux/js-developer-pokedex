# Evolução de gameplay da campanha

Cada fase é uma entrega independente: validar, fazer commit e push antes de iniciar a seguinte. A Fase 0 registra o ponto de partida e não muda o gameplay.

## Fase 0 — Ponto de partida

- Em 24/09/2026, `main` estava limpa e `npm test` passou: **754 testes, 0 falhas**.
- A campanha oferece 450 opções iniciais e quatro golpes ofensivos fixos para cada um dos 468 Pokémon atualmente obtíveis. Batalha e comparador usam o mesmo catálogo (`CAMPAIGN_MODE.md`).
- O motor recebe rolagens de fora e separa regras de apresentação (`battle-architecture.md`, `BATTLE_BALANCE.md`).
- Golpes de categoria `status` são descartados no fluxo atual (`BATTLE_MOVESETS.md`). Golpes complexos continuam bloqueados até que seus efeitos sejam implementados e testados.
- Batalha Rápida, saves antigos, recompensas e dificuldade padrão são comportamentos de referência: mudanças neles precisam ser explícitas.

## Regras comuns

1. Dados dos golpes, prévia tática e batalha devem concordar sobre golpe, precisão, PP e efeito. Não atribuir efeitos a todos os golpes de um tipo por aproximação.
2. Efeitos e chances são resolvidos pelo motor com entradas controláveis em testes; interface, áudio e animação apenas apresentam eventos.
3. Saves existentes continuam carregando. Valores ausentes recebem o padrão e valores inválidos são sanitizados.
4. Golpes ainda não suportados seguem indisponíveis. Sono, congelamento, confusão, Toxic, habilidades e itens não entram automaticamente nas fases 1–2.
5. Testar desafios iniciais e finais com equipes variadas. Não usar redutor global de dano como atalho de balanceamento.
6. Ao fim de cada fase: `npm test`, `npm run test:campaign`, `git diff --check` e revisão manual dos fluxos afetados. Só então fazer commit e push. Se algum portão falhar, corrigir ou relatar o impedimento sem declarar a fase concluída.

## Fase 1 — Piloto de veneno comum

Implementar uma condição de status de ponta a ponta com poucos golpes explicitamente habilitados. Veneno comum é diferente de Toxic: sem escalada de dano. Regra inicial: perda de `1/8` do HP máximo ao fim do turno, mínimo de 1 HP, respeitando imunidades aplicáveis. Um golpe de status consome turno e PP; erro de precisão não aplica o efeito. O veneno permanece no Pokémon durante trocas da batalha e termina com ela. Cura por item fica fora do escopo.

**Aceite:** acerto, erro e imunidade corretos; dano residual, nocaute e substituição sem turno extra; IA considera o golpe quando útil e o evita contra alvo já envenenado ou imune; eventos, log e interface indicam a condição; qualquer aleatoriedade é controlável nos testes; catálogo e comparador só anunciam o efeito nos golpes habilitados; Batalha Rápida e saves antigos não regressam. É aceitável estrear com uma lista curada de Pokémon e desafios.

## Fase 2 — Queimadura e paralisia

Adicionar uma condição por vez. Queimadura combina dano residual e redução de dano físico; paralisia altera iniciativa e pode impedir ação. Fixar em testes a ordem de resolução e o comportamento ao trocar, desmaiar ou enfrentar imunidade. Atualizar IA, prévia, log, indicadores acessíveis e apenas golpes cujo efeito completo seja suportado.

**Aceite:** os três status funcionam isolados e em confronto; somente um status principal por Pokémon; precisão e chance são reproduzíveis nos testes; nenhum golpe anuncia efeito que o motor não executa; desafios finais rebalanceados. Revisar esta fase antes de permitir personalização.

## Fase 3 — Escolha de golpes

Criar um conjunto **offline e curado** de alternativas elegíveis por espécie, sem liberar automaticamente todo o learnset da PokéAPI. O jogador mantém o quarteto atual ou escolhe até quatro golpes distintos. Validar propriedade do Pokémon, limite, duplicatas e suporte do motor; persistir preferências com sanitização e fallback para o quarteto padrão. A prévia deve usar exatamente o conjunto enviado à batalha.

**Aceite:** alterar, salvar, recarregar e restaurar o padrão; save antigo intacto; PP, precisão e efeitos iguais na prévia e no combate; adversários conservam conjuntos definidos; Batalha Rápida não muda por acidente.

## Fase 4 — Dificuldade Assistida opcional

Manter a dificuldade atual como **Padrão**. Oferecer Assistido antes do desafio, com ajuste transparente dos adversários e sem reduzir globalmente a fórmula de dano. Registrar a modalidade no histórico e fazer o comparador mostrar o adversário efetivamente escolhido. Antes de fixar o ajuste, comparar protótipos por taxa de vitória e duração em desafios iniciais e finais; escolher a regra menos invasiva.

**Aceite:** Padrão inalterado; opção clara; nenhuma recompensa ou progresso duplicado; Assistido mais acessível sem tornar o final automático. Revisar balanceamento antes da fase seguinte.

## Fase 5 — Objetivos opcionais

Adicionar metas secundárias aos confrontos repetíveis, calculadas pelo resultado real da batalha (por exemplo, vencer sem perder um Pokémon). Não bloquear insígnias nem história. Preferir reconhecimento visual/cosmético, sem poder obrigatório para etapas seguintes.

**Aceite:** objetivo visível antes da luta, progresso correto após vitória ou derrota, concessão idempotente, persistência segura e nenhuma alteração das recompensas principais.

Se a dificuldade atual se tornar urgente, a Fase 4 pode ser antecipada como entrega própria, nunca misturada ao commit de status.
