import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GRID_SIZE = 8;
const CANDY_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

type CandyColor = string;
type BoardType = CandyColor[][];
type MatchCell = { row: number; col: number };

function generateBoard(): BoardType {
  const board = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push(CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)]);
    }
    board.push(row);
  }
  return board;
}

function cloneBoard(board: BoardType): BoardType {
  return board.map(row => [...row]);
}

function findMatches(board: BoardType): MatchCell[] {
  const matches = [];
  // Horizontal
  for (let i = 0; i < GRID_SIZE; i++) {
    let streak = 1;
    for (let j = 1; j < GRID_SIZE; j++) {
      if (board[i][j] && board[i][j] === board[i][j - 1]) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let k = 0; k < streak; k++) {
            matches.push({ row: i, col: j - 1 - k });
          }
        }
        streak = 1;
      }
    }
    if (streak >= 3) {
      for (let k = 0; k < streak; k++) {
        matches.push({ row: i, col: GRID_SIZE - 1 - k });
      }
    }
  }
  // Vertical
  for (let j = 0; j < GRID_SIZE; j++) {
    let streak = 1;
    for (let i = 1; i < GRID_SIZE; i++) {
      if (board[i][j] && board[i][j] === board[i - 1][j]) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let k = 0; k < streak; k++) {
            matches.push({ row: i - 1 - k, col: j });
          }
        }
        streak = 1;
      }
    }
    if (streak >= 3) {
      for (let k = 0; k < streak; k++) {
        matches.push({ row: GRID_SIZE - 1 - k, col: j });
      }
    }
  }
  // Remove duplicados
  return matches.filter(
    (v, i, a) => a.findIndex(t => t.row === v.row && t.col === v.col) === i
  );
}

function removeMatches(board: BoardType, matches: MatchCell[]): BoardType {
  const newBoard = cloneBoard(board);
  matches.forEach(({ row, col }) => {
    newBoard[row][col] = null;
  });
  // Faz os doces caírem
  for (let col = 0; col < GRID_SIZE; col++) {
    let empty = [];
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        empty.push(row);
      } else if (empty.length > 0) {
        const emptyRow = empty.shift();
        newBoard[emptyRow][col] = newBoard[row][col];
        newBoard[row][col] = null;
        empty.push(row);
      }
    }
    // Preenche topo
    for (let k = 0; k < empty.length; k++) {
      newBoard[empty[k]][col] = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
    }
  }
  return newBoard;
}

function getMatchedMap(matches: MatchCell[]): boolean[][] {
  const map: boolean[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
  matches.forEach(({ row, col }) => {
    map[row][col] = true;
  });
  return map;
}

export default function CandybaraGame() {
  const [board, setBoard] = useState(generateBoard());
  const [selected, setSelected] = useState<MatchCell | null>(null);
  const [score, setScore] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [matchedCells, setMatchedCells] = useState<MatchCell[]>([]);
  const opacityAnim = useRef(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null).map(() => new Animated.Value(1)))
  ).current;
  const dropAnim = useRef(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null).map(() => new Animated.Value(0)))
  ).current;

  // Detecta e anima matches
  useEffect(() => {
    const matches = findMatches(board);
    if (matches.length > 0) {
      setAnimating(true);
      setMatchedCells(matches);

      // Pisca os doces que vão sumir
      matches.forEach(({ row, col }) => {
        Animated.sequence([
          Animated.timing(opacityAnim[row][col], {
            toValue: 0.2,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim[row][col], {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim[row][col], {
            toValue: 0.2,
            duration: 120,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Aguarda animação de piscar antes de remover
      setTimeout(() => {
        // Remove doces e calcula queda
        const newBoard = removeMatches(board, matches);

        // Calcula deslocamento vertical para animação de queda
        for (let col = 0; col < GRID_SIZE; col++) {
          let dropCount = 0;
          for (let row = GRID_SIZE - 1; row >= 0; row--) {
            if (board[row][col] === null) {
              dropCount++;
            } else if (dropCount > 0) {
              dropAnim[row][col].setValue(-dropCount * 44); // 40px + 2*margin
              Animated.timing(dropAnim[row][col], {
                toValue: 0,
                duration: 250 + dropCount * 40,
                useNativeDriver: true,
              }).start();
            }
          }
        }

        setBoard(newBoard);
        setScore(prev => prev + matches.length * 10);
        setMatchedCells([]);
        setTimeout(() => setAnimating(false), 350);
      }, 400);
    }
  }, [board]);

  function handlePress(row: number, col: number) {
    if (animating) return;
    if (!selected) {
      setSelected({ row, col });
      return;
    }
    const { row: r, col: c } = selected;
    // Só permite troca adjacente
    if (
      (Math.abs(r - row) === 1 && c === col) ||
      (Math.abs(c - col) === 1 && r === row)
    ) {
      const newBoard = cloneBoard(board);
      // Troca
      [newBoard[r][c], newBoard[row][col]] = [newBoard[row][col], newBoard[r][c]];
      // Só aceita se formar combinação
      if (findMatches(newBoard).length > 0) {
        setBoard(newBoard);
      } else {
        setAnimating(true);
        setBoard(newBoard);
        setTimeout(() => {
          // Reverte se não formar combinação
          const reverted = cloneBoard(board);
          setBoard(reverted);
          setAnimating(false);
          Alert.alert('Movimento inválido', 'Nenhuma combinação formada');
        }, 350);
      }
    }
    setSelected(null);
  }

  function handleRestart() {
    setBoard(generateBoard());
    setScore(0);
    setSelected(null);
    setMatchedCells([]);
    // Reset animações
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        opacityAnim[i][j].setValue(1);
        dropAnim[i][j].setValue(0);
      }
    }
  }

  const matchedMap = getMatchedMap(matchedCells);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Pontuação: {score}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRestart}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.board}>
        {board.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((candy, colIdx) => (
              <Animated.View
                key={`${rowIdx}-${colIdx}`}
                style={[
                  styles.candy,
                  {
                    backgroundColor: candy || 'transparent',
                    borderWidth:
                      selected?.row === rowIdx && selected?.col === colIdx ? 3 : 0,
                    borderColor: 'white',
                    opacity: matchedMap[rowIdx][colIdx]
                      ? opacityAnim[rowIdx][colIdx]
                      : 1,
                    transform: [
                      { translateY: dropAnim[rowIdx][colIdx] }
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handlePress(rowIdx, colIdx)}
                  disabled={animating}
                />
              </Animated.View>
            ))}
          </View>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

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
    overflow: 'hidden',
  },
});