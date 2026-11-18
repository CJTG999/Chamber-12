import { ALL_POOL, STORY_POOL, sideName } from "./content.ts";
import type {
  Action,
  Actor,
  Fx,
  ItemId,
  Match,
  Mode,
  Rng,
  Shell,
  ShellType,
  Side,
} from "./types.ts";

export const STORY_CHARGES = [2, 4, 5] as const;
export const STORY_ROUNDS = 3;
export const MAX_ITEMS = 8;
const ITEM_LOADS = 3;

export function other(side: Side): Side {
  return side === "player" ? "dealer" : "player";
}

export function counts(shells: Shell[]): { live: number; blank: number } {
  let live = 0;
  let blank = 0;
  for (const s of shells) {
    if (s.type === "live") live += 1;
    else blank += 1;
  }
  return { live, blank };
}

/** Exact knowledge plus what the remaining counts force. */
export function knowledgeOf(actor: Actor, shells: Shell[], shell: Shell): ShellType | null {
  const marked = actor.known[shell.id];
  if (marked) return marked;
  let knownLive = 0;
  let knownBlank = 0;
  let unknown = 0;
  let isUnknown = false;
  for (const s of shells) {
    const k = actor.known[s.id];
    if (!k) {
      unknown += 1;
      if (s.id === shell.id) isUnknown = true;
    } else if (k === "live") knownLive += 1;
    else knownBlank += 1;
  }
  if (!isUnknown) return null;
  const { live, blank } = counts(shells);
  if (live - knownLive <= 0) return "blank";
  if (blank - knownBlank <= 0) return "live";
  if (unknown <= 0) return null;
  return null;
}

export function proof(actor: Actor, shells: Shell[]): (ShellType | null)[] {
  return shells.map((s) => knowledgeOf(actor, shells, s));
}

function actor(): Actor {
  return { hp: 0, maxHp: 0, items: [], known: {}, cuffed: false };
}

function freshMatch(mode: Mode): Match {
  return {
    mode,
    round: 1,
    loadCount: 0,
    seq: 1,
    shells: [],
    sawed: false,
    turn: "player",
    actors: { player: actor(), dealer: actor() },
    scores: { player: 0, dealer: 0 },
    roundLosses: 0,
    wavePot: mode === "double" ? 2500 : 0,
    dialogue: "",
    publicLog: [],
    fx: null,
    fxId: 0,
    resolving: true,
    lockMs: 900,
    interstitial: null,
    cashout: null,
    passLock: null,
    itemLoads: ITEM_LOADS,
  };
}

function say(m: Match, line: string) {
  m.dialogue = line;
  m.publicLog = [...m.publicLog, line].slice(-6);
}

function stamp(m: Match, fx: Fx, lockMs: number) {
  m.fx = fx;
  m.fxId += 1;
  m.resolving = lockMs > 0;
  m.lockMs = lockMs;
}

function ri(rng: Rng, a: number, b: number): number {
  return a + Math.floor(rng() * (b - a + 1));
}

function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function chargesFor(mode: Mode, round: number, rng: Rng): number {
  if (mode === "story" || mode === "hotseat") return STORY_CHARGES[round - 1] ?? 5;
  const floor = Math.min(4, 2 + Math.floor((round - 1) / 2));
  const ceil = Math.min(6, floor + 2);
  return ri(rng, floor, ceil);
}

function poolFor(mode: Mode): ItemId[] {
  return mode === "story" ? STORY_POOL : ALL_POOL;
}

function batchSize(m: Match, rng: Rng): number {
  if (m.loadCount > m.itemLoads) return 0;
  if (m.mode === "story") {
    if (m.round <= 1) return 0;
    if (m.round === 2) return 2;
    return 4;
  }
  if (m.mode === "hotseat") {
    if (m.round <= 1) return 2;
    return 4;
  }
  return ri(rng, 2, 4);
}

function drawItems(pool: ItemId[], n: number, rng: Rng): ItemId[] {
  if (n <= 0) return [];
  const bag = [...pool, ...pool];
  const out: ItemId[] = [];
  for (let i = 0; i < n && i < bag.length; i += 1) {
    const j = i + Math.floor(rng() * (bag.length - i));
    const tmp = bag[i]!;
    bag[i] = bag[j]!;
    bag[j] = tmp;
    out.push(bag[i]!);
  }
  return out;
}

