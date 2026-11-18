import {
  ArrowLeftRight,
  Axe,
  Beer,
  Cigarette,
  Link2,
  Phone,
  Pill,
  Search,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { ITEMS, otherName, sideName } from "@/game/content";
import { counts, itemReasons, other, proof, rejectReason } from "@/game/logic";
import { useGame } from "@/game/store";
import type { ItemId, Match, Side } from "@/game/types";

const ICONS: Record<ItemId, LucideIcon> = {
  glass: Search,
  cigs: Cigarette,
  beer: Beer,
  saw: Axe,
  cuffs: Link2,
  phone: Phone,
  inverter: ArrowLeftRight,
  adrenaline: Syringe,
  medicine: Pill,
};

function viewerOf(match: Match): Side {
  if (match.mode !== "hotseat") return "player";
  return match.passLock ?? match.turn;
}

export function Chrome() {
  const match = useGame((s) => s.match);
  const screen = useGame((s) => s.screen);
  if (match?.passLock) return <PassCover match={match} />;
  if (match?.interstitial && !match.resolving) return <EndCard />;
  if (match?.cashout && !match.resolving) return <CashCard />;
  if (!match && screen === "rules") return <Rules />;
  if (!match) return <Title />;
  return <TableHud match={match} />;
}

function Title() {
  const start = useGame((s) => s.start);
  const openRules = useGame((s) => s.openRules);
  const unlocked = useGame((s) => s.unlockedDon);
  const best = useGame((s) => s.bestPot);
  const walked = useGame((s) => s.walked);
  const falls = useGame((s) => s.falls);
  const volume = useGame((s) => s.volume);
  const muted = useGame((s) => s.muted);
  const fast = useGame((s) => s.fast);
  const setVolume = useGame((s) => s.setVolume);
  const toggleMute = useGame((s) => s.toggleMute);
  const toggleFast = useGame((s) => s.toggleFast);

  return (
    <section className="panel title-panel">
      <p className="eyebrow">Offline · one gun · no account</p>
      <h1>
        Chamber
        <span>Twelve</span>
      </h1>
      <p className="lede">
        A shotgun on the felt. Live shells and blanks, in an order you are not allowed to see.
        The host across the table plays for blood.
      </p>
      <div className="menu-actions">
        <button type="button" className="btn btn-blood" onClick={() => start("story")}>
          Face the host
          <small>Three rounds. 2, then 4, then 5 charges.</small>
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!unlocked}
          onClick={() => start("double")}
        >
          Swallow the pills
          <small>{unlocked ? "Endless. The pot doubles — or you leave with nothing." : "Win the three rounds to unlock."}</small>
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => start("hotseat")}>
          Pass the gun
          <small>Two people, one screen. Notes stay private.</small>
        </button>
        <button type="button" className="btn btn-text" onClick={openRules}>
          Table rules
        </button>
      </div>
      <dl className="stats">
        <div>
          <dt>Walked out</dt>
          <dd>{walked}</dd>
        </div>
        <div>
          <dt>Best pot</dt>
          <dd>{best > 0 ? `$${best.toLocaleString("en-US")}` : "—"}</dd>
        </div>
        <div>
          <dt>Flatlines</dt>
          <dd>{falls}</dd>
        </div>
      </dl>
      <div className="prefs">
        <label>
          Room tone
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
        <button type="button" className="btn btn-text" onClick={toggleMute}>
          {muted ? "Sound off" : "Sound on"}
        </button>
        <button type="button" className="btn btn-text" onClick={toggleFast}>
          {fast ? "Pace: snap" : "Pace: slow"}
        </button>
      </div>
    </section>
  );
}

