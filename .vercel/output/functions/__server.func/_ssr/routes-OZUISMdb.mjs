import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Phone, c as Beer, i as Pill, l as Axe, n as Syringe, o as Link2, r as Search, s as Cigarette, u as ArrowLeftRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-OZUISMdb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
/** Cosmetic impulses. The simulation never reads these. */
var present = {
	shake: 0,
	/** 1 aims at the host, -1 aims back at the camera, 0 rests. */
	aim: 0,
	pump: 0,
	flash: 0,
	hostFlinch: 0
};
function kickGun(towardHost, power) {
	present.aim = towardHost ? 1 : -1;
	present.pump = 1;
	present.shake = power;
	present.flash = power;
}
function flinchHost(power) {
	present.hostFlinch = power;
}
var ITEM_ORDER = [
	"glass",
	"cigs",
	"beer",
	"saw",
	"cuffs",
	"phone",
	"inverter",
	"adrenaline",
	"medicine"
];
var STORY_POOL = [
	"glass",
	"cigs",
	"beer",
	"saw",
	"cuffs"
];
var ALL_POOL = ITEM_ORDER;
var ITEMS = {
	glass: {
		name: "Magnifier",
		blurb: "See the chambered shell.",
		rule: "Shows you alone whether the shell in the chamber is live or blank. Does not end your turn."
	},
	cigs: {
		name: "Cigarettes",
		blurb: "Restore one charge.",
		rule: "Heal one charge. You cannot rise above this round's maximum."
	},
	beer: {
		name: "Beer",
		blurb: "Rack out the chamber.",
		rule: "Ejects the current shell without firing. Everyone sees what it was. If that empties the gun, a new load is dealt and you keep the turn."
	},
	saw: {
		name: "Hand Saw",
		blurb: "The next pull deals two.",
		rule: "Shortens the barrel until the next trigger pull. A live shell then removes two charges — aimed either way. A blank wastes the cut. Racking a shell does not."
	},
	cuffs: {
		name: "Handcuffs",
		blurb: "They skip their next turn.",
		rule: "The other side skips the next time the turn would pass to them. It does not stack. Shooting yourself with a blank does not spend their skipped turn."
	},
	phone: {
		name: "Burner Phone",
		blurb: "A voice names a later shell.",
		rule: "Reveals a shell behind the chambered one. Never the current shell. If nothing is loaded behind it, the line is just static."
	},
	inverter: {
		name: "Inverter",
		blurb: "Flip the chambered shell.",
		rule: "The shell in the chamber swaps: live becomes blank, blank becomes live. Only that shell."
	},
	adrenaline: {
		name: "Adrenaline",
		blurb: "Steal a tool and use it now.",
		rule: "Take one item from the other side and resolve it immediately. Adrenaline cannot steal adrenaline."
	},
	medicine: {
		name: "Expired Medicine",
		blurb: "Heal two, or lose one.",
		rule: "A coin flip. Regain two charges (capped at this round's max) or lose one. On a single charge, the bad flip kills you."
	}
};
function sideName(mode, side, viewer) {
	if (mode === "hotseat") return side === "player" ? "Seat A" : "Seat B";
	if (side === "player") return viewer === "dealer" ? "The Host" : "You";
	return "The Host";
}
function otherName(mode, side) {
	return sideName(mode, side === "player" ? "dealer" : "player", side);
}
var STORY_CHARGES = [
	2,
	4,
	5
];
var ITEM_LOADS = 3;
function other(side) {
	return side === "player" ? "dealer" : "player";
}
function counts(shells) {
	let live = 0;
	let blank = 0;
	for (const s of shells) if (s.type === "live") live += 1;
	else blank += 1;
	return {
		live,
		blank
	};
}
/** Exact knowledge plus what the remaining counts force. */
function knowledgeOf(actor, shells, shell) {
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
function proof(actor, shells) {
	return shells.map((s) => knowledgeOf(actor, shells, s));
}
function actor() {
	return {
		hp: 0,
		maxHp: 0,
		items: [],
		known: {},
		cuffed: false
	};
}
function freshMatch(mode) {
	return {
		mode,
		round: 1,
		loadCount: 0,
		seq: 1,
		shells: [],
		sawed: false,
		turn: "player",
		actors: {
			player: actor(),
			dealer: actor()
		},
		scores: {
			player: 0,
			dealer: 0
		},
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
		itemLoads: ITEM_LOADS
	};
}
function say(m, line) {
	m.dialogue = line;
	m.publicLog = [...m.publicLog, line].slice(-6);
}
function stamp(m, fx, lockMs) {
	m.fx = fx;
	m.fxId += 1;
	m.resolving = lockMs > 0;
	m.lockMs = lockMs;
}
function ri(rng, a, b) {
	return a + Math.floor(rng() * (b - a + 1));
}
function pick(rng, arr) {
	return arr[Math.floor(rng() * arr.length)];
}
function chargesFor(mode, round, rng) {
	if (mode === "story" || mode === "hotseat") return STORY_CHARGES[round - 1] ?? 5;
	const floor = Math.min(4, 2 + Math.floor((round - 1) / 2));
	return ri(rng, floor, Math.min(6, floor + 2));
}
function poolFor(mode) {
	return mode === "story" ? STORY_POOL : ALL_POOL;
}
function batchSize(m, rng) {
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
function drawItems(pool, n, rng) {
	if (n <= 0) return [];
	const bag = [...pool, ...pool];
	const out = [];
	for (let i = 0; i < n && i < bag.length; i += 1) {
		const j = i + Math.floor(rng() * (bag.length - i));
		const tmp = bag[i];
		bag[i] = bag[j];
		bag[j] = tmp;
		out.push(bag[i]);
	}
	return out;
}
function give(a, items) {
	const space = 8 - a.items.length;
	if (space <= 0) return;
	a.items.push(...items.slice(0, space));
}
function makeShells(m, rng) {
	const teaching = m.mode === "story" && m.round === 1 && m.loadCount === 1 && m.roundLosses === 0;
	let live;
	let blank;
	if (teaching) {
		live = 2;
		blank = 2;
	} else {
		const span = m.mode === "story" && m.round === 1 ? [2, 5] : m.round === 2 ? [3, 6] : [4, 8];
		const total = ri(rng, span[0], span[1]);
		live = ri(rng, 1, total - 1);
		blank = total - live;
	}
	const types = [...Array.from({ length: live }, () => "live"), ...Array.from({ length: blank }, () => "blank")];
	for (let i = types.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = types[i];
		types[i] = types[j];
		types[j] = tmp;
	}
	return types.map((type) => {
		const id = m.seq;
		m.seq += 1;
		return {
			id,
			type
		};
	});
}
function loadGun(m, rng) {
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
function beginRound(m, round, rng) {
	m.round = round;
	m.loadCount = 0;
	m.sawed = false;
	m.shells = [];
	m.interstitial = null;
	m.cashout = null;
	m.passLock = null;
	const hp = chargesFor(m.mode, round, rng);
	for (const side of ["player", "dealer"]) m.actors[side] = {
		hp,
		maxHp: hp,
		items: [],
		known: {},
		cuffed: false
	};
	m.turn = "player";
	const intro = m.mode === "double" ? `Wave ${round}. ${hp} charges each. The pot is $${m.wavePot.toLocaleString("en-US")}.` : round === 1 ? `${hp} charges. No mercy, and ${m.mode === "story" ? "no tools yet" : "a thin handful of tools"}.` : round === 2 ? `${hp} charges. The box opens.` : `${hp} charges. Last round. When the lamps die, so do you.`;
	loadGun(m, rng);
	m.publicLog = [intro, ...m.publicLog].slice(-6);
	m.dialogue = `${intro} ${m.dialogue}`;
}
function createMatch(mode, rng) {
	const m = freshMatch(mode);
	beginRound(m, 1, rng);
	return m;
}
function notePass(m) {
	if (m.mode !== "hotseat") return;
	if (!m.interstitial && !m.cashout) m.passLock = m.turn;
}
function ackPass(m) {
	if (!m.passLock) return m;
	return {
		...m,
		actors: m.actors,
		passLock: null
	};
}
function die(m, victim) {
	const winner = other(victim);
	if (m.mode === "story" && victim === "player") {
		m.roundLosses += 1;
		m.interstitial = {
			kind: "round-lose",
			title: "Flatlined",
			body: "The last lamp on your rail goes black. He lights a cigarette off the barrel and waits for you to sit again."
		};
		return m;
	}
	if (m.mode === "story" && victim === "dealer") {
		if (m.round >= 3) m.interstitial = {
			kind: "story-win",
			title: "The host is down",
			body: "Three rounds. The wires on his side stay dark. Walk out — or swallow what he left on the felt and double until you don't."
		};
		else m.interstitial = {
			kind: "round-win",
			title: `Round ${m.round} breaks`,
			body: "He jerks once and the lamps take him back. The next round will not be this kind."
		};
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
			body: `The pot of $${m.wavePot.toLocaleString("en-US")} stays on his side of the table.`
		};
		return m;
	}
	m.scores[winner] += 1;
	const a = m.scores.player;
	const b = m.scores.dealer;
	if (m.scores[winner] >= 2 || m.round >= 3) m.interstitial = {
		kind: "match-win",
		title: `${sideName("hotseat", winner)} takes the table`,
		body: `Rounds ${a}–${b}. The gun cools.`
	};
	else m.interstitial = {
		kind: "round-win",
		title: `${sideName("hotseat", winner)} takes the round`,
		body: `The board reads ${a}–${b}. Next round raises the charges.`
	};
	return m;
}
function continueInterstitial(m, rng) {
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
function continueDouble(m, rng) {
	if (!m.cashout) return m;
	const next = structuredClone(m);
	next.wavePot *= 2;
	next.cashout = null;
	beginRound(next, next.round + 1, rng);
	return next;
}
function busy(m) {
	if (m.interstitial) return "Wait.";
	if (m.cashout) return "The pot is waiting.";
	if (m.passLock) return "Pass the gun first.";
	if (m.resolving) return "The gun is still moving.";
	if (m.shells.length === 0) return "The gun is empty.";
	return null;
}
function rejectReason(m, side, action) {
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
		case "phone": return null;
		case "saw":
			if (m.sawed) return "The barrel is already short.";
			return null;
		case "cuffs":
			if (m.actors[foe].cuffed) return "Already cuffed.";
			return null;
		case "adrenaline": {
			if (action.steal === void 0) {
				if (!m.actors[foe].items.some((it) => it !== "adrenaline")) return "They have nothing you can take.";
				return "Choose one of their tools.";
			}
			const stolen = m.actors[foe].items[action.steal];
			if (!stolen) return "That slot is empty.";
			if (stolen === "adrenaline") return "Adrenaline cannot steal adrenaline.";
			return rejectStolen(m, side, stolen);
		}
		default: return "Unknown tool.";
	}
}
function rejectStolen(m, side, item) {
	if (item === "cigs" && m.actors[side].hp >= m.actors[side].maxHp) return "Their cigarettes would do nothing — you are full.";
	if (item === "saw" && m.sawed) return "The barrel is already short.";
	if (item === "cuffs" && m.actors[other(side)].cuffed) return "Already cuffed.";
	if ((item === "glass" || item === "beer" || item === "inverter") && m.shells.length === 0) return "Nothing chambered.";
	return null;
}
function passTurn(m, shooter, blankSelf) {
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
function damageOf(m, shell) {
	if (shell !== "live") return 0;
	return m.sawed ? 2 : 1;
}
function applyAction(m, side, action, rng) {
	if (rejectReason(m, side, action)) return m;
	const next = structuredClone(m);
	if (action.kind === "shoot") return shoot(next, side, action.target, rng);
	return useItem(next, side, action.index, rng, action.steal);
}
function shoot(m, side, target, rng) {
	const shell = m.shells.shift();
	if (!shell) return m;
	const damage = damageOf(m, shell.type);
	const sawed = m.sawed;
	m.sawed = false;
	if (damage > 0) m.actors[target].hp = Math.max(0, m.actors[target].hp - damage);
	const who = sideName(m.mode, target, side);
	const self = target === side;
	const mine = m.mode === "hotseat" || side === "player";
	if (shell.type === "blank" && self) say(m, mine ? "Blank, under your own chin. The turn stays." : "Blank. He aimed at himself and earned another pull.");
	else if (shell.type === "blank") say(m, `Blank. ${who} doesn't even flinch.`);
	else if (self) say(m, mine ? sawed ? "Live. Sawed. Two of your own charges blow out." : "Live, into yourself. A charge burns." : sawed ? "Live. He sawed the barrel and took two of his own." : "Live. The host eats a charge.");
	else say(m, sawed ? `Live. Sawed barrel. ${who} loses two.` : `Live. ${who} loses a charge.`);
	stamp(m, {
		kind: "shot",
		side,
		target,
		shell: shell.type,
		damage
	}, shell.type === "live" ? 640 : 460);
	if (m.actors[target].hp <= 0) return die(m, target);
	const previous = side;
	if (m.shells.length === 0) {
		loadGun(m, rng);
		m.lockMs = Math.max(m.lockMs, 640);
	}
	passTurn(m, previous, shell.type === "blank" && self);
	return m;
}
function useItem(m, side, index, rng, steal) {
	const item = m.actors[side].items[index];
	if (!item) return m;
	m.actors[side].items.splice(index, 1);
	return resolveItem(m, side, item, rng, steal, true);
}
function resolveItem(m, side, item, rng, steal, fromHand) {
	const foe = other(side);
	const me = m.actors[side];
	const lock = fromHand ? 420 : 360;
	if (item === "adrenaline") {
		const stolen = m.actors[foe].items[steal ?? -1];
		if (!stolen || stolen === "adrenaline") return m;
		m.actors[foe].items.splice(steal ?? 0, 1);
		say(m, `${sideName(m.mode, side)} slams adrenaline and takes ${label(stolen)}.`);
		stamp(m, {
			kind: "item",
			side,
			item
		}, lock);
		return resolveItem(m, side, stolen, rng, void 0, false);
	}
	switch (item) {
		case "cigs":
			me.hp = Math.min(me.maxHp, me.hp + 1);
			say(m, `${sideName(m.mode, side)} smokes. One charge crawls back.`);
			stamp(m, {
				kind: "heal",
				side
			}, lock);
			stamp(m, {
				kind: "item",
				side,
				item
			}, lock);
			return m;
		case "medicine": {
			const good = rng() < .5;
			if (good) me.hp = Math.min(me.maxHp, me.hp + 2);
			else me.hp -= 1;
			if (good) {
				say(m, `${sideName(m.mode, side)} swallows the pills. Two charges slam back.`);
				stamp(m, {
					kind: "heal",
					side
				}, lock);
			} else {
				say(m, `${sideName(m.mode, side)} gags on the pills and loses a charge.`);
				stamp(m, {
					kind: "hurt",
					side
				}, 520);
			}
			stamp(m, {
				kind: "item",
				side,
				item
			}, m.lockMs);
			if (me.hp <= 0) return die(m, side);
			return m;
		}
		case "glass": {
			const s = m.shells[0];
			if (!s) return m;
			me.known[s.id] = s.type;
			say(m, `${sideName(m.mode, side)} lifts the magnifier.`);
			stamp(m, {
				kind: "item",
				side,
				item
			}, lock);
			return m;
		}
		case "phone": {
			const future = m.shells.map((s, i) => ({
				s,
				i
			})).filter(({ s, i }) => i > 0 && !me.known[s.id]);
			const pool = future.length > 0 ? future : m.shells.map((s, i) => ({
				s,
				i
			})).filter(({ i }) => i > 0);
			if (pool.length === 0) say(m, "The burner spits static. Nothing is loaded behind this shell.");
			else {
				const chosen = pick(rng, pool);
				me.known[chosen.s.id] = chosen.s.type;
				say(m, `${sideName(m.mode, side)} holds a burner to one ear.`);
			}
			stamp(m, {
				kind: "item",
				side,
				item
			}, lock);
			return m;
		}
		case "beer": {
			const s = m.shells.shift();
			if (!s) return m;
			say(m, `${sideName(m.mode, side)} racks one out. ${s.type === "live" ? "Live" : "Blank"}.`);
			stamp(m, {
				kind: "eject",
				side,
				shell: s.type
			}, 480);
			if (m.shells.length === 0) loadGun(m, rng);
			return m;
		}
		case "saw":
			m.sawed = true;
			say(m, "The saw chews the barrel short. The next live shell takes two.");
			stamp(m, {
				kind: "item",
				side,
				item
			}, lock);
			return m;
		case "cuffs":
			m.actors[foe].cuffed = true;
			say(m, `${sideName(m.mode, foe)} is cuffed. Their next turn never arrives.`);
			stamp(m, {
				kind: "item",
				side,
				item
			}, lock);
			return m;
		case "inverter": {
			const s = m.shells[0];
			if (!s) return m;
			s.type = s.type === "live" ? "blank" : "live";
			for (const sd of ["player", "dealer"]) if (m.actors[sd].known[s.id]) m.actors[sd].known[s.id] = s.type;
			say(m, "The inverter kicks. Whatever was chambered is the other thing.");
			stamp(m, { kind: "flip" }, lock);
			return m;
		}
		default: return m;
	}
}
function label(id) {
	switch (id) {
		case "glass": return "the magnifier";
		case "cigs": return "the cigarettes";
		case "beer": return "the beer";
		case "saw": return "the saw";
		case "cuffs": return "the handcuffs";
		case "phone": return "the burner";
		case "inverter": return "the inverter";
		case "medicine": return "the expired medicine";
		case "adrenaline": return "the adrenaline";
		default: return "a tool";
	}
}
function release(m) {
	if (!m.resolving) return m;
	return {
		...m,
		resolving: false
	};
}
/** Legal item indexes for enabling the tray. */
function itemReasons(m, side) {
	return m.actors[side].items.map((_, index) => rejectReason(m, side, {
		kind: "item",
		index
	}));
}
function findItem(items, id) {
	return items.findIndex((item) => item === id);
}
/**
* One legal action for the host. The caller loops until a shot (or death).
* The host never reads shell polarity except through its own knowledge.
*/
function nextAction(match, side, rng) {
	const foeSide = other(side);
	const me = match.actors[side];
	const foe = match.actors[foeSide];
	const shells = match.shells;
	const cur = shells[0];
	const know = cur ? knowledgeOf(me, shells, cur) : null;
	const { live, blank } = counts(shells);
	const total = live + blank;
	const tryItem = (index, steal) => {
		if (index < 0) return null;
		const action = steal === void 0 ? {
			kind: "item",
			index
		} : {
			kind: "item",
			index,
			steal
		};
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
	if (phone && shells.length > 1 && shells.slice(1).some((s) => knowledgeOf(me, shells, s) === null)) return phone;
	const adrenaline = findItem(me.items, "adrenaline");
	if (adrenaline >= 0) {
		const steal = bestSteal(match, side, know, live, blank);
		const action = tryItem(adrenaline, steal ?? void 0);
		if (action && steal !== null) return action;
	}
	const shoot = (target) => ({
		kind: "shoot",
		target
	});
	if (!cur) return shoot(foeSide);
	if (know === "blank") {
		const reach = match.sawed || findItem(me.items, "saw") >= 0 ? 2 : 1;
		if (foe.hp <= reach && (foe.hp <= 1 || match.sawed || findItem(me.items, "saw") >= 0)) {
			const inv = tryItem(findItem(me.items, "inverter"));
			if (inv) return inv;
		}
		return shoot(side);
	}
	if (know === "live" || know === null && live >= blank) {
		if ((know === "live" || total > 0 && live > blank) && foe.hp >= 2) {
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
function bestSteal(match, side, know, live, blank) {
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
var ctx = null;
var master = null;
function unlockAudio() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = .8;
		master.connect(ctx.destination);
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = 46;
		g.gain.value = .03;
		o.connect(g);
		g.connect(master);
		o.start();
	}
	if (ctx.state === "suspended") ctx.resume();
}
function setAudioGain(volume, muted) {
	if (!master || !ctx) return;
	master.gain.setTargetAtTime(muted ? 0 : Math.max(0, Math.min(1, volume)), ctx.currentTime, .03);
}
function tone(freq, dur, gain, type, slideTo) {
	if (!ctx || !master) return;
	const t = ctx.currentTime;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t);
	if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(g);
	g.connect(master);
	o.start(t);
	o.stop(t + dur + .02);
}
function burst(dur, gain, cutoff) {
	if (!ctx || !master) return;
	const t = ctx.currentTime;
	const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
	const src = ctx.createBufferSource();
	src.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = cutoff;
	const g = ctx.createGain();
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	src.connect(filter);
	filter.connect(g);
	g.connect(master);
	src.start(t);
}
function cueShot(live) {
	if (live) {
		burst(.28, .55, 900);
		tone(140, .22, .28, "sawtooth", 40);
		tone(70, .35, .2, "sine", 36);
	} else {
		burst(.05, .18, 1800);
		tone(420, .06, .08, "square", 180);
	}
}
function cueRack() {
	burst(.09, .22, 1400);
	tone(180, .08, .06, "triangle", 90);
}
function cueClick() {
	tone(520, .05, .05, "square", 220);
}
function cueHeal() {
	tone(320, .12, .05, "sine", 480);
}
function cueHurt() {
	tone(180, .16, .08, "sawtooth", 60);
}
function heartbeat() {
	tone(70, .08, .06, "sine", 40);
}
var KEY = "chamber-twelve-v1";
function readSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (parsed.version !== 1) return {};
		return parsed;
	} catch {
		return {};
	}
}
function playFx(fx) {
	if (!fx) return;
	if (fx.kind === "shot") {
		cueShot(fx.shell === "live");
		kickGun(fx.target === "dealer", fx.shell === "live" ? 1 : .28);
		if (fx.target === "dealer" && fx.shell === "live") flinchHost(1);
		return;
	}
	if (fx.kind === "eject") {
		cueRack();
		present.pump = 1;
		present.shake = .12;
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
		if (fx.side === "dealer") flinchHost(.6);
		return;
	}
	if (fx.kind === "item" || fx.kind === "flip") cueClick();
}
var useGame = create((set, get) => {
	const persist = () => {
		const s = get();
		const save = {
			version: 1,
			unlockedDon: s.unlockedDon,
			bestPot: s.bestPot,
			walked: s.walked,
			falls: s.falls,
			volume: s.volume,
			fast: s.fast
		};
		try {
			localStorage.setItem(KEY, JSON.stringify(save));
		} catch {}
	};
	const commit = (match) => {
		const prev = get().match;
		if (match && match.fxId !== prev?.fxId) playFx(match.fx);
		set({
			match,
			armSteal: null,
			screen: match ? "title" : get().screen
		});
	};
	return {
		match: null,
		screen: "title",
		volume: .8,
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
				volume: save.volume ?? .8,
				fast: !!save.fast
			});
			setAudioGain(save.volume ?? .8, get().muted);
		},
		start: (mode) => {
			unlockAudio();
			if (mode === "double" && !get().unlockedDon) return;
			commit(createMatch(mode, Math.random));
		},
		openRules: () => set({ screen: "rules" }),
		closeRules: () => set({ screen: "title" }),
		leave: () => set({
			match: null,
			armSteal: null,
			screen: "title"
		}),
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
			let next = applyAction(m, "dealer", nextAction(m, "dealer", Math.random), Math.random);
			if (next === m) next = applyAction(m, "dealer", {
				kind: "shoot",
				target: m.actors.player.hp > 0 ? "player" : "dealer"
			}, Math.random);
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
				screen: "title"
			});
			persist();
		},
		doubleDown: () => {
			const m = get().match;
			if (!m?.cashout) return;
			commit(continueDouble(m, Math.random));
		},
		swallowPills: () => {
			set({
				unlockedDon: true,
				walked: get().walked + 1
			});
			persist();
			commit(createMatch("double", Math.random));
		},
		walkAway: () => {
			set({
				unlockedDon: true,
				walked: get().walked + 1,
				match: null,
				armSteal: null,
				screen: "title"
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
		}
	};
});
var ICONS = {
	glass: Search,
	cigs: Cigarette,
	beer: Beer,
	saw: Axe,
	cuffs: Link2,
	phone: Phone,
	inverter: ArrowLeftRight,
	adrenaline: Syringe,
	medicine: Pill
};
function viewerOf(match) {
	if (match.mode !== "hotseat") return "player";
	return match.passLock ?? match.turn;
}
function Chrome() {
	const match = useGame((s) => s.match);
	const screen = useGame((s) => s.screen);
	if (match?.passLock) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassCover, { match });
	if (match?.interstitial && !match.resolving) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndCard, {});
	if (match?.cashout && !match.resolving) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashCard, {});
	if (!match && screen === "rules") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rules, {});
	if (!match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHud, { match });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel title-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Offline · one gun · no account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Chamber", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Twelve" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "A shotgun on the felt. Live shells and blanks, in an order you are not allowed to see. The host across the table plays for blood."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "menu-actions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-blood",
						onClick: () => start("story"),
						children: ["Face the host", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Three rounds. 2, then 4, then 5 charges." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: !unlocked,
						onClick: () => start("double"),
						children: ["Swallow the pills", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: unlocked ? "Endless. The pot doubles — or you leave with nothing." : "Win the three rounds to unlock." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => start("hotseat"),
						children: ["Pass the gun", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Two people, one screen. Notes stay private." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-text",
						onClick: openRules,
						children: "Table rules"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "stats",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Walked out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: walked })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Best pot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: best > 0 ? `$${best.toLocaleString("en-US")}` : "—" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Flatlines" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: falls })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "prefs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Room tone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 1,
						step: .05,
						value: muted ? 0 : volume,
						onChange: (event) => setVolume(Number(event.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-text",
						onClick: toggleMute,
						children: muted ? "Sound off" : "Sound on"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-text",
						onClick: toggleFast,
						children: fast ? "Pace: snap" : "Pace: slow"
					})
				]
			})
		]
	});
}
function Rules() {
	const closeRules = useGame((s) => s.closeRules);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel rules-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "How the table works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Rules" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rules-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every load shows the counts — how many live, how many blank — then hides the order. On your turn, use any number of tools, then pull the trigger at the other side or at yourself." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A live shell removes charges. One, or two if the barrel is sawed." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Shooting the other side always ends your turn, live or blank." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A blank into yourself does nothing and you pull again. A live one wounds you and the turn passes." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Handcuffs skip their next turn. They do not stack. Your free blank pull does not spend that skip." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Empty gun: a new load, new counts. Tools are dealt on the first three loads of a round, eight slots max. After that, shells only." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Story: round one has no tools and 2 charges. Round two deals 2 tools and 4 charges. Round three deals 4 tools and 5 charges. Dying restarts that round." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pills: random charges, every tool in the box, a pot that doubles. Cash out between waves. Die and the pot stays." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pass the gun: same charges, tools from the first round, full box. First to win two rounds, or whoever leads after three." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Tools" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "tool-rules",
						children: Object.keys(ITEMS).map((id) => {
							const Icon = ICONS[id];
							const info = ITEMS[id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { "aria-hidden": true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [info.name, "."] }),
								" ",
								info.rule,
								id === "phone" || id === "inverter" || id === "adrenaline" || id === "medicine" ? " Enters with the pills, and in pass-the-gun." : " On the table from round two."
							] })] }, id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "keys",
						children: "Keys: F or up shoots them, R or down shoots you, 1–8 use a tool. Everything here runs in the browser. Nothing is stored anywhere but this device."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-blood",
				onClick: closeRules,
				children: "Back"
			})
		]
	});
}
function TableHud({ match }) {
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
	const playable = (match.mode === "hotseat" ? match.turn === viewer : match.turn === "player" && viewer === "player") && !match.resolving && !match.interstitial && !match.cashout;
	const shootThem = playable ? rejectReason(match, match.turn, {
		kind: "shoot",
		target: foe
	}) : "Wait.";
	const shootMe = playable ? rejectReason(match, match.turn, {
		kind: "shoot",
		target: viewer
	}) : "Wait.";
	const useSlot = (index) => {
		const item = me.items[index];
		if (!item || !playable) return;
		if (item === "adrenaline") {
			arm(armSteal === index ? null : index);
			return;
		}
		act({
			kind: "item",
			index
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-text",
						onClick: leave,
						children: "Leave"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "counts",
						"aria-live": "polite",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "count-live",
							children: [mine.live, " live"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "count-blank",
							children: [mine.blank, " blank"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "round-tag",
						children: match.mode === "double" ? `Wave ${match.round} · $${match.wavePot.toLocaleString("en-US")}` : match.mode === "hotseat" ? `Round ${match.round} · ${match.scores.player}–${match.scores.dealer}` : `Round ${match.round} of 3`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "status-row",
				children: [
					match.sawed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip chip-hot",
						children: "Sawed · next live deals 2"
					}) : null,
					them.cuffed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						children: "Cuffed · their next turn skips"
					}) : null,
					me.cuffed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						children: "You are cuffed"
					}) : null,
					!playable && match.mode !== "hotseat" && match.turn === "dealer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "chip",
						children: "The host is moving"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dock",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dialogue",
						"aria-live": "polite",
						children: match.dialogue
					}),
					match.resolving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-text hurry",
						onClick: releaseLock,
						children: "Hurry"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rails",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRail, {
							label: sideName(match.mode, viewer, viewer),
							hp: me.hp,
							max: me.maxHp
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeRail, {
							label: sideName(match.mode, foe, viewer),
							hp: them.hp,
							max: them.maxHp
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pips",
						"aria-label": "Shells you can prove",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pip-label",
							children: "What you can prove"
						}), match.shells.map((shell, index) => {
							const k = known[index];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: k === "live" ? "pip pip-live" : k === "blank" ? "pip pip-blank" : "pip",
								children: [index === 0 ? "Now" : index + 1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: k === "live" ? "Live" : k === "blank" ? "Blank" : "?" })]
							}, shell.id);
						})]
					}),
					armSteal !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "steal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Take one of ",
							otherName(match.mode, viewer).toLowerCase(),
							"'s tools. It resolves now."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "item-row",
							children: [them.items.map((id, index) => {
								const Icon = ICONS[id];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "item-btn",
									disabled: id === "adrenaline",
									onClick: () => act({
										kind: "item",
										index: armSteal,
										steal: index
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { "aria-hidden": true }), ITEMS[id].name]
								}, `${id}-${index}`);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-text",
								onClick: () => arm(null),
								children: "Cancel"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "item-row",
						"aria-label": "Your tools",
						children: [me.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "empty-tools",
							children: "No tools in front of you."
						}) : null, me.items.map((id, index) => {
							const Icon = ICONS[id];
							const reason = playable ? reasons[index] : "Wait.";
							const armed = id === "adrenaline" && reason === "Choose one of their tools.";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "item-btn",
								disabled: !playable || reason !== null && !armed,
								title: ITEMS[id].rule,
								onClick: () => useSlot(index),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { "aria-hidden": true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ITEMS[id].name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: armed ? "Steal…" : ITEMS[id].blurb })
								]
							}, `${id}-${index}`);
						})]
					}),
					them.items.length > 0 && armSteal === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "their-tools",
						children: [
							sideName(match.mode, foe, viewer),
							" holds",
							" ",
							them.items.map((id) => ITEMS[id].name).join(", ")
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shots",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-blood shot",
							disabled: shootThem !== null,
							onClick: () => act({
								kind: "shoot",
								target: foe
							}),
							children: [
								"Shoot ",
								sideName(match.mode, foe, viewer),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: match.mode === "story" && match.round === 1 ? "Live wounds them. Blank wastes the pull." : "Ends your turn either way." })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-ghost shot",
							disabled: shootMe !== null,
							onClick: () => act({
								kind: "shoot",
								target: viewer
							}),
							children: ["Shoot yourself", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: match.mode === "story" && match.round === 1 ? "A blank lets you pull again." : "Blank keeps the turn. Live hurts." })]
						})]
					})
				]
			})
		]
	});
}
function ChargeRail({ label, hp, max }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rail",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "lamps",
			"aria-label": `${hp} of ${max} charges`,
			children: Array.from({ length: max }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: i < hp ? "lamp on" : "lamp" }, i))
		})]
	});
}
function PassCover({ match }) {
	const acknowledge = useGame((s) => s.acknowledge);
	const who = sideName("hotseat", match.passLock ?? "player");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel cover-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Private notes are covered"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Hand it to ", who] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: match.dialogue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn btn-blood",
				onClick: acknowledge,
				children: [who, " has the gun"]
			})
		]
	});
}
function EndCard() {
	const match = useGame((s) => s.match);
	const proceed = useGame((s) => s.proceed);
	const leave = useGame((s) => s.leave);
	const walkAway = useGame((s) => s.walkAway);
	const swallowPills = useGame((s) => s.swallowPills);
	if (!match?.interstitial) return null;
	const card = match.interstitial;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel end-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: match.dialogue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: card.title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: card.body
			}),
			card.kind === "round-win" || card.kind === "round-lose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-blood",
				onClick: proceed,
				children: card.kind === "round-lose" ? "Sit again" : "Next round"
			}) : null,
			card.kind === "story-win" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "menu-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: walkAway,
					children: "Walk away"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-blood",
					onClick: swallowPills,
					children: ["Swallow the pills", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Pot starts at $2,500 and doubles every wave you survive." })]
				})]
			}) : null,
			card.kind === "don-lose" || card.kind === "match-win" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-blood",
				onClick: leave,
				children: "Leave the table"
			}) : null
		]
	});
}
function CashCard() {
	const match = useGame((s) => s.match);
	const cashOut = useGame((s) => s.cashOut);
	const doubleDown = useGame((s) => s.doubleDown);
	const pot = match?.cashout?.pot ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel end-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "He is down. The pot is not."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["$", pot.toLocaleString("en-US")] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "lede",
				children: [
					"Take it home, or stay. The next wave plays for $",
					(pot * 2).toLocaleString("en-US"),
					". Die and you leave with nothing — this pot included."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "menu-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: cashOut,
					children: "Take the money"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-blood",
					onClick: doubleDown,
					children: "Double or nothing"
				})]
			})
		]
	});
}
var Scene = (0, import_react.lazy)(() => import("./Scene-B7VUU9VT.mjs"));
function Game() {
	const hydrate = useGame((s) => s.hydrate);
	const fast = useGame((s) => s.fast);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [blood, setBlood] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		hydrate();
		setReady(true);
		const down = () => unlockAudio();
		window.addEventListener("pointerdown", down);
		return () => window.removeEventListener("pointerdown", down);
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
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
			if (changed && fx?.kind === "shot" && fx.shell === "live" && fx.target === "player") setBlood(1);
			if (changed && fx?.kind === "hurt" && fx.side === "player") setBlood(.75);
		});
		return () => {
			window.clearTimeout(timer);
			unsub();
		};
	}, [fast]);
	(0, import_react.useEffect)(() => {
		if (blood <= 0) return;
		const timer = window.setTimeout(() => setBlood(0), 420);
		return () => window.clearTimeout(timer);
	}, [blood]);
	const hp = useGame((s) => s.match && s.match.mode !== "hotseat" ? s.match.actors.player.hp : 0);
	const playing = useGame((s) => !!s.match && !s.match.interstitial && !s.match.cashout);
	(0, import_react.useEffect)(() => {
		if (!playing || hp !== 1) return;
		const timer = window.setInterval(() => heartbeat(), 900);
		return () => window.clearInterval(timer);
	}, [playing, hp]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.repeat) return;
			const target = event.target;
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
				act({
					kind: "shoot",
					target: foe
				});
			} else if (event.key === "r" || event.key === "R" || event.key === "ArrowDown") {
				event.preventDefault();
				act({
					kind: "shoot",
					target: viewer
				});
			} else if (event.key >= "1" && event.key <= "8") {
				const index = Number(event.key) - 1;
				const item = match.actors[viewer].items[index];
				if (!item) return;
				if (item === "adrenaline" && armSteal === null) arm(index);
				else act({
					kind: "item",
					index
				});
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "stage",
		children: [
			ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "blood-wash",
				style: { opacity: blood }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chrome, {})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Game, {});
}
//#endregion
export { useGame as n, present as r, routes_exports as t };
