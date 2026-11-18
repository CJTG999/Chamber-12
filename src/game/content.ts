import type { ItemId, Mode, Side } from "./types.ts";

export const ITEM_ORDER: ItemId[] = [
  "glass",
  "cigs",
  "beer",
  "saw",
  "cuffs",
  "phone",
  "inverter",
  "adrenaline",
  "medicine",
];

export const STORY_POOL: ItemId[] = ["glass", "cigs", "beer", "saw", "cuffs"];

export const ALL_POOL: ItemId[] = ITEM_ORDER;

export interface ItemInfo {
  name: string;
  blurb: string;
  rule: string;
}

export const ITEMS: Record<ItemId, ItemInfo> = {
  glass: {
    name: "Magnifier",
    blurb: "See the chambered shell.",
    rule: "Shows you alone whether the shell in the chamber is live or blank. Does not end your turn.",
  },
  cigs: {
    name: "Cigarettes",
    blurb: "Restore one charge.",
    rule: "Heal one charge. You cannot rise above this round's maximum.",
  },
  beer: {
    name: "Beer",
    blurb: "Rack out the chamber.",
    rule: "Ejects the current shell without firing. Everyone sees what it was. If that empties the gun, a new load is dealt and you keep the turn.",
  },
  saw: {
    name: "Hand Saw",
    blurb: "The next pull deals two.",
    rule: "Shortens the barrel until the next trigger pull. A live shell then removes two charges — aimed either way. A blank wastes the cut. Racking a shell does not.",
  },
  cuffs: {
    name: "Handcuffs",
    blurb: "They skip their next turn.",
    rule: "The other side skips the next time the turn would pass to them. It does not stack. Shooting yourself with a blank does not spend their skipped turn.",
  },
  phone: {
    name: "Burner Phone",
    blurb: "A voice names a later shell.",
    rule: "Reveals a shell behind the chambered one. Never the current shell. If nothing is loaded behind it, the line is just static.",
  },
  inverter: {
    name: "Inverter",
    blurb: "Flip the chambered shell.",
    rule: "The shell in the chamber swaps: live becomes blank, blank becomes live. Only that shell.",
  },
  adrenaline: {
    name: "Adrenaline",
    blurb: "Steal a tool and use it now.",
    rule: "Take one item from the other side and resolve it immediately. Adrenaline cannot steal adrenaline.",
  },
  medicine: {
    name: "Expired Medicine",
    blurb: "Heal two, or lose one.",
    rule: "A coin flip. Regain two charges (capped at this round's max) or lose one. On a single charge, the bad flip kills you.",
  },
};

export function sideName(mode: Mode, side: Side, viewer?: Side): string {
  if (mode === "hotseat") return side === "player" ? "Seat A" : "Seat B";
  if (side === "player") return viewer === "dealer" ? "The Host" : "You";
  return "The Host";
}

export function otherName(mode: Mode, side: Side): string {
  return sideName(mode, side === "player" ? "dealer" : "player", side);
}