function Rules() {
  const closeRules = useGame((s) => s.closeRules);
  return (
    <section className="panel rules-panel">
      <p className="eyebrow">How the table works</p>
      <h2>Rules</h2>
      <div className="rules-body">
        <p>
          Every load shows the counts — how many live, how many blank — then hides the order.
          On your turn, use any number of tools, then pull the trigger at the other side or at yourself.
        </p>
        <ul>
          <li>A live shell removes charges. One, or two if the barrel is sawed.</li>
          <li>Shooting the other side always ends your turn, live or blank.</li>
          <li>A blank into yourself does nothing and you pull again. A live one wounds you and the turn passes.</li>
          <li>Handcuffs skip their next turn. They do not stack. Your free blank pull does not spend that skip.</li>
          <li>Empty gun: a new load, new counts. Tools are dealt on the first three loads of a round, eight slots max. After that, shells only.</li>
          <li>Story: round one has no tools and 2 charges. Round two deals 2 tools and 4 charges. Round three deals 4 tools and 5 charges. Dying restarts that round.</li>
          <li>Pills: random charges, every tool in the box, a pot that doubles. Cash out between waves. Die and the pot stays.</li>
          <li>Pass the gun: same charges, tools from the first round, full box. First to win two rounds, or whoever leads after three.</li>
        </ul>
        <h3>Tools</h3>
        <ul className="tool-rules">
          {(Object.keys(ITEMS) as ItemId[]).map((id) => {
            const Icon = ICONS[id];
            const info = ITEMS[id];
            return (
              <li key={id}>
                <Icon aria-hidden />
                <span>
                  <strong>{info.name}.</strong> {info.rule}
                  {id === "phone" || id === "inverter" || id === "adrenaline" || id === "medicine"
                    ? " Enters with the pills, and in pass-the-gun."
                    : " On the table from round two."}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="keys">
          Keys: F or up shoots them, R or down shoots you, 1–8 use a tool. Everything here runs in the browser.
          Nothing is stored anywhere but this device.
        </p>
      </div>
      <button type="button" className="btn btn-blood" onClick={closeRules}>
        Back
      </button>
    </section>
  );
}

function TableHud({ match }: { match: Match }) {
  const act = useGame((s) => s.act);
  const armSteal = useGame((s) => s.armSteal);
  const arm = useGame((s) => s.arm);
  const leave = useGame((s) => s.leave);
  const releaseLock = useGame((s) => s.releaseLock);
  const viewer = viewerOf(match);
  const foe = other(viewer);
  const me = match.actors[viewer];
  const them = match.actors[foe];
  const mine = counts(match.shells);
  const known = proof(me, match.shells);
  const reasons = itemReasons(match, match.turn);
  const myTurn =
    match.mode === "hotseat" ? match.turn === viewer : match.turn === "player" && viewer === "player";
  const playable = myTurn && !match.resolving && !match.interstitial && !match.cashout;
  const shootThem = playable ? rejectReason(match, match.turn, { kind: "shoot", target: foe }) : "Wait.";
  const shootMe = playable ? rejectReason(match, match.turn, { kind: "shoot", target: viewer }) : "Wait.";

  const useSlot = (index: number) => {
    const item = me.items[index];
    if (!item || !playable) return;
    if (item === "adrenaline") {
      arm(armSteal === index ? null : index);
      return;
    }
    act({ kind: "item", index });
  };

  return (
    <div className="hud">
      <header className="topbar">
        <button type="button" className="btn btn-text" onClick={leave}>
          Leave
        </button>
        <div className="counts" aria-live="polite">
          <span className="count-live">{mine.live} live</span>
          <span className="count-blank">{mine.blank} blank</span>
        </div>
        <p className="round-tag">
          {match.mode === "double"
            ? `Wave ${match.round} · $${match.wavePot.toLocaleString("en-US")}`
            : match.mode === "hotseat"
              ? `Round ${match.round} · ${match.scores.player}–${match.scores.dealer}`
              : `Round ${match.round} of 3`}
        </p>
      </header>

      <div className="status-row">
        {match.sawed ? <span className="chip chip-hot">Sawed · next live deals 2</span> : null}
        {them.cuffed ? <span className="chip">Cuffed · their next turn skips</span> : null}
        {me.cuffed ? <span className="chip">You are cuffed</span> : null}
        {!playable && match.mode !== "hotseat" && match.turn === "dealer" ? (
          <span className="chip">The host is moving</span>
        ) : null}
      </div>

      <div className="dock">
        <p className="dialogue" aria-live="polite">
          {match.dialogue}
        </p>
        {match.resolving ? (
          <button type="button" className="btn btn-text hurry" onClick={releaseLock}>
            Hurry
          </button>
        ) : null}

        <div className="rails">
          <ChargeRail label={sideName(match.mode, viewer, viewer)} hp={me.hp} max={me.maxHp} />
          <ChargeRail label={sideName(match.mode, foe, viewer)} hp={them.hp} max={them.maxHp} />
        </div>

        <div className="pips" aria-label="Shells you can prove">
          <span className="pip-label">What you can prove</span>
          {match.shells.map((shell, index) => {
            const k = known[index];
            return (
              <span key={shell.id} className={k === "live" ? "pip pip-live" : k === "blank" ? "pip pip-blank" : "pip"}>
                {index === 0 ? "Now" : index + 1}
                <small>{k === "live" ? "Live" : k === "blank" ? "Blank" : "?"}</small>
              </span>
            );
          })}
        </div>

        {armSteal !== null ? (
          <div className="steal">
            <p>Take one of {otherName(match.mode, viewer).toLowerCase()}'s tools. It resolves now.</p>
            <div className="item-row">
              {them.items.map((id, index) => {
                const Icon = ICONS[id];
                const blocked = id === "adrenaline";
                return (
                  <button
                    key={`${id}-${index}`}
                    type="button"
                    className="item-btn"
                    disabled={blocked}
                    onClick={() => act({ kind: "item", index: armSteal, steal: index })}
                  >
                    <Icon aria-hidden />
                    {ITEMS[id].name}
                  </button>
                );
              })}
              <button type="button" className="btn btn-text" onClick={() => arm(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="item-row" aria-label="Your tools">
            {me.items.length === 0 ? <p className="empty-tools">No tools in front of you.</p> : null}
            {me.items.map((id, index) => {
              const Icon = ICONS[id];
              const reason = playable ? reasons[index] : "Wait.";
              const armed = id === "adrenaline" && reason === "Choose one of their tools.";
              const disabled = !playable || (reason !== null && !armed);
              return (
                <button
                  key={`${id}-${index}`}
                  type="button"
                  className="item-btn"
                  disabled={disabled}
                  title={ITEMS[id].rule}
                  onClick={() => useSlot(index)}
                >
                  <Icon aria-hidden />
                  <span>{ITEMS[id].name}</span>
                  <small>{armed ? "Steal…" : ITEMS[id].blurb}</small>
                </button>
              );
            })}
          </div>
        )}

        {them.items.length > 0 && armSteal === null ? (
          <p className="their-tools">
            {sideName(match.mode, foe, viewer)} holds{" "}
            {them.items.map((id) => ITEMS[id].name).join(", ")}
          </p>
        ) : null}

        <div className="shots">
          <button
            type="button"
            className="btn btn-blood shot"
            disabled={shootThem !== null}
            onClick={() => act({ kind: "shoot", target: foe })}
          >
            Shoot {sideName(match.mode, foe, viewer)}
            <small>{match.mode === "story" && match.round === 1 ? "Live wounds them. Blank wastes the pull." : "Ends your turn either way."}</small>
          </button>
          <button
            type="button"
            className="btn btn-ghost shot"
            disabled={shootMe !== null}
            onClick={() => act({ kind: "shoot", target: viewer })}
          >
            Shoot yourself
            <small>{match.mode === "story" && match.round === 1 ? "A blank lets you pull again." : "Blank keeps the turn. Live hurts."}</small>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChargeRail({ label, hp, max }: { label: string; hp: number; max: number }) {
  return (
    <div className="rail">
      <span>{label}</span>
      <span className="lamps" aria-label={`${hp} of ${max} charges`}>
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={i < hp ? "lamp on" : "lamp"} />
        ))}
      </span>
    </div>
  );
}

function PassCover({ match }: { match: Match }) {
  const acknowledge = useGame((s) => s.acknowledge);
  const who = sideName("hotseat", match.passLock ?? "player");
  return (
    <section className="panel cover-panel">
      <p className="eyebrow">Private notes are covered</p>
      <h2>Hand it to {who}</h2>
      <p className="lede">{match.dialogue}</p>
      <button type="button" className="btn btn-blood" onClick={acknowledge}>
        {who} has the gun
      </button>
    </section>
  );
}

function EndCard() {
  const match = useGame((s) => s.match);
  const proceed = useGame((s) => s.proceed);
  const leave = useGame((s) => s.leave);
  const walkAway = useGame((s) => s.walkAway);
  const swallowPills = useGame((s) => s.swallowPills);
  if (!match?.interstitial) return null;
  const card = match.interstitial;
  return (
    <section className="panel end-panel">
      <p className="eyebrow">{match.dialogue}</p>
      <h2>{card.title}</h2>
      <p className="lede">{card.body}</p>
      {card.kind === "round-win" || card.kind === "round-lose" ? (
        <button type="button" className="btn btn-blood" onClick={proceed}>
          {card.kind === "round-lose" ? "Sit again" : "Next round"}
        </button>
      ) : null}
      {card.kind === "story-win" ? (
        <div className="menu-actions">
          <button type="button" className="btn btn-ghost" onClick={walkAway}>
            Walk away
          </button>
          <button type="button" className="btn btn-blood" onClick={swallowPills}>
            Swallow the pills
            <small>Pot starts at $2,500 and doubles every wave you survive.</small>
          </button>
        </div>
      ) : null}
      {card.kind === "don-lose" || card.kind === "match-win" ? (
        <button type="button" className="btn btn-blood" onClick={leave}>
          Leave the table
        </button>
      ) : null}
    </section>
  );
}

function CashCard() {
  const match = useGame((s) => s.match);
  const cashOut = useGame((s) => s.cashOut);
  const doubleDown = useGame((s) => s.doubleDown);
  const pot = match?.cashout?.pot ?? 0;
  return (
    <section className="panel end-panel">
      <p className="eyebrow">He is down. The pot is not.</p>
      <h2>${pot.toLocaleString("en-US")}</h2>
      <p className="lede">
        Take it home, or stay. The next wave plays for ${ (pot * 2).toLocaleString("en-US") }. Die and you leave
        with nothing — this pot included.
      </p>
      <div className="menu-actions">
        <button type="button" className="btn btn-ghost" onClick={cashOut}>
          Take the money
        </button>
        <button type="button" className="btn btn-blood" onClick={doubleDown}>
          Double or nothing
        </button>
      </div>
    </section>
  );
}
