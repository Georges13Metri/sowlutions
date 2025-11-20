"use client";

import { useEffect, useMemo, useState } from "react";

type FightRecord = {
  card: string;
  animal: string;
  fruit: string;
  result: boolean;
};

const CARDS = ["Diamonds", "Hearts", "Spades", "Clubs", "Joker"];
const ANIMALS = ["Lion", "Fox", "Parrot", "Seal", "Snake"];
const FRUITS = ["Apple", "Bananas", "Mango", "Watermelon", "Papaya"];

function calcFieldProbability(
  records: FightRecord[],
  field: "card" | "animal" | "fruit",
  value: string
) {
  const filtered = records.filter((r) => r[field] === value);
  const total = filtered.length;
  const wins = filtered.filter((r) => r.result).length;
  const prob = total > 0 ? wins / total : 0; // 0 if we have no data
  return { wins, total, prob };
}

function calculateProbabilities(
  records: FightRecord[],
  card: string,
  animal: string,
  fruit: string
) {
  const suitStats = calcFieldProbability(records, "card", card);
  const animalStats = calcFieldProbability(records, "animal", animal);
  const fruitStats = calcFieldProbability(records, "fruit", fruit);

  const overallProb = (suitStats.prob + animalStats.prob + fruitStats.prob) / 3;

  return { suitStats, animalStats, fruitStats, overallProb };
}

export default function BossProbabilityPage() {
  const [records, setRecords] = useState<FightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [suit, setSuit] = useState<string>("Hearts");
  const [animal, setAnimal] = useState<string>("Lion");
  const [fruit, setFruit] = useState<string>("Mango");

  useEffect(() => {
    async function loadCSV() {
      try {
        const res = await fetch("/game_history.csv");
        const text = await res.text();

        const lines = text.trim().split("\n");
        lines.shift(); // remove header line

        const parsed: FightRecord[] = lines
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            const [card, animal, fruit, won] = line.split(",");
            return {
              card: card.trim(),
              animal: animal.trim(),
              fruit: fruit.trim(),
              result: won.trim().toLowerCase() === "true",
            };
          });

        setRecords(parsed);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCSV();
  }, []);

  // Recalculate probabilities whenever records or selection changes
  const stats = useMemo(() => {
    if (!records.length) return null;
    return calculateProbabilities(records, suit, animal, fruit);
  }, [records, suit, animal, fruit]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700">
        Loading boss data...
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        No data found in boss-data.csv
      </main>
    );
  }

  const { overallProb } = stats;

  const overallPercent = (overallProb * 100).toFixed(1); 

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow">
        <p className="mb-4 text-xl font-semibold text-gray-900">
          Boss Win Probability
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Suit
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={suit}
              onChange={(e) => setSuit(e.target.value)}
            >
              {CARDS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Animal
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={animal}
              onChange={(e) => setAnimal(e.target.value)}
            >
              {ANIMALS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Fruit
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={fruit}
              onChange={(e) => setFruit(e.target.value)}
            >
              {FRUITS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Overall probability (average of the three percentages)
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {overallPercent}%
          </p>
        </div>
      </div>
    </main>
  );
}
