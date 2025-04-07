import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GRID_SIZE = 8;
const CANDY_COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];

const App = () => {
  const [board, setBoard] = useState([]);
  const [selectedCandy, setSelectedCandy] = useState(null);
  const [score, setScore] = useState(0);

  // Inicializa o tabuleiro
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push(CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)]);
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setScore(0);
  };

  const handleCandyPress = (row, col) => {
    if (selectedCandy) {
      // Verifica se é um movimento válido (adjacente)
      if (
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row)
      ) {
        // Faz a troca
        const newBoard = [...board];
        const temp = newBoard[row][col];
        newBoard[row][col] = newBoard[selectedCandy.row][selectedCandy.col];
        newBoard[selectedCandy.row][selectedCandy.col] = temp;
        setBoard(newBoard);
        
        // Verifica combinações após a troca
        setTimeout(() => {
          const matches = findMatches(newBoard);
          if (matches.length > 0) {
            removeMatches(newBoard, matches);
            setScore(score + matches.length * 10);
          } else {
            // Desfaz a troca se não houver combinações
            const revertedBoard = [...newBoard];
            revertedBoard[row][col] = newBoard[selectedCandy.row][selectedCandy.col];
            revertedBoard[selectedCandy.row][selectedCandy.col] = temp;
            setBoard(revertedBoard);
            Alert.alert('Movimento inválido', 'Nenhuma combinação formada');
          }
        }, 300);
      }
      setSelectedCandy(null);
    } else {
      setSelectedCandy({ row, col });
    }
  };

  const findMatches = (currentBoard) => {
    const matches = [];

    // Verifica linhas
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (
          currentBoard[i][j] === currentBoard[i][j + 1] &&
          currentBoard[i][j] === currentBoard[i][j + 2]
        ) {
          // Verifica se já existe combinação maior
          let k = j + 3;
          while (k < GRID_SIZE && currentBoard[i][j] === currentBoard[i][k]) {
            k++;
          }
          for (let l = j; l < k; l++) {
            matches.push({ row: i, col: l });
          }
          j = k - 1;
        }
      }
    }

    // Verifica colunas
    for (let j = 0; j < GRID_SIZE; j++) {
      for (let i = 0; i < GRID_SIZE - 2; i++) {
        if (
          currentBoard[i][j] === currentBoard[i + 1][j] &&
          currentBoard[i][j] === currentBoard[i + 2][j]
        ) {
          // Verifica se já existe combinação maior
          let k = i + 3;
          while (k < GRID_SIZE && currentBoard[i][j] === currentBoard[k][j]) {
            k++;
          }
          for (let l = i; l < k; l++) {
            matches.push({ row: l, col: j });
          }
          i = k - 1;
        }
      }
    }

    return matches;
  };

  const removeMatches = (currentBoard, matches) => {
    const newBoard = [...currentBoard];
    
    // Remove os doces combinados
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });

    // Preenche os espaços vazios
    for (let j = 0; j < GRID_SIZE; j++) {
      let emptySpaces = [];
      
      // Encontra espaços vazios na coluna
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        if (newBoard[i][j] === null) {
          emptySpaces.push(i);
        } else if (emptySpaces.length > 0) {
          const emptyRow = emptySpaces.shift();
          newBoard[emptyRow][j] = newBoard[i][j];
          newBoard[i][j] = null;
          emptySpaces.push(i);
        }
      }
      
      // Preenche os espaços no topo com novos doces
      emptySpaces.forEach(row => {
        newBoard[row][j] = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
      });
    }

    setBoard(newBoard);

    // Verifica se há novas combinações após o preenchimento
    setTimeout(() => {
      const newMatches = findMatches(newBoard);
      if (newMatches.length > 0) {
        removeMatches(newBoard, newMatches);
        setScore(score + newMatches.length * 10);
      }
    }, 500);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Pontuação: {score}</Text>
        <TouchableOpacity style={styles.button} onPress={initializeBoard}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((candy, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.candy,
                  {
                    backgroundColor: candy,
                    borderWidth: selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex ? 3 : 0,
                    borderColor: 'white',
                  },
                ]}
                onPress={() => handleCandyPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  candy: {
    width: 40,
    height: 40,
    margin: 2,
    borderRadius: 5,
  },
});

export default App;