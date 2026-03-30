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

// 🏆 WORKING RANK ICONS (FIXED)
const rankImages: any = {
  Iron: "https://static.wikia.nocookie.net/valorant/images/6/6e/Iron_3_Rank.png",
  Bronze: "https://static.wikia.nocookie.net/valorant/images/0/0c/Bronze_3_Rank.png",
  Silver: "https://static.wikia.nocookie.net/valorant/images/4/49/Silver_3_Rank.png",
  Gold: "https://static.wikia.nocookie.net/valorant/images/6/65/Gold_3_Rank.png",
  Platinum: "https://static.wikia.nocookie.net/valorant/images/a/a7/Platinum_3_Rank.png",
  Diamond: "https://static.wikia.nocookie.net/valorant/images/2/2b/Diamond_3_Rank.png",
  Ascendant: "https://static.wikia.nocookie.net/valorant/images/3/3a/Ascendant_3_Rank.png",
  Immortal: "https://static.wikia.nocookie.net/valorant/images/1/1f/Immortal_3_Rank.png",
  Radiant: "https://static.wikia.nocookie.net/valorant/images/1/1e/Radiant_Rank.png",
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

  // 💾 LOAD/SAVE
  useEffect(() => {
    const saved = localStorage.getItem("players");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

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

  const removePlayer = (p: any) => {
    setPlayers(players.filter(pl => pl !== p));
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
            ? "border-green-400 shadow-[0_0_25px_rgba(0,255,0,0.6)]"
            : isWorst
            ? "border-red-400 shadow-[0_0_25px_rgba(255,0,0,0.6)]"
            : "border-gray-700"
        }`}
      >
        {/* ❌ REMOVE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removePlayer(p);
          }}
          className="absolute top-2 right-2 z-20 bg-red-600 px-2 rounded text-xs"
        >
          X
        </button>

        {/* 🏆 RANK */}
        <img
          src={rankImages[p.rank]}
          className="absolute top-2 left-2 w-12 z-20"
        />

        {/* AGENT */}
        <img
          src={agentImages[p.agent]}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 p-4 mt-auto">

          <h2 className="text-sm font-bold">{p.name}</h2>
          <p className="text-yellow-400">{p.rank}</p>

          {/* 📊 KD BAR */}
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span>KD</span>
              <span>{kd}</span>
            </div>
            <div className="bg-gray-700 h-2">
              <div
                className="bg-green-400 h-2"
                style={{ width: `${Math.min(kd * 50, 100)}%` }}
              />
            </div>
          </div>

          {/* 📊 WIN */}
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span>Win</span>
              <span>{p.stats.winrate}%</span>
            </div>
            <div className="bg-gray-700 h-2">
              <div
                className="bg-blue-400 h-2"
                style={{ width: `${p.stats.winrate}%` }}
              />
            </div>
          </div>

          {/* 📊 HS */}
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span>HS%</span>
              <span>{p.stats.hs}%</span>
            </div>
            <div className="bg-gray-700 h-2">
              <div
                className="bg-purple-400 h-2"
                style={{ width: `${p.stats.hs}%` }}
              />
            </div>
          </div>

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
      <div className="flex items-center gap-3 mb-10 bg-[#1f2731] p-4 rounded-xl border border-gray-700">

        <input
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 px-4 bg-[#0f1923] border border-gray-600 rounded-lg"
        />

        <span className="text-gray-400 text-xl font-bold">#</span>

        <input
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="p-3 px-4 bg-[#0f1923] border border-gray-600 rounded-lg w-24"
        />

        <button onClick={addPlayer} className="bg-red-600 px-6 py-3 rounded-lg">
          Add
        </button>
      </div>

      {/* GRID */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {row1.map(renderCard)}
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {row2.map(renderCard)}
      </div>

      {/* VS */}
      {selected.length === 2 && (
        <div className="mt-10 bg-[#1f2731] p-6 rounded text-center">
          <h2 className="text-xl mb-2">⚔️ VS</h2>
          <p>{selected[0].name} vs {selected[1].name}</p>

          <p className="text-lg mt-2 font-bold">
            🏆 Winner:{" "}
            {selected[0].stats.kd > selected[1].stats.kd
              ? selected[0].name
              : selected[1].name}
          </p>
        </div>
      )}

    </main>
  );
}