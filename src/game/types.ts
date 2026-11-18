export type ShellType = "live" | "blank";

export type ItemId =
  | "glass"
  | "cigs"
  | "beer"
  | "saw"
  | "cuffs"
  | "phone"
  | "inverter"
  | "adrenaline"
  | "medicine";

export type Side = "player" | "dealer";

export type Mode = "story" | "double" | "hotseat";

export interface Shell {
  id: number;
  type: ShellType;
}

export interface Actor {
  hp: number;
  maxHp: number;
  items: ItemId[];
  /** Shell ids this actor has personally seen. Deduction is computed, not stored. */
  known: Record<number, ShellType>;
  cuffed: boolean;
}

export type Fx =
  | { kind: "shot"; side: Side; target: Side; shell: ShellType; damage: number }
  | { kind: "item"; side: Side; item: ItemId }
  | { kind: "eject"; side: Side; shell: ShellType }
  | { kind: "load" }
  | { kind: "heal"; side: Side }
  | { kind: "hurt"; side: Side }
  | { kind: "flip" }
  | { kind: "die"; victim: Side };

export interface Interstitial {
  kind: "round-win" | "round-lose" | "story-win" | "don-lose" | "match-win";
  title: string;
  body: string;
}

export interface Match {
  mode: Mode;
  round: number;
  /** Loads dealt this round, including the one currently in the gun. */
  loadCount: number;
  seq: number;
  shells: Shell[];
  sawed: boolean;
  turn: Side;
  actors: Record<Side, Actor>;
  scores: Record<Side, number>;
  /** Story deaths inside the current round — first attempt gets a teaching load. */
  roundLosses: number;
  wavePot: number;
  dialogue: string;
  publicLog: string[];
  fx: Fx | null;
  fxId: number;
  resolving: boolean;
  lockMs: number;
  interstitial: Interstitial | null;
  /** Set when a Double-or-Nothing wave is cleared. */
  cashout: { pot: number } | null;
  /** Hotseat: hide private knowledge until this seat confirms they have the screen. */
  passLock: Side | null;
  /** Item box stops refilling after this many loads so a round cannot heal forever. */
  readonly itemLoads: number;
}

export type Action =
  | { kind: "item"; index: number; steal?: number }
  | { kind: "shoot"; target: Side };

export type Rng = () => number;
