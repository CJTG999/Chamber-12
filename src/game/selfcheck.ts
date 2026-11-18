import { nextAction, sloppyAction } from "./ai.ts";
import { applyAction, continueDouble, continueInterstitial, createMatch, knowledgeOf, release } from "./logic.ts";
import type { Match, Rng, Side } from "./types.ts";

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function settle(m: Match): Match {
  return m.resolving ? release(m) : m;
}

function play(mode: "story" | "double" | "hotseat", seed: number, sloppy: boolean): string {
  const rng = mulberry32(seed);
  let m = createMatch(mode, rng);
  let steps = 0;
  let loadsSeen = 0;
  while (steps < 800) {
    steps += 1;
    m = settle(m);
    if (m.cashout) {
      if (m.round >= 4) return `ok cash wave ${m.round} pot ${m.cashout.pot} steps ${steps}`;
      m = continueDouble(m, rng);
      continue;
    }
    if (m.interstitial) {
      if (
        m.interstitial.kind === "story-win" ||
        m.interstitial.kind === "don-lose" ||
        m.interstitial.kind === "match-win"
      ) {
        return `ok ${m.interstitial.kind} r${m.round} steps ${steps}`;
      }
      if (m.interstitial.kind === "round-lose" && m.roundLosses > 6) {
        return `ok gave-up deaths ${m.roundLosses}`;
      }
      m = continueInterstitial(m, rng);
      continue;
    }
    if (m.passLock) {
      m = { ...m, passLock: null };
    }
    loadsSeen = Math.max(loadsSeen, m.loadCount);
    const side: Side = m.turn;
    const action = sloppy ? sloppyAction(m, side, rng) : nextAction(m, side, rng);
    const before = m.fxId;
    const turn = m.turn;
    const shells = m.shells.length;
    const items = m.actors[side].items.length;
    m = applyAction(m, side, action, rng);
    if (m.fxId === before && m.turn === turn && m.shells.length === shells && m.actors[side].items.length === items && !m.interstitial) {
      return `stall seed ${seed} mode ${mode} action ${JSON.stringify(action)} dialogue ${m.dialogue}`;
    }
    // Knowledge sanity: a revealed shell matches the tube.
    for (const s of m.shells) {
      const k = m.actors[side].known[s.id];
      if (k && k !== s.type) return `stale knowledge seed ${seed} shell ${s.id}`;
      const deduced = knowledgeOf(m.actors.player, m.shells, s);
      if (deduced && deduced !== s.type) return `bad deduction seed ${seed}`;
    }
  }
  return `timeout seed ${seed} mode ${mode} sloppy ${sloppy} round ${m.round} load ${loadsSeen} hp ${m.actors.player.hp}/${m.actors.dealer.hp}`;
}

const failures: string[] = [];
for (const mode of ["story", "double", "hotseat"] as const) {
  for (let seed = 1; seed <= 40; seed += 1) {
    const result = play(mode, seed * 17 + (mode === "story" ? 1 : mode === "double" ? 2 : 3), false);
    if (!result.startsWith("ok")) failures.push(result);
  }
}
for (let seed = 1; seed <= 25; seed += 1) {
  const result = play("story", 1000 + seed, true);
  if (!result.startsWith("ok")) failures.push(result);
  const result2 = play("double", 2000 + seed, true);
  if (!result2.startsWith("ok")) failures.push(result2);
}

if (failures.length) {
  console.error(failures.slice(0, 12).join("\n"));
  console.error(`${failures.length} failures`);
  process.exit(1);
}
console.log("selfcheck ok");
