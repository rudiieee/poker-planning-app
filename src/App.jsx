import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const cards = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, "?", "☕"];

export default function PokerPlanning() {
  const [votes, setVotes] = useState({});
  const [revealed, setRevealed] = useState(false);

  const users = ["Alice", "Bob", "Charlie", "Dana"];

  const handleVote = (user, card) => {
    if (!revealed) {
      setVotes((prev) => ({ ...prev, [user]: card }));
    }
  };

  const average = () => {
    const numericVotes = Object.values(votes).filter((v) => typeof v === "number");
    if (numericVotes.length === 0) return null;
    const sum = numericVotes.reduce((a, b) => a + b, 0);
    return (sum / numericVotes.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Poker Planning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">{user}</h2>
            <div className="flex flex-wrap gap-2">
              {cards.map((card) => (
                <Button
                  key={card}
                  variant={votes[user] === card ? "default" : "outline"}
                  onClick={() => handleVote(user, card)}
                >
                  {card}
                </Button>
              ))}
            </div>
            <div className="mt-4 text-xl">
              Vote: {revealed ? votes[user] ?? "-" : votes[user] ? "•••" : "-"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button onClick={() => setRevealed(true)} disabled={revealed}>
          Reveal Votes
        </Button>
        <Button variant="outline" onClick={() => { setVotes({}); setRevealed(false); }}>
          Reset
        </Button>
      </div>

      {revealed && (
        <div className="mt-6 text-center text-2xl">
          Average: <strong>{average() ?? "N/A"}</strong>
        </div>
      )}
    </div>
  );
}
