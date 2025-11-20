"use client";

import { useEffect, useMemo, useState } from "react";

type FightRecord = {
  suit: string;
  animal: string;
  fruit: string;
  won: boolean;
};

const SUITS = ["Diamonds", "Hearts", "Spades", "Clubs", "Joker"];
const ANIMALS = ["Lion", "Fox", "Parrot", "Seal", "Snake"];
const FRUITS = ["Apple", "Bananas", "Mango", "Watermelon", "Papaya"];

function buildModel(records: FightRecord[]) {
  const model = {
    total: records.length,
    wins: 0,
    losses: 0,
    winSuit: {} as Record<string, number>,
    loseSuit: {} as Record<string, number>,
    winAnimal: {} as Record<string, number>,
    loseAnimal: {} as Record<string, number>,
    winFruit: {} as Record<string, number>,
    loseFruit: {} as Record<string, number>,
  };

  for (const r of records) {
    const targetWin = r.won;
    if (targetWin) model.wins++;
    else model.losses++;

    const suitMap = targetWin ? model.winSuit : model.loseSuit;
    const animalMap = targetWin ? model.winAnimal : model.loseAnimal;
    const fruitMap = targetWin ? model.winFruit : model.loseFruit;

    suitMap[r.suit] = (suitMap[r.suit] || 0) + 1;
    animalMap[r.animal] = (animalMap[r.animal] || 0) + 1;
    fruitMap[r.fruit] = (fruitMap[r.fruit] || 0) + 1;
  }

  return model;
}

// Compute probabilityToBeatBoss(suit, animal, fruit)
function probabilityToBeatBoss(
  model: ReturnType<typeof buildModel>,
  suit: string,
  animal: string,
  fruit: string
): number {
  const { total, wins, losses } = model;

  if (total === 0) return 0.5;

  const pWin = wins / total;
  const pLose = losses / total;

  const suitWin = (model.winSuit[suit] || 0) / (wins * SUITS.length);
  const suitLose = (model.loseSuit[suit] || 0) / (losses * SUITS.length);

  const animalWin = (model.winAnimal[animal] || 0) / (wins * ANIMALS.length);
  const animalLose =
    (model.loseAnimal[animal] || 0) / (losses * ANIMALS.length);

  const fruitWin = (model.winFruit[fruit] || 0) / (wins * FRUITS.length);
  const fruitLose = (model.loseFruit[fruit] || 0) / (losses * FRUITS.length);

  const scoreWin = pWin * suitWin * animalWin * fruitWin;
  const scoreLose = pLose * suitLose * animalLose * fruitLose;

  if (scoreWin + scoreLose === 0) return 0.5;

  return scoreWin / (scoreWin + scoreLose);
}

export default function BossPage() {
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
            const [suit, animal, fruit, won] = line.split(",");
            return {
              suit: suit.trim(),
              animal: animal.trim(),
              fruit: fruit.trim(),
              won: won.trim().toLowerCase() === "true",
            };
          });

        setRecords(parsed);
      } catch (e) {
        console.error("Error loading CSV", e);
      } finally {
        setLoading(false);
      }
    }

    loadCSV();
  }, []);

  const model = useMemo(
    () => (records.length ? buildModel(records) : null),
    [records]
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700">
        Loading fight data...
      </main>
    );
  }

  if (!model) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        No data found in boss-data.csv
      </main>
    );
  }

  const probability = probabilityToBeatBoss(model, suit, animal, fruit);
  const percent = (probability * 100).toFixed(2);

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <p className="mb-4 text-xl font-semibold text-gray-900">
          Boss Win Probability
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Suit
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={suit}
              onChange={(e) => setSuit(e.target.value)}
            >
              {SUITS.map((s) => (
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
            probabilityToBeatBoss("{suit}", "{animal}", "{fruit}")
          </p>
          <p className="text-3xl font-bold text-emerald-600">{percent}%</p>
        </div>
      </div>
    </main>
  );
}
