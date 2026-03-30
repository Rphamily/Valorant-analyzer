"use client";
import { useState, useEffect } from "react";

// 🎮 AGENTS
const agentImages: any = {
  Jett: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
  Reyna: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
  Phoenix: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png",
  Sova: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png",
  Sage: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/fullportrait.png",
};

const agents = Object.keys(agentImages);

// 🏆 RANK ICONS
const rankImages: any = {
  Iron: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/3/largeicon.png",
  Bronze: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/6/largeicon.png",
  Silver: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/9/largeicon.png",
  Gold: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/12/largeicon.png",
  Platinum: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/15/largeicon.png",
  Diamond: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/18/largeicon.png",
  Ascendant: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/21/largeicon.png",
  Immortal: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/24/largeicon.png",
  Radiant: "https://media.valorant-api.com/competitivetiers/564d8e28-4b71-1a2c-7c03-6486a4c6d0cb/27/largeicon.png",
};

// 🎯 KD → RANK
const getRankFromKD = (kd: number) => {
  if (kd < 0.7) return "Iron";
  if (kd < 0.9) return "Bronze";
  if (kd < 1.0) return "Silver";
  if (kd < 1.2) return "Gold";
  if (kd < 1.4) return "Platinum";
  if (kd < 1.6) return "Diamond";
  if (kd < 1.8) return "Ascendant";
  if (kd < 2.0) return "Immortal";
  return "Radiant";
};

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  // 💾 LOAD SAVED
  useEffect(() => {
    const saved = localStorage.getItem("players");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  const randomKD = () => Number((Math.random() * 1.5 + 0.5).toFixed(2));

  const addPlayer = async () => {
    if (!name || !tag) return;
    if (players.length >= 10) return alert("Max 10 players");

    const res = await fetch(`/api/player?name=${name}&tag=${tag}`);
    const json = await res.json();

    const kd = randomKD();
    const rank = getRankFromKD(kd);
    const agent = agents[Math.floor(Math.random() * agents.length)];

    json.agent = agent;
    json.rank = rank;
    json.stats = {
      kd,
      winrate: Math.floor(kd * 40 + Math.random() * 20),
      hs: Math.floor(Math.random() * 40),
    };

    setPlayers([...players, json]);
    setName("");
    setTag("");
  };

  const bestKD = Math.max(...players.map(p => p.stats?.kd || 0));
  const worstKD = Math.min(...players.map(p => p.stats?.kd || Infinity));

  const toggleSelect = (player: any) => {
    if (selected.includes(player)) {
      setSelected(selected.filter(p => p !== player));
    } else if (selected.length < 2) {
      setSelected([...selected, player]);
    }
  };

  const getGlow = (rank: string) => {
    if (rank === "Radiant") return "animate-pulse shadow-[0_0_30px_red]";
    if (rank === "Immortal") return "shadow-[0_0_20px_purple]";
    if (rank === "Diamond") return "shadow-[0_0_15px_cyan]";
    return "";
  };

  const row1 = players.filter((_, i) => i % 2 === 0);
  const row2 = players.filter((_, i) => i % 2 === 1);

  const renderCard = (p: any, i: number) => {
    const kd = p.stats?.kd || 0;
    const isBest = kd === bestKD;
    const isWorst = kd === worstKD;

    return (
      <div
        key={i}
        onClick={() => toggleSelect(p)}
        className={`relative w-72 h-[420px] cursor-pointer border ${
          isBest
            ? "border-green-400"
            : isWorst
            ? "border-red-400"
            : "border-gray-700"
        } ${getGlow(p.rank)}`}
      >
        <img src={rankImages[p.rank]} className="absolute top-2 left-2 w-12 z-20" />

        <img
          src={agentImages[p.agent]}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 p-4 mt-auto">
          <h2>{p.name}</h2>
          <p className="text-yellow-400">{p.rank}</p>

          <p>KD: {kd}</p>
          <p>Win: {p.stats?.winrate}%</p>
          <p>HS: {p.stats?.hs}%</p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0f1923] text-white flex flex-col items-center p-10">

      <h1 className="text-5xl font-bold mb-10 text-red-500">
        VALORANT ANALYZER
      </h1>

      {/* INPUT */}
      <div className="flex gap-2 mb-10">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <span>#</span>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" />
        <button onClick={addPlayer}>Add</button>
      </div>

      {/* GRID */}
      <div className="flex gap-6 mb-6">{row1.map(renderCard)}</div>
      <div className="flex gap-6">{row2.map(renderCard)}</div>

      {/* ⚔️ VS MODE */}
      {selected.length === 2 && (
        <div className="mt-10 bg-[#1f2731] p-6 rounded text-center">
          <h2 className="text-xl mb-2">VS Comparison</h2>
          <p>{selected[0].name} vs {selected[1].name}</p>
          <p>
            Winner:{" "}
            {selected[0].stats.kd > selected[1].stats.kd
              ? selected[0].name
              : selected[1].name}
          </p>
        </div>
      )}

    </main>
  );
}