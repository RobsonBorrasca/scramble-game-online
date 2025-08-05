'use client';
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WORDS = ["apple", "banana", "grape", "orange", "peach", "lemon", "mango"];

function shuffleWord(word: string): string {
  const shuffled = word.split("").sort(() => 0.5 - Math.random()).join("");
  return shuffled === word ? shuffleWord(word) : shuffled;
}

export default function WordScrambleGame() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [players, setPlayers] = useState<{ name: string, score: number }[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (gameStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setMessage("Time's up!");
    }
  }, [gameStarted, timer]);

  const startGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setScrambled(shuffleWord(newWord));
    setGuess("");
    setMessage("");
    setTimer(30);
    setRound((r) => r + 1);
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === word.toLowerCase()) {
      setScore(score + 10);
      setMessage("Correct!");
    } else {
      setMessage("Wrong guess, try again.");
    }
  };

  const addPlayer = () => {
    if (players.length < 7 && playerName) {
      setPlayers([...players, { name: playerName, score: 0 }]);
      setPlayerName("");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      {!gameStarted ? (
        <div>
          <h1 className="text-xl font-bold mb-4">Multiplayer Word Scramble</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <Button onClick={addPlayer}>Join Game</Button>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Players ({players.length}/7):</h2>
            <ul>
              {players.map((p, i) => (
                <li key={i}>{p.name}</li>
              ))}
            </ul>
          </div>
          {players.length >= 2 && (
            <Button className="mt-4" onClick={() => setGameStarted(true)}>
              Start Game
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold">Round {round}</h2>
            <p className="text-xl mt-2">Scrambled Word: {scrambled}</p>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="border p-2 rounded w-full my-2"
            />
            <Button onClick={handleGuess}>Guess</Button>
            <div className="mt-2">{message}</div>
            <div className="mt-2">Time left: {timer} seconds</div>
            <div className="mt-2">Score: {score}</div>
            <Button className="mt-4" onClick={startGame}>Next Round</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}