function give(a: Actor, items: ItemId[]) {
  const space = MAX_ITEMS - a.items.length;
  if (space <= 0) return;
  a.items.push(...items.slice(0, space));
}

function makeShells(m: Match, rng: Rng): Shell[] {
  const teaching =
    m.mode === "story" && m.round === 1 && m.loadCount === 1 && m.roundLosses === 0;
  let live: number;
  let blank: number;
  if (teaching) {
    live = 2;
    blank = 2;
  } else {
    const span = m.mode === "story" && m.round === 1 ? [2, 5] : m.round === 2 ? [3, 6] : [4, 8];
    const total = ri(rng, span[0]!, span[1]!);
    live = ri(rng, 1, total - 1);
    blank = total - live;
  }
  const types: ShellType[] = [
    ...Array.from({ length: live }, () => "live" as const),
    ...Array.from({ length: blank }, () => "blank" as const),
  ];
  for (let i = types.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = types[i]!;
    types[i] = types[j]!;
    types[j] = tmp;
  }
  return types.map((type) => {
    const id = m.seq;
    m.seq += 1;
    return { id, type };
  });
}

function loadGun(m: Match, rng: Rng) {
  m.loadCount += 1;
  m.shells = makeShells(m, rng);
  m.actors.player.known = {};
  m.actors.dealer.known = {};
  const n = batchSize(m, rng);
  const pool = poolFor(m.mode);
  if (n > 0) {
    give(m.actors.player, drawItems(pool, n, rng));
    give(m.actors.dealer, drawItems(pool, n, rng));
  }
  const c = counts(m.shells);
  const tools = n > 0 ? " Tools hit the felt." : m.loadCount > m.itemLoads ? " The box is empty." : "";
  say(m, `${c.live} live. ${c.blank} blank.${tools}`);
  stamp(m, { kind: "load" }, 880);
}

function beginRound(m: Match, round: number, rng: Rng) {
  m.round = round;
  m.loadCount = 0;
  m.sawed = false;
  m.shells = [];
  m.interstitial = null;
  m.cashout = null;
  m.passLock = null;
  const hp = chargesFor(m.mode, round, rng);
  for (const side of ["player", "dealer"] as const) {
    m.actors[side] = { hp, maxHp: hp, items: [], known: {}, cuffed: false };
  }
  m.turn = "player";
  const intro =
    m.mode === "double"
      ? `Wave ${round}. ${hp} charges each. The pot is $${m.wavePot.toLocaleString("en-US")}.`
      : round === 1
        ? `${hp} charges. No mercy, and ${m.mode === "story" ? "no tools yet" : "a thin handful of tools"}.`
        : round === 2
          ? `${hp} charges. The box opens.`
          : `${hp} charges. Last round. When the lamps die, so do you.`;
  loadGun(m, rng);
  // loadGun overwrites dialogue; keep the intro in the log and lead with counts which matter more,
  // but prefix the round line.
  m.publicLog = [intro, ...m.publicLog].slice(-6);
  m.dialogue = `${intro} ${m.dialogue}`;
}

export function createMatch(mode: Mode, rng: Rng): Match {
  const m = freshMatch(mode);
  beginRound(m, 1, rng);
  return m;
}

function notePass(m: Match) {
  if (m.mode !== "hotseat") return;
  if (!m.interstitial && !m.cashout) m.passLock = m.turn;
}

export function ackPass(m: Match): Match {
  if (!m.passLock) return m;
  const next: Match = { ...m, actors: m.actors, passLock: null };
  return next;
}

