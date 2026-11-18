import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { present } from "@/game/present";
import { useGame } from "@/game/store";
import type { ItemId, Side } from "@/game/types";

const felt = "#163028";
const wood = "#1c1410";
const bone = "#e6dccb";
const blood = "#9a1c16";
const bulb = "#e4b15a";
const metal = "#4a453f";
const suit = "#120c0c";

function WorldError({ children }: { children: ReactNode }) {
  return <Boundary>{children}</Boundary>;
}

class Boundary extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError(): { bad: boolean } {
    return { bad: true };
  }
  render() {
    if (this.state.bad) {
      return (
        <p className="pointer-events-none absolute top-1/3 left-1/2 w-64 -translate-x-1/2 text-center font-sans text-muted">
          This table needs WebGL. The rules still stand — try another browser.
        </p>
      );
    }
    return this.props.children;
  }
}

function Felt() {
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const g = canvas.getContext("2d");
    if (!g) return null;
    g.fillStyle = felt;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 7000; i += 1) {
      const shade = Math.random() > 0.5 ? "rgba(0,0,0,0.18)" : "rgba(230,220,203,0.05)";
      g.fillStyle = shade;
      g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    g.strokeStyle = "rgba(230,220,203,0.45)";
    g.lineWidth = 4;
    g.strokeRect(36, 36, 440, 440);
    g.beginPath();
    g.moveTo(36, 256);
    g.lineTo(476, 256);
    g.stroke();
    g.strokeRect(150, 70, 212, 150);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
      <planeGeometry args={[1.7, 1.35]} />
      <meshStandardMaterial map={map ?? undefined} color={map ? "white" : felt} roughness={0.95} />
    </mesh>
  );
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0c0908" roughness={1} />
      </mesh>
      <mesh position={[0, 0.7, -1.85]}>
        <planeGeometry args={[8, 3.4]} />
        <meshStandardMaterial color="#100c0b" roughness={1} />
      </mesh>
      <mesh position={[-2.3, 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 3.4]} />
        <meshStandardMaterial color="#0e0a09" />
      </mesh>
      <mesh position={[2.3, 0.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 3.4]} />
        <meshStandardMaterial color="#0e0a09" />
      </mesh>
      <mesh position={[0, -0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.15, 0.08, 1.7]} />
        <meshStandardMaterial color={wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.7, 0.68, 1.25]} />
        <meshStandardMaterial color="#140e0c" />
      </mesh>
      <Felt />
      <mesh position={[0, 0.55, -1.82]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial color="#1a1210" />
      </mesh>
    </group>
  );
}

function BulbLight() {
  const group = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }, delta) => {
    const d = Math.min(delta, 0.1);
    const t = clock.elapsedTime;
    if (group.current) group.current.rotation.z = Math.sin(t * 0.55) * 0.06;
    if (spot.current) {
      const flicker = Math.random() < 0.012 ? 0.45 : 1;
      const target = (18 + Math.sin(t * 13) * 0.6) * flicker;
      spot.current.intensity += (target - spot.current.intensity) * Math.min(1, d * 8);
    }
  });
  return (
    <group ref={group} position={[0.05, 1.35, 0.05]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.4, 5]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial color={bulb} emissive={bulb} emissiveIntensity={2.2} />
      </mesh>
      <spotLight
        ref={spot}
        position={[0, -0.02, 0]}
        angle={0.95}
        penumbra={0.65}
        intensity={18}
        distance={7}
        color={bulb}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </group>
  );
}

