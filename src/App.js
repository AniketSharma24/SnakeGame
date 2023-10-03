import React, { useState, useEffect } from 'react';
import './App.css';

const maxRows = 20;
const maxCols = 20;
const defaultSpeed = 150;
const defaultLevel = 0;
const initialSnakePosition = [{ row: 5, col: 5 }];
const initialSnakeDirection = 'RIGHT';

const getRandomPosition = () => ({
  row: Math.floor(Math.random() * maxRows),
  col: Math.floor(Math.random() * maxCols),
});

const App = () => {
  const [snake, setSnake] = useState(initialSnakePosition);
  const [snakeFood, setSnakeFood] = useState(getRandomPosition());
  const [snakeDirection, setSnakeDirection] = useState(initialSnakeDirection);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [speed, setSpeed] = useState(defaultSpeed);

  const [level, setLevel] = useState(defaultLevel);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('highScore')) {
      setHighScore(+localStorage.getItem('highScore'));
    } else {
      localStorage.setItem('highScore', 0);
      setHighScore(0);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (snakeDirection !== 'DOWN') setSnakeDirection('UP');
          break;
        case 'ArrowDown':
          if (snakeDirection !== 'UP') setSnakeDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (snakeDirection !== 'RIGHT') setSnakeDirection('LEFT');
          break;
        case 'ArrowRight':
          if (snakeDirection !== 'LEFT') setSnakeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [snakeDirection]);

  useEffect(() => {
    const checkCollision = () => {
      const head = snake[0];

      const gameOver = () => {
        alert(`Game Over! Your Score: ${currentScore}`);
        setSnake(initialSnakePosition);
        setSnakeDirection(initialSnakeDirection);
        setSnakeFood(getRandomPosition());
        setCurrentScore(0);
        setHighlight(false);
        setLevel(defaultLevel);
        setSpeed(defaultSpeed);
      };

      if (
        head.row < 0 ||
        head.col < 0 ||
        head.row >= maxRows ||
        head.col >= maxCols
      ) {
        gameOver();
        return true;
      }

      // Check if snake hits itself
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].row === head.row && snake[i].col === head.col) {
          gameOver();
          return true;
        }
      }

      return false;
    };

    const moveSnake = () => {
      if (checkCollision()) return;

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (snakeDirection) {
        case 'UP':
          head.row -= 1;
          break;
        case 'DOWN':
          head.row += 1;
          break;
        case 'LEFT':
          head.col -= 1;
          break;
        case 'RIGHT':
          head.col += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      if (head.row === snakeFood.row && head.col === snakeFood.col) {
        setSnakeFood(getRandomPosition());
        setCurrentScore(currentScore + 1);
        if (currentScore + 1 >= 10 && (currentScore + 1) % 10 === 0) {
          setSpeed(speed - 10);
          setLevel(level + 1);
          setHighlight(true);
          setTimeout(() => setHighlight(false), 1000);
        }
        if (highScore <= currentScore) {
          localStorage.setItem('highScore', currentScore + 1);
          setHighScore(currentScore + 1);
        }
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, speed);

    return () => {
      clearInterval(gameInterval);
    };
  }, [
    snakeDirection,
    snake,
    snakeFood,
    currentScore,
    highlight,
    level,
    speed,
    highScore,
  ]);

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isSnakeCell = snake.some(
          (segment) => segment.row === row && segment.col === col
        );
        const isFoodCell = snakeFood.row === row && snakeFood.col === col;
        const cellClass = isSnakeCell
          ? 'snake-cell'
          : isFoodCell
          ? 'food-cell'
          : '';

        grid.push(
          <div key={`${row}-${col}`} className={`cell ${cellClass}`}></div>
        );
      }
    }
    return grid;
  };

  return (
    <div className='main-container'>
      <h1>Snake Game</h1>
      <div className='score-board'>
        <p>High score: {highScore}</p>
        <p>Current score: {currentScore}</p>
      </div>
      <p className={highlight ? 'highlight' : ''}>You are at Level: {level}</p>
      <div className='snake-board'>
        <div className='game-container'>{renderGrid()}</div>
      </div>
    </div>
  );
};

export default App;