function die(m: Match, victim: Side): Match {
  const winner = other(victim);
  if (m.mode === "story" && victim === "player") {
    m.roundLosses += 1;
    m.interstitial = {
      kind: "round-lose",
      title: "Flatlined",
      body: "The last lamp on your rail goes black. He lights a cigarette off the barrel and waits for you to sit again.",
    };
    return m;
  }
  if (m.mode === "story" && victim === "dealer") {
    if (m.round >= STORY_ROUNDS) {
      m.interstitial = {
        kind: "story-win",
        title: "The host is down",
        body: "Three rounds. The wires on his side stay dark. Walk out — or swallow what he left on the felt and double until you don't.",
      };
    } else {
      m.interstitial = {
        kind: "round-win",
        title: `Round ${m.round} breaks`,
        body: "He jerks once and the lamps take him back. The next round will not be this kind.",
      };
    }
    return m;
  }
  if (m.mode === "double" && victim === "dealer") {
    m.cashout = { pot: m.wavePot };
    say(m, "He drops. The pot sits in the light. Take it, or let it double.");
    return m;
  }
  if (m.mode === "double" && victim === "player") {
    m.interstitial = {
      kind: "don-lose",
      title: "Nothing walks out",
      body: `The pot of $${m.wavePot.toLocaleString("en-US")} stays on his side of the table.`,
    };
    return m;
  }
  m.scores[winner] += 1;
  const a = m.scores.player;
  const b = m.scores.dealer;
  if (m.scores[winner] >= 2 || m.round >= STORY_ROUNDS) {
    m.interstitial = {
      kind: "match-win",
      title: `${sideName("hotseat", winner)} takes the table`,
      body: `Rounds ${a}–${b}. The gun cools.`,
    };
  } else {
    m.interstitial = {
      kind: "round-win",
      title: `${sideName("hotseat", winner)} takes the round`,
      body: `The board reads ${a}–${b}. Next round raises the charges.`,
    };
  }
  return m;
}

export function continueInterstitial(m: Match, rng: Rng): Match {
  if (!m.interstitial) return m;
  if (m.interstitial.kind === "round-lose" && m.mode === "story") {
    const next = structuredClone(m);
    next.interstitial = null;
    beginRound(next, next.round, rng);
    return next;
  }
  if (m.interstitial.kind === "round-win") {
    const next = structuredClone(m);
    next.interstitial = null;
    beginRound(next, next.round + 1, rng);
    return next;
  }
  return m;
}

export function continueDouble(m: Match, rng: Rng): Match {
  if (!m.cashout) return m;
  const next = structuredClone(m);
  next.wavePot *= 2;
  next.cashout = null;
  beginRound(next, next.round + 1, rng);
  return next;
}

function busy(m: Match): string | null {
  if (m.interstitial) return "Wait.";
  if (m.cashout) return "The pot is waiting.";
  if (m.passLock) return "Pass the gun first.";
  if (m.resolving) return "The gun is still moving.";
  if (m.shells.length === 0) return "The gun is empty.";
  return null;
}

export function rejectReason(m: Match, side: Side, action: Action): string | null {
  const gate = busy(m);
  if (gate) return gate;
  if (m.turn !== side) return "Not your pull.";
  if (action.kind === "shoot") {
    if (action.target !== side && action.target !== other(side)) return "Aim somewhere.";
    return null;
  }
  const item = m.actors[side].items[action.index];
  if (!item) return "Empty slot.";
  const foe = other(side);
  switch (item) {
    case "cigs":
      if (m.actors[side].hp >= m.actors[side].maxHp) return "Charges are already full.";
      return null;
    case "medicine":
      if (m.actors[side].hp <= 0) return "Too late.";
      return null;
    case "glass":
    case "beer":
    case "inverter":
      if (m.shells.length === 0) return "Nothing chambered.";
      return null;
    case "phone":
      return null;
    case "saw":
      if (m.sawed) return "The barrel is already short.";
      return null;
    case "cuffs":
      if (m.actors[foe].cuffed) return "Already cuffed.";
      return null;
    case "adrenaline": {
      if (action.steal === undefined) {
        const any = m.actors[foe].items.some((it) => it !== "adrenaline");
        if (!any) return "They have nothing you can take.";
        return "Choose one of their tools.";
      }
      const stolen = m.actors[foe].items[action.steal];
      if (!stolen) return "That slot is empty.";
      if (stolen === "adrenaline") return "Adrenaline cannot steal adrenaline.";
      return rejectStolen(m, side, stolen);
    }
    default:
      return "Unknown tool.";
  }
}

