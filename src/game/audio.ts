let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: OscillatorNode | null = null;

export function unlockAudio(): void {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 46;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(master);
    o.start();
    drone = o;
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function setAudioGain(volume: number, muted: boolean): void {
  if (!master || !ctx) return;
  master.gain.setTargetAtTime(muted ? 0 : Math.max(0, Math.min(1, volume)), ctx.currentTime, 0.03);
}

function tone(freq: number, dur: number, gain: number, type: OscillatorType, slideTo?: number) {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function burst(dur: number, gain: number, cutoff: number) {
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
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t);
}

export function cueShot(live: boolean): void {
  if (live) {
    burst(0.28, 0.55, 900);
    tone(140, 0.22, 0.28, "sawtooth", 40);
    tone(70, 0.35, 0.2, "sine", 36);
  } else {
    burst(0.05, 0.18, 1800);
    tone(420, 0.06, 0.08, "square", 180);
  }
}

export function cueRack(): void {
  burst(0.09, 0.22, 1400);
  tone(180, 0.08, 0.06, "triangle", 90);
}

export function cueClick(): void {
  tone(520, 0.05, 0.05, "square", 220);
}

export function cueHeal(): void {
  tone(320, 0.12, 0.05, "sine", 480);
}

export function cueHurt(): void {
  tone(180, 0.16, 0.08, "sawtooth", 60);
}

export function heartbeat(): void {
  tone(70, 0.08, 0.06, "sine", 40);
}

export function stopDrone(): void {
  drone?.stop();
  drone = null;
}
