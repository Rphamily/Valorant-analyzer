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

// ✨ ANIMATED GLOW
const getRankGlow = (rank: string) => {
  switch (rank) {
    case "Radiant":
      return "animate-pulse shadow-[0_0_40px_rgba(255,0,0,0.9)]";
    case "Immortal":
      return "shadow-[0_0_30px_rgba(180,0,255,0.8)]";
    case "Ascendant":
      return "shadow-[0_0_25px_rgba(0,255,200,0.7)]";
    case "Diamond":
      return "shadow-[0_0_20px_rgba(0,200,255,0.7)]";
    case "Gold":
      return "shadow-[0_0_15px_rgba(255,215,0,0.7)]";
    default:
      return "";
  }
};

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");

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

    const res = await fetch(`/api/player?name=${name}&tag=${tag}`);
    const json = await res.json();

    const kd = randomKD();

    json.stats = {
      kd,
      winrate: Math.floor(kd * 40 + Math.random() * 20),
      hs: Math.floor(Math.random() * 40),
    };

    json.rank = getRankFromKD(kd);
    json.agent = agents[Math.floor(Math.random() * agents.length)];

    setPlayers([...players, json]);
    setName("");
    setTag("");
  };

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

  const bestKD = Math.max(...players.map(p => p.stats?.kd || 0));
  const worstKD = Math.min(...players.map(p => p.stats?.kd || Infinity));

  return (
    <main className="min-h-screen bg-[#0f1923] text-white p-10">

      <h1 className="text-4xl text-center mb-8 text-red-500">
        VALORANT ANALYZER
      </h1>

      {/* INPUT */}
      <div className="flex justify-center gap-3 mb-10">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <span>#</span>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" />
        <button onClick={addPlayer} className="bg-red-600 px-4">Add</button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {players.map((p, i) => {
          const kd = p.stats.kd;
          const isStrongest = kd === bestKD;
          const isWeakest = kd === worstKD;
          const isSelected = selected.includes(p);

          return (
            <div
              key={i}
              onClick={() => toggleSelect(p)}
              className={`relative h-[400px] cursor-pointer border border-gray-700 
              ${getRankGlow(p.rank)}
              ${isSelected ? "scale-105 border-blue-400" : ""}
              transition`}
            >

              {/* LABELS */}
              {isStrongest && (
                <div className="absolute top-2 right-2 bg-green-500 px-2 text-xs z-20">
                  STRONGEST
                </div>
              )}

              {isWeakest && (
                <div className="absolute top-2 right-2 bg-red-500 px-2 text-xs z-20">
                  WEAKEST
                </div>
              )}

              {/* REMOVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePlayer(p);
                }}
                className="absolute bottom-2 right-2 bg-red-600 px-2 text-xs z-20"
              >
                X
              </button>

              {/* RANK */}
              <img src={rankImages[p.rank]} className="absolute top-2 left-2 w-10 z-20" />

              {/* AGENT */}
              <img
                src={agentImages[p.agent]}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />

              <div className="absolute inset-0 bg-black/70"></div>

              {/* INFO */}
              <div className="relative z-10 p-4 mt-auto">
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-yellow-400">{p.rank}</p>

                {/* STAT BARS */}
                <div className="mt-2 text-xs">
                  <div>KD {kd}</div>
                  <div className="bg-gray-700 h-2">
                    <div className="bg-green-400 h-2" style={{ width: `${kd * 50}%` }} />
                  </div>

                  <div className="mt-1">Win {p.stats.winrate}%</div>
                  <div className="bg-gray-700 h-2">
                    <div className="bg-blue-400 h-2" style={{ width: `${p.stats.winrate}%` }} />
                  </div>

                  <div className="mt-1">HS {p.stats.hs}%</div>
                  <div className="bg-gray-700 h-2">
                    <div className="bg-purple-400 h-2" style={{ width: `${p.stats.hs}%` }} />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ⚔️ VS PANEL */}
      {selected.length === 2 && (
        <div className="mt-10 bg-[#1f2731] p-6 rounded text-center">
          <h2 className="text-xl mb-2">⚔️ VS</h2>

          <div className="flex justify-around">
            <div>{selected[0].name}</div>
            <div>VS</div>
            <div>{selected[1].name}</div>
          </div>

          <p className="mt-4 text-lg font-bold">
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