function rejectStolen(m: Match, side: Side, item: ItemId): string | null {
  if (item === "cigs" && m.actors[side].hp >= m.actors[side].maxHp) return "Their cigarettes would do nothing — you are full.";
  if (item === "saw" && m.sawed) return "The barrel is already short.";
  if (item === "cuffs" && m.actors[other(side)].cuffed) return "Already cuffed.";
  if ((item === "glass" || item === "beer" || item === "inverter") && m.shells.length === 0) {
    return "Nothing chambered.";
  }
  return null;
}

function passTurn(m: Match, shooter: Side, blankSelf: boolean) {
  if (blankSelf) {
    m.turn = shooter;
    return;
  }
  let next = other(shooter);
  if (m.actors[next].cuffed) {
    m.actors[next].cuffed = false;
    const line = "The cuffs crack open. That turn is gone.";
    m.publicLog = [...m.publicLog, line].slice(-6);
    m.dialogue = `${m.dialogue} ${line}`;
    next = shooter;
  }
  m.turn = next;
  if (next !== shooter) notePass(m);
}

function damageOf(m: Match, shell: ShellType): number {
  if (shell !== "live") return 0;
  return m.sawed ? 2 : 1;
}

export function applyAction(m: Match, side: Side, action: Action, rng: Rng): Match {
  const reason = rejectReason(m, side, action);
  if (reason) return m;
  const next = structuredClone(m);
  if (action.kind === "shoot") {
    return shoot(next, side, action.target, rng);
  }
  return useItem(next, side, action.index, rng, action.steal);
}

function shoot(m: Match, side: Side, target: Side, rng: Rng): Match {
  const shell = m.shells.shift();
  if (!shell) return m;
  const damage = damageOf(m, shell.type);
  const sawed = m.sawed;
  m.sawed = false;
  if (damage > 0) {
    m.actors[target].hp = Math.max(0, m.actors[target].hp - damage);
  }
  const who = sideName(m.mode, target, side);
  const self = target === side;
  const mine = m.mode === "hotseat" || side === "player";
  if (shell.type === "blank" && self) {
    say(m, mine ? "Blank, under your own chin. The turn stays." : "Blank. He aimed at himself and earned another pull.");
  } else if (shell.type === "blank") {
    say(m, `Blank. ${who} doesn't even flinch.`);
  } else if (self) {
    say(
      m,
      mine
        ? sawed
          ? "Live. Sawed. Two of your own charges blow out."
          : "Live, into yourself. A charge burns."
        : sawed
          ? "Live. He sawed the barrel and took two of his own."
          : "Live. The host eats a charge.",
    );
  } else {
    say(m, sawed ? `Live. Sawed barrel. ${who} loses two.` : `Live. ${who} loses a charge.`);
  }
  stamp(m, { kind: "shot", side, target, shell: shell.type, damage }, shell.type === "live" ? 640 : 460);
  if (m.actors[target].hp <= 0) return die(m, target);
  const previous = side;
  if (m.shells.length === 0) {
    loadGun(m, rng);
    // loadGun set its own lock; keep the longer of the two so the shot reads.
    m.lockMs = Math.max(m.lockMs, 640);
  }
  passTurn(m, previous, shell.type === "blank" && self);
  return m;
}

function useItem(m: Match, side: Side, index: number, rng: Rng, steal?: number): Match {
  const item = m.actors[side].items[index];
  if (!item) return m;
  m.actors[side].items.splice(index, 1);
  return resolveItem(m, side, item, rng, steal, true);
}

