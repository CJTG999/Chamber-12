import { i as __toESM } from "../_runtime.mjs";
import { a as SRGBColorSpace, c as require_react, i as CanvasTexture, n as useFrame, s as require_jsx_runtime, t as Canvas } from "../_libs/@react-three/fiber+[...].mjs";
import { n as useGame, r as present } from "./routes-OZUISMdb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Scene-B7VUU9VT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var felt = "#163028";
var wood = "#1c1410";
var bone = "#e6dccb";
var blood = "#9a1c16";
var bulb = "#e4b15a";
var metal = "#4a453f";
var suit = "#120c0c";
function WorldError({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boundary, { children });
}
var Boundary = class extends import_react.Component {
	state = { bad: false };
	static getDerivedStateFromError() {
		return { bad: true };
	}
	render() {
		if (this.state.bad) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "pointer-events-none absolute top-1/3 left-1/2 w-64 -translate-x-1/2 text-center font-sans text-muted",
			children: "This table needs WebGL. The rules still stand — try another browser."
		});
		return this.props.children;
	}
};
function Felt() {
	const map = (0, import_react.useMemo)(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		const g = canvas.getContext("2d");
		if (!g) return null;
		g.fillStyle = felt;
		g.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 7e3; i += 1) {
			g.fillStyle = Math.random() > .5 ? "rgba(0,0,0,0.18)" : "rgba(230,220,203,0.05)";
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
		const tex = new CanvasTexture(canvas);
		tex.colorSpace = SRGBColorSpace;
		tex.anisotropy = 4;
		return tex;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		position: [
			0,
			.001,
			0
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.7, 1.35] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			map: map ?? void 0,
			color: map ? "white" : felt,
			roughness: .95
		})]
	});
}
function Room() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.72,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [12, 12] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#0c0908",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.7,
				-1.85
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [8, 3.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#100c0b",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-2.3,
				.7,
				0
			],
			rotation: [
				0,
				Math.PI / 2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [6, 3.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0e0a09" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				2.3,
				.7,
				0
			],
			rotation: [
				0,
				-Math.PI / 2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [6, 3.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0e0a09" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.04,
				0
			],
			receiveShadow: true,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.15,
				.08,
				1.7
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: wood,
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.42,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.7,
				.68,
				1.25
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#140e0c" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Felt, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.55,
				-1.82
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.7, .9] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a1210" })]
		})
	] });
}
function BulbLight() {
	const group = (0, import_react.useRef)(null);
	const spot = (0, import_react.useRef)(null);
	useFrame(({ clock }, delta) => {
		const d = Math.min(delta, .1);
		const t = clock.elapsedTime;
		if (group.current) group.current.rotation.z = Math.sin(t * .55) * .06;
		if (spot.current) {
			const flicker = Math.random() < .012 ? .45 : 1;
			const target = (18 + Math.sin(t * 13) * .6) * flicker;
			spot.current.intensity += (target - spot.current.intensity) * Math.min(1, d * 8);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			.05,
			1.35,
			.05
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.28,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.006,
					.006,
					.4,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a1410" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.055,
				16,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: bulb,
				emissive: bulb,
				emissiveIntensity: 2.2
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				ref: spot,
				position: [
					0,
					-.02,
					0
				],
				angle: .95,
				penumbra: .65,
				intensity: 18,
				distance: 7,
				color: bulb,
				castShadow: true,
				"shadow-mapSize-width": 512,
				"shadow-mapSize-height": 512
			})
		]
	});
}
function Lamps({ hp, max, x, z }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			x,
			.03,
			z
		],
		children: Array.from({ length: max }, (_, i) => {
			const on = i < hp;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					(i - (max - 1) / 2) * .09,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.055,
					.03,
					.04
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: on ? blood : "#241614",
					emissive: on ? blood : "#000000",
					emissiveIntensity: on ? 1.6 : 0
				})]
			}, i);
		})
	});
}
function Shotgun() {
	const group = (0, import_react.useRef)(null);
	const kick = (0, import_react.useRef)(0);
	const yaw = (0, import_react.useRef)(.4);
	const sawed = useGame((s) => s.match?.sawed ?? false);
	useFrame((_, delta) => {
		const d = Math.min(delta, .1);
		const target = present.aim === 1 ? .02 : present.aim === -1 ? Math.PI - .2 : .42;
		yaw.current += (target - yaw.current) * Math.min(1, d * 8);
		kick.current = Math.max(kick.current * Math.exp(-6 * d), present.pump * .07);
		present.pump *= Math.exp(-3 * d);
		if (present.aim !== 0) present.aim = Math.abs(yaw.current - target) < .05 && present.pump < .05 ? 0 : present.aim;
		if (!group.current) return;
		group.current.rotation.y = yaw.current;
		group.current.position.z = .16 + kick.current;
		group.current.rotation.x = -kick.current * 1.4;
	});
	const barrelLen = sawed ? .26 : .5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			.08,
			.055,
			.16
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					.22
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.07,
					.08,
					.32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#3a2a1e",
					roughness: .72
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.035,
					.02
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.075,
					.09,
					.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2a2724",
					metalness: .55,
					roughness: .38
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.05,
					-barrelLen / 2
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.02,
					.026,
					barrelLen,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: metal,
					metalness: .82,
					roughness: .28
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					-.05
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.03,
					.03,
					.14,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2c241c",
					roughness: .7
				})]
			}),
			sawed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.05,
					-barrelLen
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.028,
					.02,
					.02,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#6a6248",
					metalness: .4,
					roughness: .5
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, { at: -barrelLen })
		]
	});
}
function Flash({ at }) {
	const light = (0, import_react.useRef)(null);
	const mesh = (0, import_react.useRef)(null);
	useFrame((_, delta) => {
		present.flash *= Math.exp(-8 * Math.min(delta, .1));
		const v = present.flash;
		if (light.current) light.current.intensity = v * 30;
		if (mesh.current) {
			mesh.current.scale.setScalar(.2 + v);
			mesh.current.visible = v > .02;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			.05,
			at
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			ref: light,
			color: "#ffd2a8",
			intensity: 0,
			distance: 3.2
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: mesh,
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ffe1b0" })]
		})]
	});
}
function Host() {
	const ref = (0, import_react.useRef)(null);
	const base = (0, import_react.useRef)(0);
	useFrame(({ clock }, delta) => {
		present.hostFlinch *= Math.exp(-4 * Math.min(delta, .1));
		const t = clock.elapsedTime;
		if (!ref.current) return;
		base.current = Math.sin(t * 1.15) * .008;
		ref.current.position.y = base.current - present.hostFlinch * .08;
		ref.current.rotation.x = present.hostFlinch * .35;
		ref.current.rotation.y = Math.sin(t * .35) * .04;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: [
			0,
			.42,
			-.78
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.58,
					.42,
					.28
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: suit,
					roughness: .92
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.36,
					.36,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#4a1512",
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.32,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.055,
					.07,
					.1,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bone,
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					.04
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.18,
					20,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bone,
					roughness: .48
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.065,
					.53,
					.175
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.038,
					10,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#120c0c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.07,
					.53,
					.175
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.038,
					10,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#120c0c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.065,
					.53,
					.205
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.012,
					8,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bulb,
					emissive: bulb,
					emissiveIntensity: 2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.07,
					.53,
					.205
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.012,
					8,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bulb,
					emissive: bulb,
					emissiveIntensity: 2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.01,
					.4,
					.16
				],
				rotation: [
					.15,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.11,
					.012,
					.02
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a1212" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.09,
					.62,
					.1
				],
				rotation: [
					0,
					0,
					.7
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.008,
					.16,
					.008
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a2e28" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.11,
					.4,
					.2
				],
				rotation: [
					.4,
					.2,
					-.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.008,
					.008,
					.09,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d9d0c1" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					.16,
					.38,
					.28
				],
				color: "#e07030",
				intensity: .35,
				distance: .5
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.28,
					-.36,
					.32
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.16,
					.045,
					.11
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bone,
					roughness: .55
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.28,
					-.36,
					.28
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.16,
					.045,
					.11
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bone,
					roughness: .55
				})]
			})
		]
	});
}
function ToolMesh({ id }) {
	switch (id) {
		case "beer": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.07,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.035,
				.035,
				.12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2a241c",
				metalness: .45,
				roughness: .35
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.07,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.037,
				.037,
				.04,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: blood })]
		})] });
		case "cigs": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.025,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				.045,
				.05
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c4493a" })]
		});
		case "glass": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.03,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.04,
					.008,
					6,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: metal,
					metalness: .7,
					roughness: .3
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.05,
					-.02,
					0
				],
				rotation: [
					0,
					0,
					.6
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.008,
					.008,
					.06,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2118" })]
			})]
		});
		case "saw": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.02,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					0,
					.4,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.14,
					.012,
					.04
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#8d9290",
					metalness: .8,
					roughness: .25
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.06,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.04,
					.02,
					.025
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a2a1c" })]
			})]
		});
		case "cuffs": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.02,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.025,
					0,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.028,
					.006,
					6,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#b9b1a4",
					metalness: .75,
					roughness: .3
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.025,
					0,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.028,
					.006,
					6,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#b9b1a4",
					metalness: .75,
					roughness: .3
				})]
			})]
		});
		case "phone": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.02,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.05,
				.018,
				.09
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a1714" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.012,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.034,
					.004,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#1d3a32",
					emissive: "#1d3a32",
					emissiveIntensity: .8
				})]
			})]
		});
		case "inverter": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.03,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.04,
				.03,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2c261c",
				metalness: .4,
				roughness: .45
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.05,
					.008,
					.012
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: bulb,
					emissive: bulb,
					emissiveIntensity: .4
				})]
			})]
		});
		case "adrenaline": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.04,
				0
			],
			rotation: [
				0,
				0,
				.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.012,
				.012,
				.09,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#d7c7a2",
				transparent: true,
				opacity: .85
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.05,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.004,
					.004,
					.04,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: metal,
					metalness: .8,
					roughness: .2
				})]
			})]
		});
		case "medicine": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.045,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.028,
				.03,
				.07,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#efe6d4" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					.03
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.02,
					.02,
					.004
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: blood })]
			})]
		});
		default: return null;
	}
}
function Row({ items, z, hot, onPick }) {
	const span = Math.min(1.35, Math.max(items.length - 1, 1) * .2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			0,
			0,
			z
		],
		children: items.map((id, index) => {
			const x = items.length === 1 ? 0 : -span / 2 + span * index / (items.length - 1);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					x,
					0,
					0
				],
				onClick: (event) => {
					event.stopPropagation();
					onPick?.(index);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolMesh, { id }),
					hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.01,
							0
						],
						rotation: [
							-Math.PI / 2,
							0,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
							.06,
							.075,
							16
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: bulb })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.08,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.12,
							.16,
							.12
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
							transparent: true,
							opacity: 0,
							depthWrite: false
						})]
					})
				]
			}, `${id}-${index}`);
		})
	});
}
function TableItems() {
	const match = useGame((s) => s.match);
	const armSteal = useGame((s) => s.armSteal);
	const mode = match?.mode;
	const turn = match?.turn ?? "player";
	const viewer = !match || mode !== "hotseat" ? "player" : match.passLock ?? turn;
	const foe = viewer === "player" ? "dealer" : "player";
	const near = match?.actors[viewer].items ?? [];
	const far = match?.actors[foe].items ?? [];
	const yours = !match || match.resolving || match.passLock || match.interstitial || match.cashout ? void 0 : mode !== "hotseat" && turn !== "player" ? void 0 : (index) => {
		const state = useGame.getState();
		const live = state.match;
		if (!live) return;
		if (live.actors[live.turn].items[index] === "adrenaline") {
			state.arm(index);
			return;
		}
		state.act({
			kind: "item",
			index
		});
	};
	const steal = armSteal === null ? void 0 : (index) => {
		const state = useGame.getState();
		if (state.armSteal === null) return;
		state.act({
			kind: "item",
			index: state.armSteal,
			steal: index
		});
	};
	const n = match?.shells.length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
			items: near,
			z: .48,
			hot: false,
			onPick: yours
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
			items: far,
			z: -.32,
			hot: armSteal !== null,
			onPick: steal
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position: [
				-.62,
				.03,
				.08
			],
			children: Array.from({ length: n }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					-i * .055
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.016,
					.016,
					.045,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#a6843e",
					metalness: .55,
					roughness: .4
				})]
			}, i))
		})
	] });
}
function Charges() {
	const match = useGame((s) => s.match);
	if (!match) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamps, {
		hp: 2,
		max: 2,
		x: .72,
		z: .42
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamps, {
		hp: 2,
		max: 2,
		x: -.72,
		z: -.42
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamps, {
		hp: match.actors.player.hp,
		max: match.actors.player.maxHp,
		x: .72,
		z: .42
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamps, {
		hp: match.actors.dealer.hp,
		max: match.actors.dealer.maxHp,
		x: -.72,
		z: -.42
	})] });
}
function Rig() {
	const reduced = (0, import_react.useMemo)(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
	useFrame(({ camera, clock }, delta) => {
		const d = Math.min(delta, .1);
		const t = clock.elapsedTime;
		present.shake *= Math.exp(-4.5 * d);
		const kick = reduced ? 0 : present.shake;
		camera.position.set(Math.sin(t * .17) * .012 + (Math.random() - .5) * kick * .08, .56 + Math.sin(t * .4) * .004 + (Math.random() - .5) * kick * .05, 1.12);
		camera.lookAt(0, .08, -.15);
	});
	return null;
}
function SceneInner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#070605"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#070605",
				2.6,
				6.5
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			intensity: .32,
			color: "#3a3028"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulbLight, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Host, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shotgun, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableItems, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Charges, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, {})
	] });
}
function Scene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldError, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		className: "stage-canvas",
		shadows: true,
		dpr: [1, 1.5],
		camera: {
			position: [
				0,
				.56,
				1.12
			],
			fov: 36,
			near: .05,
			far: 24
		},
		gl: {
			antialias: true,
			toneMapping: 4
		},
		onCreated: ({ gl }) => {
			gl.toneMappingExposure = 1.12;
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneInner, {})
	}) });
}
//#endregion
export { Scene as default };