function Lamps({ hp, max, x, z }: { hp: number; max: number; x: number; z: number }) {
  return (
    <group position={[x, 0.03, z]}>
      {Array.from({ length: max }, (_, i) => {
        const on = i < hp;
        return (
          <mesh key={i} position={[(i - (max - 1) / 2) * 0.09, 0, 0]}>
            <boxGeometry args={[0.055, 0.03, 0.04]} />
            <meshStandardMaterial
              color={on ? blood : "#241614"}
              emissive={on ? blood : "#000000"}
              emissiveIntensity={on ? 1.6 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Shotgun() {
  const group = useRef<THREE.Group>(null);
  const kick = useRef(0);
  const yaw = useRef(0.4);
  const sawed = useGame((s) => s.match?.sawed ?? false);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const target = present.aim === 1 ? 0.02 : present.aim === -1 ? Math.PI - 0.2 : 0.42;
    yaw.current += (target - yaw.current) * Math.min(1, d * 8);
    kick.current = Math.max(kick.current * Math.exp(-6 * d), present.pump * 0.07);
    present.pump *= Math.exp(-3 * d);
    if (present.aim !== 0) {
      present.aim = Math.abs(yaw.current - target) < 0.05 && present.pump < 0.05 ? 0 : present.aim;
    }
    if (!group.current) return;
    group.current.rotation.y = yaw.current;
    group.current.position.z = 0.16 + kick.current;
    group.current.rotation.x = -kick.current * 1.4;
  });
  const barrelLen = sawed ? 0.26 : 0.5;
  return (
    <group ref={group} position={[0.08, 0.055, 0.16]}>
      <mesh position={[0, 0.02, 0.22]} castShadow>
        <boxGeometry args={[0.07, 0.08, 0.32]} />
        <meshStandardMaterial color="#3a2a1e" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.035, 0.02]} castShadow>
        <boxGeometry args={[0.075, 0.09, 0.2]} />
        <meshStandardMaterial color="#2a2724" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.05, -barrelLen / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.026, barrelLen, 8]} />
        <meshStandardMaterial color={metal} metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.02, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 8]} />
        <meshStandardMaterial color="#2c241c" roughness={0.7} />
      </mesh>
      {sawed ? (
        <mesh position={[0, 0.05, -barrelLen]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.02, 0.02, 6]} />
          <meshStandardMaterial color="#6a6248" metalness={0.4} roughness={0.5} />
        </mesh>
      ) : null}
      <Flash at={-barrelLen} />
    </group>
  );
}

function Flash({ at }: { at: number }) {
  const light = useRef<THREE.PointLight>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    present.flash *= Math.exp(-8 * d);
    const v = present.flash;
    if (light.current) light.current.intensity = v * 30;
    if (mesh.current) {
      mesh.current.scale.setScalar(0.2 + v);
      mesh.current.visible = v > 0.02;
    }
  });
  return (
    <group position={[0, 0.05, at]}>
      <pointLight ref={light} color="#ffd2a8" intensity={0} distance={3.2} />
      <mesh ref={mesh} visible={false}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ffe1b0" />
      </mesh>
    </group>
  );
}

function Host() {
  const ref = useRef<THREE.Group>(null);
  const base = useRef(0);
  useFrame(({ clock }, delta) => {
    const d = Math.min(delta, 0.1);
    present.hostFlinch *= Math.exp(-4 * d);
    const t = clock.elapsedTime;
    if (!ref.current) return;
    base.current = Math.sin(t * 1.15) * 0.008;
    ref.current.position.y = base.current - present.hostFlinch * 0.08;
    ref.current.rotation.x = present.hostFlinch * 0.35;
    ref.current.rotation.y = Math.sin(t * 0.35) * 0.04;
  });
  return (
    <group ref={ref} position={[0, 0.42, -0.78]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.58, 0.42, 0.28]} />
        <meshStandardMaterial color={suit} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.0, 0.1]}>
        <boxGeometry args={[0.36, 0.36, 0.06]} />
        <meshStandardMaterial color="#4a1512" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.32, 0.02]}>
        <cylinderGeometry args={[0.055, 0.07, 0.1, 8]} />
        <meshStandardMaterial color={bone} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0.04]} castShadow>
        <sphereGeometry args={[0.18, 20, 16]} />
        <meshStandardMaterial color={bone} roughness={0.48} />
      </mesh>
      <mesh position={[-0.065, 0.53, 0.175]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#120c0c" />
      </mesh>
      <mesh position={[0.07, 0.53, 0.175]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#120c0c" />
      </mesh>
      <mesh position={[-0.065, 0.53, 0.205]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color={bulb} emissive={bulb} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.07, 0.53, 0.205]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color={bulb} emissive={bulb} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.01, 0.4, 0.16]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.11, 0.012, 0.02]} />
        <meshStandardMaterial color="#2a1212" />
      </mesh>
      <mesh position={[0.09, 0.62, 0.1]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.008, 0.16, 0.008]} />
        <meshStandardMaterial color="#3a2e28" />
      </mesh>
      <mesh position={[0.11, 0.4, 0.2]} rotation={[0.4, 0.2, -0.5]}>
        <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
        <meshStandardMaterial color="#d9d0c1" />
      </mesh>
      <pointLight position={[0.16, 0.38, 0.28]} color="#e07030" intensity={0.35} distance={0.5} />
      <mesh position={[-0.28, -0.36, 0.32]}>
        <boxGeometry args={[0.16, 0.045, 0.11]} />
        <meshStandardMaterial color={bone} roughness={0.55} />
      </mesh>
      <mesh position={[0.28, -0.36, 0.28]}>
        <boxGeometry args={[0.16, 0.045, 0.11]} />
        <meshStandardMaterial color={bone} roughness={0.55} />
      </mesh>
    </group>
  );
}

