import React, { useState, useEffect } from 'react';
import './Game.css';

const getRandomPosition = () => {
  const min = 1;
  const max = 18;
  const x = Math.floor(Math.random() * (max - min + 1) + min);
  const y = Math.floor(Math.random() * (max - min + 1) + min);
  return [x, y];
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Game = () => {
  const [snake, setSnake] = useState([[2, 2], [2, 3]]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [boxShadowColor, setBoxShadowColor] = useState(getRandomColor());

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [...newSnake[newSnake.length - 1]];

      switch (direction) {
        case 'RIGHT':
          head[0] += 1;
          break;
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        case 'UP':
          head[1] -= 1;
          break;
        default:
          break;
      }

      newSnake.push(head);
      newSnake.shift();

      // Check for collision with food
      if (head[0] === food[0] && head[1] === food[1]) {
        newSnake.unshift([]);
        setFood(getRandomPosition());
        setSpeed(prevSpeed => Math.max(prevSpeed - 10, 50));
        setScore(prevScore => prevScore + 10);
      }

      // Check for collision with walls
      if (head[0] >= 20 || head[0] < 0 || head[1] >= 20 || head[1] < 0) {
        setGameOver(true);
        return;
      }

      // Check for collision with itself
      for (let i = 0; i < newSnake.length - 1; i++) {
        if (head[0] === newSnake[i][0] && head[1] === newSnake[i][1]) {
          setGameOver(true);
          return;
        }
      }

      newSnake.forEach((segment, index) => {
        segment.color = getRandomColor();
      });

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, speed, food, gameOver]);

  const changeDirection = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', changeDirection);
    return () => document.removeEventListener('keydown', changeDirection);
  }, [direction]);

  const handleButtonPress = (newDirection) => {
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  const restartGame = () => {
    setSnake([[2, 2], [2, 3]]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setSpeed(200);
    setGameOver(false);
    setScore(0);
    setBoxShadowColor(getRandomColor());
  };

  return (
    <div className="game-container">
      <div className="scoreboard">
        <h1>Score: {score}</h1>
        <p className="developer-name">Vatan Mishra</p>
      </div>
      <div 
        className="game-area" 
        style={{ boxShadow: `0 0 20px ${boxShadowColor}` }}
      >
        {gameOver && (
          <div className="game-over">
            <p>Game Over</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
        <div className="grid">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="bubble"
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                width: `${Math.random() * 50 + 10}px`,
                height: `${Math.random() * 50 + 10}px`,
                animationDuration: `${Math.random() * 5 + 5}s`,
              }}
            />
          ))}
          <div className="snake">
            {snake.map((segment, index) => (
              <div
                key={index}
                className="snake-segment"
                style={{
                  top: `${segment[1] * 5}%`,
                  left: `${segment[0] * 5}%`,
                  backgroundColor: segment.color,
                  boxShadow: `0 0 10px ${segment.color}`,
                }}
              ></div>
            ))}
          </div>
          <div
            className="food"
            style={{
              top: `${food[1] * 5}%`,
              left: `${food[0] * 5}%`,
              backgroundColor: getRandomColor(),
              boxShadow: `0 0 10px ${getRandomColor()}`,
            }}
          ></div>
        </div>
        {!gameOver && (
          <div className="controls">
            <button className="arrow-btn up" onClick={() => handleButtonPress('UP')}>&#9650;</button>
            <div className="horizontal-btns">
              <button className="arrow-btn left" onClick={() => handleButtonPress('LEFT')}>&#9664;</button>
              <button className="arrow-btn right" onClick={() => handleButtonPress('RIGHT')}>&#9654;</button>
            </div>
            <button className="arrow-btn down" onClick={() => handleButtonPress('DOWN')}>&#9660;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
