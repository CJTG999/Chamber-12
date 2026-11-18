import { create } from "zustand";
import { nextAction } from "./ai.ts";
import { cueClick, cueHeal, cueHurt, cueRack, cueShot, setAudioGain, unlockAudio } from "./audio.ts";
import {
  ackPass,
  applyAction,
  continueDouble,
  continueInterstitial,
  createMatch,
  release,
} from "./logic.ts";
import { flinchHost, kickGun, present } from "./present.ts";
import type { Action, Fx, Match, Mode } from "./types.ts";

const KEY = "chamber-twelve-v1";

interface Save {
  version: 1;
  unlockedDon: boolean;
  bestPot: number;
  walked: number;
  falls: number;
  volume: number;
  fast: boolean;
}

export interface GameStore {
  match: Match | null;
  screen: "title" | "rules";
  volume: number;
  muted: boolean;
  fast: boolean;
  unlockedDon: boolean;
  bestPot: number;
  walked: number;
  falls: number;
  /** Adrenaline slot waiting for a victim tool. */
  armSteal: number | null;
  start: (mode: Mode) => void;
  openRules: () => void;
  closeRules: () => void;
  leave: () => void;
  act: (action: Action) => void;
  arm: (index: number | null) => void;
  stepDealer: () => void;
  releaseLock: () => void;
  acknowledge: () => void;
  proceed: () => void;
  cashOut: () => void;
  doubleDown: () => void;
  swallowPills: () => void;
  walkAway: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFast: () => void;
  hydrate: () => void;
}

function readSave(): Partial<Save> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Save>;
    if (parsed.version !== 1) return {};
    return parsed;
  } catch {
    return {};
  }
}

function playFx(fx: Fx | null) {
  if (!fx) return;
  if (fx.kind === "shot") {
    cueShot(fx.shell === "live");
    kickGun(fx.target === "dealer", fx.shell === "live" ? 1 : 0.28);
    if (fx.target === "dealer" && fx.shell === "live") flinchHost(1);
    return;
  }
  if (fx.kind === "eject") {
    cueRack();
    present.pump = 1;
    present.shake = 0.12;
    return;
  }
  if (fx.kind === "load") {
    cueRack();
    return;
  }
  if (fx.kind === "heal") {
    cueHeal();
    return;
  }
  if (fx.kind === "hurt") {
    cueHurt();
    if (fx.side === "dealer") flinchHost(0.6);
    return;
  }
  if (fx.kind === "item" || fx.kind === "flip") cueClick();
}

export const useGame = create<GameStore>((set, get) => {
  const persist = () => {
    const s = get();
    const save: Save = {
      version: 1,
      unlockedDon: s.unlockedDon,
      bestPot: s.bestPot,
      walked: s.walked,
      falls: s.falls,
      volume: s.volume,
      fast: s.fast,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch {
      /* private mode */
    }
  };

  const commit = (match: Match | null) => {
    const prev = get().match;
    if (match && match.fxId !== prev?.fxId) playFx(match.fx);
    set({ match, armSteal: null, screen: match ? "title" : get().screen });
  };

  return {
    match: null,
    screen: "title",
    volume: 0.8,
    muted: false,
    fast: false,
    unlockedDon: false,
    bestPot: 0,
    walked: 0,
    falls: 0,
    armSteal: null,
    hydrate: () => {
      const save = readSave();
      set({
        unlockedDon: !!save.unlockedDon,
        bestPot: save.bestPot ?? 0,
        walked: save.walked ?? 0,
        falls: save.falls ?? 0,
        volume: save.volume ?? 0.8,
        fast: !!save.fast,
      });
      setAudioGain(save.volume ?? 0.8, get().muted);
    },
    start: (mode) => {
      unlockAudio();
      if (mode === "double" && !get().unlockedDon) return;
      commit(createMatch(mode, Math.random));
    },
    openRules: () => set({ screen: "rules" }),
    closeRules: () => set({ screen: "title" }),
    leave: () => set({ match: null, armSteal: null, screen: "title" }),
    act: (action) => {
      const m = get().match;
      if (!m) return;
      unlockAudio();
      if (m.mode !== "hotseat" && m.turn !== "player") return;
      const next = applyAction(m, m.turn, action, Math.random);
      if (next === m) return;
      commit(next);
    },
    arm: (index) => set({ armSteal: index }),
    stepDealer: () => {
      const m = get().match;
      if (!m || m.mode === "hotseat" || m.turn !== "dealer") return;
      if (m.resolving || m.interstitial || m.cashout || m.passLock) return;
      const planned = nextAction(m, "dealer", Math.random);
      let next = applyAction(m, "dealer", planned, Math.random);
      if (next === m) {
        next = applyAction(m, "dealer", { kind: "shoot", target: m.actors.player.hp > 0 ? "player" : "dealer" }, Math.random);
      }
      if (next === m) return;
      commit(next);
    },
    releaseLock: () => {
      const m = get().match;
      if (!m?.resolving) return;
      set({ match: release(m) });
    },
    acknowledge: () => {
      const m = get().match;
      if (!m) return;
      set({ match: ackPass(m) });
    },
    proceed: () => {
      const m = get().match;
      if (!m?.interstitial) return;
      if (m.interstitial.kind === "round-lose") {
        set({ falls: get().falls + 1 });
        persist();
      }
      commit(continueInterstitial(m, Math.random));
    },
    cashOut: () => {
      const pot = get().match?.cashout?.pot ?? 0;
      set({
        bestPot: Math.max(get().bestPot, pot),
        walked: get().walked + 1,
        match: null,
        armSteal: null,
        screen: "title",
      });
      persist();
    },
    doubleDown: () => {
      const m = get().match;
      if (!m?.cashout) return;
      commit(continueDouble(m, Math.random));
    },
    swallowPills: () => {
      set({ unlockedDon: true, walked: get().walked + 1 });
      persist();
      commit(createMatch("double", Math.random));
    },
    walkAway: () => {
      set({
        unlockedDon: true,
        walked: get().walked + 1,
        match: null,
        armSteal: null,
        screen: "title",
      });
      persist();
    },
    setVolume: (volume) => {
      set({ volume });
      setAudioGain(volume, get().muted);
      persist();
    },
    toggleMute: () => {
      const muted = !get().muted;
      set({ muted });
      setAudioGain(get().volume, muted);
    },
    toggleFast: () => {
      set({ fast: !get().fast });
      persist();
    },
  };
});
