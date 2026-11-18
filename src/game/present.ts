/** Cosmetic impulses. The simulation never reads these. */
export const present = {
  shake: 0,
  /** 1 aims at the host, -1 aims back at the camera, 0 rests. */
  aim: 0,
  pump: 0,
  flash: 0,
  hostFlinch: 0,
};

export function kickGun(towardHost: boolean, power: number) {
  present.aim = towardHost ? 1 : -1;
  present.pump = 1;
  present.shake = power;
  present.flash = power;
}

export function flinchHost(power: number) {
  present.hostFlinch = power;
}
