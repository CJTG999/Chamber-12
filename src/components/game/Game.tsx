import { lazy, Suspense, useEffect, useState } from "react";
import { heartbeat, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { Chrome } from "./Chrome";

const Scene = lazy(() => import("./Scene"));

export function Game() {
  const hydrate = useGame((s) => s.hydrate);
  const fast = useGame((s) => s.fast);
  const [ready, setReady] = useState(false);
  const [blood, setBlood] = useState(0);

  useEffect(() => {
    hydrate();
    setReady(true);
    const down = () => unlockAudio();
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, [hydrate]);

  useEffect(() => {
    let timer = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const kick = () => {
      window.clearTimeout(timer);
      const { match, fast: snap } = useGame.getState();
      if (!match) return;
      if (match.resolving) {
        const ms = snap || reduced ? Math.min(160, match.lockMs) : match.lockMs;
        timer = window.setTimeout(() => useGame.getState().releaseLock(), ms);
        return;
      }
      if (match.mode === "hotseat" || match.turn !== "dealer") return;
      if (match.interstitial || match.cashout || match.passLock) return;
      timer = window.setTimeout(() => useGame.getState().stepDealer(), snap || reduced ? 140 : 680);
    };
    kick();
    const unsub = useGame.subscribe((state, prev) => {
      if (state.match !== prev.match || state.fast !== prev.fast) kick();
      const fx = state.match?.fx;
      const changed = state.match?.fxId !== prev.match?.fxId;
      if (changed && fx?.kind === "shot" && fx.shell === "live" && fx.target === "player") {
        setBlood(1);
      }
      if (changed && fx?.kind === "hurt" && fx.side === "player") setBlood(0.75);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [fast]);

  useEffect(() => {
    if (blood <= 0) return;
    const timer = window.setTimeout(() => setBlood(0), 420);
    return () => window.clearTimeout(timer);
  }, [blood]);

  const hp = useGame((s) => (s.match && s.match.mode !== "hotseat" ? s.match.actors.player.hp : 0));
  const playing = useGame((s) => !!s.match && !s.match.interstitial && !s.match.cashout);
  useEffect(() => {
    if (!playing || hp !== 1) return;
    const timer = window.setInterval(() => heartbeat(), 900);
    return () => window.clearInterval(timer);
  }, [playing, hp]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const { match, act, acknowledge, proceed, armSteal, arm } = useGame.getState();
      if (!match) return;
      if (match.passLock && event.key === "Enter") {
        acknowledge();
        return;
      }
      if (match.interstitial && event.key === "Enter" && (match.interstitial.kind === "round-win" || match.interstitial.kind === "round-lose")) {
        proceed();
        return;
      }
      if (match.resolving || match.passLock || match.interstitial || match.cashout) return;
      if (match.mode !== "hotseat" && match.turn !== "player") return;
      const viewer = match.mode === "hotseat" ? match.turn : "player";
      const foe = viewer === "player" ? "dealer" : "player";
      if (event.key === "f" || event.key === "F" || event.key === "ArrowUp") {
        event.preventDefault();
        act({ kind: "shoot", target: foe });
      } else if (event.key === "r" || event.key === "R" || event.key === "ArrowDown") {
        event.preventDefault();
        act({ kind: "shoot", target: viewer });
      } else if (event.key >= "1" && event.key <= "8") {
        const index = Number(event.key) - 1;
        const item = match.actors[viewer].items[index];
        if (!item) return;
        if (item === "adrenaline" && armSteal === null) arm(index);
        else act({ kind: "item", index });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="stage">
      {ready ? (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      ) : null}
      <div className="vignette" />
      <div className="grain" />
      <div className="blood-wash" style={{ opacity: blood }} />
      <Chrome />
    </main>
  );
}
