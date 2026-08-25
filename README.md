# ⚡ Pokédex Pro - Desafio DIO

Uma aplicação Pokédex moderna, dinâmica e visualmente atraente desenvolvida em **JavaScript Vanilla**, **HTML5** e **CSS3 Moderno** consumindo a **PokéAPI REST**.

Projeto desenvolvido para o desafio prático de JavaScript da **[Digital Innovation One (DIO)](https://www.dio.me/)**.

Acesso a Pokedex https://spiritstonesrafa-ux.github.io/js-developer-pokedex/

---

## ✨ Funcionalidades e Diferenciais

- 🎨 **Design Glassmorphism & UI/UX Premium**: Cards com gradientes dinâmicos de acordo com o tipo primário do Pokémon, efeitos de iluminação e hover 3D tilt.
- 🌓 **Dark Mode / Light Mode**: Alternância de tema com persistência no `localStorage`.
- 🔍 **Busca em Tempo Real**: Pesquise instantaneamente por nome ou número (#ID).
- 🏷️ **Filtros por Tipo & Geração**:
  - Filtro por todos os 18 tipos Pokémon (Fire, Water, Grass, Electric, Dragon, etc.).
  - Filtro por Gerações (1ª Geração Kanto até a 9ª Geração Paldea).
- 📊 **Ordenação Inteligente**: Ordene por ID crescente/decrescente, Ordem Alfabética (A-Z / Z-A) ou por Total de Stats (mais fortes).
- 💖 **Sistema de Favoritos**: Salve seus Pokémon preferidos no navegador e filtre para visualizá-los a qualquer momento.
- 📱 **Modal de Detalhes Completo**:
  - Artwork oficial em alta resolução com animações.
  - **Áudio Real (Pokémon Cry)**: Toque para ouvir o som original do Pokémon.
  - Medidas físicas (Altura, Peso) e lista de Habilidades.
  - Barras animadas e coloridas com valores de cada Status Base (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed).
  - Linha evolutiva completa e interativa (Evolution Chain).
- 📱 **100% Responsivo**: Otimizado para smartphones, tablets e telas widescreen.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Semântica e Acessibilidade)
- **CSS3** (Variáveis CSS, Flexbox, CSS Grid, Glassmorphism, Keyframe Animations)
- **JavaScript ES6+** (Async/Await, Fetch API, Promises, Classes, LocalStorage)
- **[PokéAPI REST](https://pokeapi.co/)**
- **FontAwesome Icons & Google Fonts (Outfit / Inter)**

---

## 🚀 Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/spiritstonesrafa-ux/js-developer-pokedex.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd js-developer-pokedex
   ```

3. Abra o arquivo `index.html` em qualquer navegador ou use a extensão **Live Server** do VS Code.

---

## 📂 Estrutura de Arquivos

```
├── assets/
│   ├── css/
│   │   ├── reset.css       # Resets e variáveis de cores dos tipos/temas
│   │   ├── global.css      # Layout geral, cabeçalho e controles de busca
│   │   ├── pokedex.css     # Grid e cards dos pokémons
│   │   └── modal.css       # Estilos do modal com estatísticas e evolução
│   └── js/
│       ├── pokemon-model.js # Classe e modelo de dados do Pokémon
│       ├── poke-api.js      # Integração e requisições HTTP para a PokéAPI
│       └── main.js          # Manipulação do DOM, eventos e filtros
├── index.html               # Estrutura principal da página
└── README.md                # Documentação do projeto
```

---

Desenvolvido com 💜 por Rafael.
