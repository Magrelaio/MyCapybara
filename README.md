# MyCapybara

MyCapybara é um aplicativo mobile onde você cuida de uma capivara virtual, decora seu quarto, joga minigames e coleciona itens!

## Funcionalidades
- Capivara virtual com estados (feliz, triste, com fome, suja, etc)
- Alimentar, brincar, limpar e colocar para dormir
- Sistema de moedas e loja de objetos
- Inventário e decoração do quarto (mover, redimensionar e posicionar pôsteres)
- Minigames para ganhar felicidade e moedas
- Salvamento automático do progresso

## Instalação
1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```
3. Execute o projeto:
   ```bash
   npx expo start
   # ou
   yarn expo start
   ```

## Estrutura do Projeto
- `app/(tabs)/` - Telas principais (Home, Quarto, Loja, Jogos)
- `components/` - Componentes visuais (Capybara, AnimatedCapybara, etc)
- `hooks/` - Hooks customizados (useCapybaraStats)
- `store/` - Estado global (CapybaraStats, objetos)
- `games/` - Minigames

## Como jogar
- Cuide da capivara alimentando, brincando, limpando e colocando para dormir.
- Ganhe moedas jogando minigames e compre itens na loja.
- Decore o quarto e personalize a posição/tamanho dos pôsteres.
- Salve seu progresso automaticamente.

## Créditos
- Artes base por Beatriz Elenhi