function ToolMesh({ id }: { id: ItemId }) {
  switch (id) {
    case "beer":
      return (
        <group>
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 10]} />
            <meshStandardMaterial color="#2a241c" metalness={0.45} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.037, 0.037, 0.04, 10]} />
            <meshStandardMaterial color={blood} />
          </mesh>
        </group>
      );
    case "cigs":
      return (
        <mesh position={[0, 0.025, 0]} castShadow>
          <boxGeometry args={[0.08, 0.045, 0.05]} />
          <meshStandardMaterial color="#c4493a" />
        </mesh>
      );
    case "glass":
      return (
        <group position={[0, 0.03, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.008, 6, 12]} />
            <meshStandardMaterial color={metal} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.05, -0.02, 0]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.008, 0.008, 0.06, 6]} />
            <meshStandardMaterial color="#2a2118" />
          </mesh>
        </group>
      );
    case "saw":
      return (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.14, 0.012, 0.04]} />
            <meshStandardMaterial color="#8d9290" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[-0.06, 0, 0]}>
            <boxGeometry args={[0.04, 0.02, 0.025]} />
            <meshStandardMaterial color="#3a2a1c" />
          </mesh>
        </group>
      );
    case "cuffs":
      return (
        <group position={[0, 0.02, 0]}>
          <mesh position={[-0.025, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.028, 0.006, 6, 10]} />
            <meshStandardMaterial color="#b9b1a4" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0.025, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.028, 0.006, 6, 10]} />
            <meshStandardMaterial color="#b9b1a4" metalness={0.75} roughness={0.3} />
          </mesh>
        </group>
      );
    case "phone":
      return (
        <group position={[0, 0.02, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 0.018, 0.09]} />
            <meshStandardMaterial color="#1a1714" />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <boxGeometry args={[0.034, 0.004, 0.06]} />
            <meshStandardMaterial color="#1d3a32" emissive="#1d3a32" emissiveIntensity={0.8} />
          </mesh>
        </group>
      );
    case "inverter":
      return (
        <group position={[0, 0.03, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
            <meshStandardMaterial color="#2c261c" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.05, 0.008, 0.012]} />
            <meshStandardMaterial color={bulb} emissive={bulb} emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case "adrenaline":
      return (
        <group position={[0, 0.04, 0]} rotation={[0, 0, 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.09, 8]} />
            <meshStandardMaterial color="#d7c7a2" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
            <meshStandardMaterial color={metal} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      );
    case "medicine":
      return (
        <group position={[0, 0.045, 0]}>
          <mesh>
            <cylinderGeometry args={[0.028, 0.03, 0.07, 8]} />
            <meshStandardMaterial color="#efe6d4" />
          </mesh>
          <mesh position={[0, 0.02, 0.03]}>
            <boxGeometry args={[0.02, 0.02, 0.004]} />
            <meshStandardMaterial color={blood} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Row({
  items,
  z,
  hot,
  onPick,
}: {
  items: ItemId[];
  z: number;
  hot: boolean;
  onPick?: (index: number) => void;
}) {
  const span = Math.min(1.35, Math.max(items.length - 1, 1) * 0.2);
  return (
    <group position={[0, 0, z]}>
      {items.map((id, index) => {
        const x = items.length === 1 ? 0 : -span / 2 + (span * index) / (items.length - 1);
        return (
          <group
            key={`${id}-${index}`}
            position={[x, 0, 0]}
            onClick={(event) => {
              event.stopPropagation();
              onPick?.(index);
            }}
          >
            <ToolMesh id={id} />
            {hot ? (
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.075, 16]} />
                <meshBasicMaterial color={bulb} />
              </mesh>
            ) : null}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.12, 0.16, 0.12]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function TableItems() {
  const match = useGame((s) => s.match);
  const armSteal = useGame((s) => s.armSteal);
  const mode = match?.mode;
  const turn = match?.turn ?? "player";
  const viewer: Side = !match || mode !== "hotseat" ? "player" : (match.passLock ?? turn);
  const foe: Side = viewer === "player" ? "dealer" : "player";
  const near = match?.actors[viewer].items ?? [];
  const far = match?.actors[foe].items ?? [];
  const yours = !match || match.resolving || match.passLock || match.interstitial || match.cashout
    ? undefined
    : mode !== "hotseat" && turn !== "player"
      ? undefined
      : (index: number) => {
          const state = useGame.getState();
          const live = state.match;
          if (!live) return;
          const item = live.actors[live.turn].items[index];
          if (item === "adrenaline") {
            state.arm(index);
            return;
          }
          state.act({ kind: "item", index });
        };
  const steal =
    armSteal === null
      ? undefined
      : (index: number) => {
          const state = useGame.getState();
          if (state.armSteal === null) return;
          state.act({ kind: "item", index: state.armSteal, steal: index });
        };
  const n = match?.shells.length ?? 0;
  return (
    <group>
      <Row items={near} z={0.48} hot={false} onPick={yours} />
      <Row items={far} z={-0.32} hot={armSteal !== null} onPick={steal} />
      <group position={[-0.62, 0.03, 0.08]}>
        {Array.from({ length: n }, (_, i) => (
          <mesh key={i} position={[0, 0, -i * 0.055]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.045, 6]} />
            <meshStandardMaterial color="#a6843e" metalness={0.55} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Charges() {
  const match = useGame((s) => s.match);
  if (!match) {
    return (
      <>
        <Lamps hp={2} max={2} x={0.72} z={0.42} />
        <Lamps hp={2} max={2} x={-0.72} z={-0.42} />
      </>
    );
  }
  return (
    <>
      <Lamps hp={match.actors.player.hp} max={match.actors.player.maxHp} x={0.72} z={0.42} />
      <Lamps hp={match.actors.dealer.hp} max={match.actors.dealer.maxHp} x={-0.72} z={-0.42} />
    </>
  );
}

function Rig() {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  useFrame(({ camera, clock }, delta) => {
    const d = Math.min(delta, 0.1);
    const t = clock.elapsedTime;
    present.shake *= Math.exp(-4.5 * d);
    const kick = reduced ? 0 : present.shake;
    camera.position.set(
      Math.sin(t * 0.17) * 0.012 + (Math.random() - 0.5) * kick * 0.08,
      0.56 + Math.sin(t * 0.4) * 0.004 + (Math.random() - 0.5) * kick * 0.05,
      1.12,
    );
    camera.lookAt(0, 0.08, -0.15);
  });
  return null;
}

function SceneInner() {
  return (
    <>
      <color attach="background" args={["#070605"]} />
      <fog attach="fog" args={["#070605", 2.6, 6.5]} />
      <ambientLight intensity={0.32} color="#3a3028" />
      <Room />
      <BulbLight />
      <Host />
      <Shotgun />
      <TableItems />
      <Charges />
      <Rig />
    </>
  );
}

export default function Scene() {
  return (
    <WorldError>
      <Canvas
        className="stage-canvas"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.56, 1.12], fov: 36, near: 0.05, far: 24 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.12;
        }}
      >
        <SceneInner />
      </Canvas>
    </WorldError>
  );
}
