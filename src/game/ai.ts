import { counts, knowledgeOf, other, rejectReason } from "./logic.ts";
import type { Action, ItemId, Match, Rng, Side } from "./types.ts";

function findItem(items: ItemId[], id: ItemId): number {
  return items.findIndex((item) => item === id);
}

/**
 * One legal action for the host. The caller loops until a shot (or death).
 * The host never reads shell polarity except through its own knowledge.
 */
export function nextAction(match: Match, side: Side, rng: Rng): Action {
  const foeSide = other(side);
  const me = match.actors[side];
  const foe = match.actors[foeSide];
  const shells = match.shells;
  const cur = shells[0];
  const know = cur ? knowledgeOf(me, shells, cur) : null;
  const { live, blank } = counts(shells);
  const total = live + blank;

  const tryItem = (index: number, steal?: number): Action | null => {
    if (index < 0) return null;
    const action: Action = steal === undefined ? { kind: "item", index } : { kind: "item", index, steal };
    if (rejectReason(match, side, action)) return null;
    return action;
  };

  const cigs = tryItem(findItem(me.items, "cigs"));
  if (cigs && me.hp < me.maxHp) return cigs;

  const med = tryItem(findItem(me.items, "medicine"));
  if (med && me.hp >= 2 && me.hp <= me.maxHp - 2) return med;

  const glass = tryItem(findItem(me.items, "glass"));
  if (glass && know === null && total > 0) return glass;

  const phone = tryItem(findItem(me.items, "phone"));
  if (phone && shells.length > 1 && shells.slice(1).some((s) => knowledgeOf(me, shells, s) === null)) {
    return phone;
  }

  const adrenaline = findItem(me.items, "adrenaline");
  if (adrenaline >= 0) {
    const steal = bestSteal(match, side, know, live, blank);
    const action = tryItem(adrenaline, steal ?? undefined);
    if (action && steal !== null) return action;
  }

  const shoot = (target: Side): Action => ({ kind: "shoot", target });

  if (!cur) return shoot(foeSide);

  if (know === "blank") {
    const reach = match.sawed || findItem(me.items, "saw") >= 0 ? 2 : 1;
    if (foe.hp <= reach && (foe.hp <= 1 || match.sawed || findItem(me.items, "saw") >= 0)) {
      const inv = tryItem(findItem(me.items, "inverter"));
      if (inv) return inv;
    }
    return shoot(side);
  }

  const attacking = know === "live" || (know === null && live >= blank);
  if (attacking) {
    const confident = know === "live" || (total > 0 && live > blank);
    if (confident && foe.hp >= 2) {
      const saw = tryItem(findItem(me.items, "saw"));
      if (saw && !match.sawed) return saw;
    }
    const dmg = match.sawed ? 2 : 1;
    if (foe.hp > dmg) {
      const cuffs = tryItem(findItem(me.items, "cuffs"));
      if (cuffs && !foe.cuffed) return cuffs;
    }
    return shoot(foeSide);
  }

  if (shells.length > 1 && blank > live) {
    const beer = tryItem(findItem(me.items, "beer"));
    if (beer) return beer;
  }
  return shoot(side);
}

function bestSteal(
  match: Match,
  side: Side,
  know: "live" | "blank" | null,
  live: number,
  blank: number,
): number | null {
  const me = match.actors[side];
  const foe = match.actors[other(side)];
  let best = -1;
  let scoreBest = 0;
  foe.items.forEach((item, index) => {
    if (item === "adrenaline") return;
    let score = 0;
    if (item === "glass" && know === null) score = 80;
    if (item === "saw" && !match.sawed && foe.hp >= 2 && (know === "live" || live > blank)) score = 92;
    if (item === "inverter" && know === "blank" && foe.hp <= (match.sawed ? 2 : 1)) score = 96;
    if (item === "cuffs" && !foe.cuffed && know === "live" && foe.hp > (match.sawed ? 2 : 1)) score = 70;
    if (item === "cigs" && me.hp < me.maxHp && me.hp <= 2) score = 88;
    if (item === "beer" && know === null && blank > live) score = 55;
    if (item === "medicine" && me.hp >= 2 && me.hp <= me.maxHp - 2) score = 48;
    if (item === "phone" && match.shells.length > 2) score = 40;
    if (score > scoreBest) {
      scoreBest = score;
      best = index;
    }
  });
  return scoreBest >= 40 ? best : null;
}

/** Used by the self-check. Slightly noisy so games don't mirror forever. */
export function sloppyAction(match: Match, side: Side, rng: Rng): Action {
  if (rng() < 0.22) {
    const items = match.actors[side].items;
    const order = items.map((_, index) => index).sort(() => rng() - 0.5);
    for (const index of order) {
      const item = items[index];
      if (!item) continue;
      if (item === "adrenaline") {
        const steal = match.actors[other(side)].items.findIndex((it) => it !== "adrenaline");
        if (steal < 0) continue;
        const action: Action = { kind: "item", index, steal };
        if (!rejectReason(match, side, action)) return action;
        continue;
      }
      const action: Action = { kind: "item", index };
      if (!rejectReason(match, side, action)) return action;
    }
  }
  const target: Side = rng() < 0.62 ? other(side) : side;
  return { kind: "shoot", target };
}