function resolveItem(
  m: Match,
  side: Side,
  item: ItemId,
  rng: Rng,
  steal: number | undefined,
  fromHand: boolean,
): Match {
  const foe = other(side);
  const me = m.actors[side];
  const lock = fromHand ? 420 : 360;
  if (item === "adrenaline") {
    const stolen = m.actors[foe].items[steal ?? -1];
    if (!stolen || stolen === "adrenaline") return m;
    m.actors[foe].items.splice(steal ?? 0, 1);
    say(m, `${sideName(m.mode, side)} slams adrenaline and takes ${label(stolen)}.`);
    stamp(m, { kind: "item", side, item }, lock);
    return resolveItem(m, side, stolen, rng, undefined, false);
  }
  switch (item) {
    case "cigs": {
      me.hp = Math.min(me.maxHp, me.hp + 1);
      say(m, `${sideName(m.mode, side)} smokes. One charge crawls back.`);
      stamp(m, { kind: "heal", side }, lock);
      stamp(m, { kind: "item", side, item }, lock);
      return m;
    }
    case "medicine": {
      const good = rng() < 0.5;
      if (good) me.hp = Math.min(me.maxHp, me.hp + 2);
      else me.hp -= 1;
      if (good) {
        say(m, `${sideName(m.mode, side)} swallows the pills. Two charges slam back.`);
        stamp(m, { kind: "heal", side }, lock);
      } else {
        say(m, `${sideName(m.mode, side)} gags on the pills and loses a charge.`);
        stamp(m, { kind: "hurt", side }, 520);
      }
      stamp(m, { kind: "item", side, item }, m.lockMs);
      if (me.hp <= 0) return die(m, side);
      return m;
    }
    case "glass": {
      const s = m.shells[0];
      if (!s) return m;
      me.known[s.id] = s.type;
      say(m, `${sideName(m.mode, side)} lifts the magnifier.`);
      stamp(m, { kind: "item", side, item }, lock);
      return m;
    }
    case "phone": {
      const future = m.shells
        .map((s, i) => ({ s, i }))
        .filter(({ s, i }) => i > 0 && !me.known[s.id]);
      const pool = future.length > 0 ? future : m.shells.map((s, i) => ({ s, i })).filter(({ i }) => i > 0);
      if (pool.length === 0) {
        say(m, "The burner spits static. Nothing is loaded behind this shell.");
      } else {
        const chosen = pick(rng, pool);
        me.known[chosen.s.id] = chosen.s.type;
        say(m, `${sideName(m.mode, side)} holds a burner to one ear.`);
      }
      stamp(m, { kind: "item", side, item }, lock);
      return m;
    }
    case "beer": {
      const s = m.shells.shift();
      if (!s) return m;
      say(m, `${sideName(m.mode, side)} racks one out. ${s.type === "live" ? "Live" : "Blank"}.`);
      stamp(m, { kind: "eject", side, shell: s.type }, 480);
      if (m.shells.length === 0) loadGun(m, rng);
      return m;
    }
    case "saw": {
      m.sawed = true;
      say(m, "The saw chews the barrel short. The next live shell takes two.");
      stamp(m, { kind: "item", side, item }, lock);
      return m;
    }
    case "cuffs": {
      m.actors[foe].cuffed = true;
      say(m, `${sideName(m.mode, foe)} is cuffed. Their next turn never arrives.`);
      stamp(m, { kind: "item", side, item }, lock);
      return m;
    }
    case "inverter": {
      const s = m.shells[0];
      if (!s) return m;
      s.type = s.type === "live" ? "blank" : "live";
      for (const sd of ["player", "dealer"] as const) {
        if (m.actors[sd].known[s.id]) m.actors[sd].known[s.id] = s.type;
      }
      say(m, "The inverter kicks. Whatever was chambered is the other thing.");
      stamp(m, { kind: "flip" }, lock);
      return m;
    }
    default:
      return m;
  }
}

function label(id: ItemId): string {
  switch (id) {
    case "glass":
      return "the magnifier";
    case "cigs":
      return "the cigarettes";
    case "beer":
      return "the beer";
    case "saw":
      return "the saw";
    case "cuffs":
      return "the handcuffs";
    case "phone":
      return "the burner";
    case "inverter":
      return "the inverter";
    case "medicine":
      return "the expired medicine";
    case "adrenaline":
      return "the adrenaline";
    default:
      return "a tool";
  }
}

export function release(m: Match): Match {
  if (!m.resolving) return m;
  return { ...m, resolving: false };
}

/** Legal item indexes for enabling the tray. */
export function itemReasons(m: Match, side: Side): (string | null)[] {
  return m.actors[side].items.map((_, index) => rejectReason(m, side, { kind: "item", index }));
}
