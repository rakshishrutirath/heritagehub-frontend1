import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   TYPES
========================================================= */

type ModelType =
  | "konark-wheel"
  | "temple"
  | "chariot"
  | "dipa"
  | "pillar";

type Theme = "normal" | "moonlight" | "black";

/* =========================================================
   MODEL DATA
========================================================= */

const MODELS: {
  id: ModelType;
  name: string;
  description: string;
}[] = [
  {
    id: "konark-wheel",
    name: "Konark Wheel",
    description:
      "A stylized interactive representation inspired by the Konark Sun Temple wheel.",
  },
  {
    id: "temple",
    name: "Odisha Temple",
    description:
      "A stylized heritage temple structure inspired by Odisha architecture.",
  },
  {
    id: "chariot",
    name: "Heritage Chariot",
    description:
      "A stylized traditional ceremonial chariot.",
  },
  {
    id: "dipa",
    name: "Dipa",
    description:
      "A traditional decorative lamp-inspired heritage object.",
  },
  {
    id: "pillar",
    name: "Temple Pillar",
    description:
      "A decorative temple pillar with traditional geometric details.",
  },
];

/* =========================================================
   MATERIAL
========================================================= */

function HeritageMaterial({
  color,
  wireframe,
}: {
  color: string;
  wireframe: boolean;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.72}
      metalness={0.12}
      wireframe={wireframe}
    />
  );
}

/* =========================================================
   KONARK WHEEL
========================================================= */

function KonarkWheel({
  wireframe,
}: {
  wireframe: boolean;
}) {
  const spokes = 12;

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main wheel */}
      <mesh>
        <torusGeometry args={[2.15, 0.28, 24, 64]} />
        <HeritageMaterial
          color="#b85c2e"
          wireframe={wireframe}
        />
      </mesh>

      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[1.45, 0.15, 20, 48]} />
        <HeritageMaterial
          color="#d28a4d"
          wireframe={wireframe}
        />
      </mesh>

      {/* Center */}
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.32, 32]} />
        <HeritageMaterial
          color="#9c4b26"
          wireframe={wireframe}
        />
      </mesh>

      {/* Spokes */}
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i / spokes) * Math.PI * 2;

        return (
          <mesh
            key={i}
            rotation={[0, 0, angle]}
            position={[
              Math.cos(angle) * 1.08,
              Math.sin(angle) * 1.08,
              0,
            ]}
          >
            <boxGeometry args={[0.16, 2.05, 0.20]} />
            <HeritageMaterial
              color="#c46a35"
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* Decorative dots */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;

        return (
          <mesh
            key={`dot-${i}`}
            position={[
              Math.cos(angle) * 1.78,
              Math.sin(angle) * 1.78,
              0.18,
            ]}
          >
            <sphereGeometry args={[0.10, 12, 12]} />
            <HeritageMaterial
              color="#e19a59"
              wireframe={wireframe}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* =========================================================
   TEMPLE
========================================================= */

function Temple({
  wireframe,
}: {
  wireframe: boolean;
}) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[4.5, 0.5, 3.4]} />
        <HeritageMaterial
          color="#b85c2e"
          wireframe={wireframe}
        />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[3.6, 2.1, 2.6]} />
        <HeritageMaterial
          color="#c8783c"
          wireframe={wireframe}
        />
      </mesh>

      {/* Temple tower */}
      <mesh position={[0, 3.35, 0]}>
        <coneGeometry args={[1.65, 3.0, 8]} />
        <HeritageMaterial
          color="#a84e27"
          wireframe={wireframe}
        />
      </mesh>

      {/* Tower tip */}
      <mesh position={[0, 5.05, 0]}>
        <coneGeometry args={[0.45, 1.2, 8]} />
        <HeritageMaterial
          color="#d58a48"
          wireframe={wireframe}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.1, 1.34]}>
        <boxGeometry args={[0.85, 1.5, 0.12]} />
        <HeritageMaterial
          color="#512717"
          wireframe={wireframe}
        />
      </mesh>

      {/* Side pillars */}
      {[-1.25, 1.25].map((x) => (
        <mesh
          key={x}
          position={[x, 1.2, 1.42]}
        >
          <cylinderGeometry
            args={[0.18, 0.22, 1.8, 16]}
          />
          <HeritageMaterial
            color="#d28a4d"
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Decorative rings */}
      {[2.55, 2.95, 3.35, 3.75].map(
        (y, index) => (
          <mesh
            key={index}
            position={[0, y, 0]}
          >
            <torusGeometry
              args={[1.35 - index * 0.20, 0.10, 16, 32]}
            />
            <HeritageMaterial
              color="#e19a59"
              wireframe={wireframe}
            />
          </mesh>
        )
      )}
    </group>
  );
}

/* =========================================================
   CHARIOT
========================================================= */

function Chariot({
  wireframe,
}: {
  wireframe: boolean;
}) {
  return (
    <group>
      {/* Platform */}
      <RoundedBox
        args={[4, 0.6, 2.8]}
        radius={0.15}
        smoothness={4}
        position={[0, 1.2, 0]}
      >
        <HeritageMaterial
          color="#a94725"
          wireframe={wireframe}
        />
      </RoundedBox>

      {/* Upper cabin */}
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[1.9, 3.2, 8]} />
        <HeritageMaterial
          color="#c66a35"
          wireframe={wireframe}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.35, 0]}>
        <coneGeometry args={[2.1, 0.8, 8]} />
        <HeritageMaterial
          color="#8f3d21"
          wireframe={wireframe}
        />
      </mesh>

      {/* Wheels */}
      {[-1.75, 1.75].map((x) => (
        <group
          key={x}
          position={[x, 0.7, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <mesh>
            <cylinderGeometry
              args={[1, 1, 0.35, 32]}
            />
            <HeritageMaterial
              color="#8a3d22"
              wireframe={wireframe}
            />
          </mesh>

          <mesh position={[0, 0, 0.2]}>
            <torusGeometry
              args={[0.72, 0.12, 16, 32]}
            />
            <HeritageMaterial
              color="#e19a59"
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* Pole */}
      <mesh position={[0, 5.3, 0]}>
        <cylinderGeometry
          args={[0.12, 0.12, 2, 16]}
        />
        <HeritageMaterial
          color="#d28a4d"
          wireframe={wireframe}
        />
      </mesh>

      {/* Flag */}
      <mesh position={[0.55, 6.0, 0]}>
        <coneGeometry args={[0.5, 1, 3]} />
        <HeritageMaterial
          color="#d65c32"
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   DIPA
========================================================= */

function Dipa({
  wireframe,
}: {
  wireframe: boolean;
}) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry
          args={[1.4, 1.7, 0.7, 32]}
        />
        <HeritageMaterial
          color="#c46a35"
          wireframe={wireframe}
        />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry
          args={[0.35, 0.55, 2.5, 24]}
        />
        <HeritageMaterial
          color="#d58a48"
          wireframe={wireframe}
        />
      </mesh>

      {/* Bowl */}
      <mesh position={[0, 3.0, 0]}>
        <sphereGeometry
          args={[1.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <HeritageMaterial
          color="#b85c2e"
          wireframe={wireframe}
        />
      </mesh>

      {/* Flame */}
      <mesh position={[0, 4.15, 0]}>
        <coneGeometry args={[0.35, 1.4, 16]} />
        <HeritageMaterial
          color="#e8a34f"
          wireframe={wireframe}
        />
      </mesh>

      {/* Side decorations */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 1.1, 2.8, 0]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <HeritageMaterial
            color="#d58a48"
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   PILLAR
========================================================= */

function Pillar({
  wireframe,
}: {
  wireframe: boolean;
}) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.6, 0.6, 2.6]} />
        <HeritageMaterial
          color="#a94f28"
          wireframe={wireframe}
        />
      </mesh>

      {/* Lower section */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry
          args={[1, 1, 1.5, 8]}
        />
        <HeritageMaterial
          color="#c46a35"
          wireframe={wireframe}
        />
      </mesh>

      {/* Main shaft */}
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry
          args={[0.72, 0.82, 3.8, 8]}
        />
        <HeritageMaterial
          color="#d58a48"
          wireframe={wireframe}
        />
      </mesh>

      {/* Decorative rings */}
      {[1.9, 4.5].map((y) => (
        <mesh
          key={y}
          position={[0, y, 0]}
        >
          <torusGeometry
            args={[0.82, 0.15, 16, 32]}
          />
          <HeritageMaterial
            color="#9b4424"
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Capital */}
      <mesh position={[0, 5.3, 0]}>
        <cylinderGeometry
          args={[1.35, 0.8, 0.8, 8]}
        />
        <HeritageMaterial
          color="#b85c2e"
          wireframe={wireframe}
        />
      </mesh>

      {/* Top */}
      <mesh position={[0, 5.9, 0]}>
        <coneGeometry args={[1.4, 0.8, 8]} />
        <HeritageMaterial
          color="#d58a48"
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   MODEL SWITCHER
========================================================= */

function HeritageModel({
  type,
  wireframe,
}: {
  type: ModelType;
  wireframe: boolean;
}) {
  switch (type) {
    case "konark-wheel":
      return <KonarkWheel wireframe={wireframe} />;

    case "temple":
      return <Temple wireframe={wireframe} />;

    case "chariot":
      return <Chariot wireframe={wireframe} />;

    case "dipa":
      return <Dipa wireframe={wireframe} />;

    case "pillar":
      return <Pillar wireframe={wireframe} />;

    default:
      return <Temple wireframe={wireframe} />;
  }
}

/* =========================================================
   3D SCENE
========================================================= */

function Scene({
  model,
  wireframe,
  theme,
}: {
  model: ModelType;
  wireframe: boolean;
  theme: Theme;
}) {
  const background = useMemo(() => {
    if (theme === "black") return "#050505";
    if (theme === "moonlight") return "#07101f";
    return "#f3eee5";
  }, [theme]);

  const floorColor =
    theme === "black"
      ? "#111111"
      : theme === "moonlight"
      ? "#0d1728"
      : "#ddd3c4";

  return (
    <Canvas
      camera={{
        position: [8, 6, 10],
        fov: 45,
      }}
      style={{
        width: "100%",
        height: "100%",
        background,
      }}
      shadows
      dpr={[1, 2]}
    >
      <color
        attach="background"
        args={[background]}
      />

      <ambientLight
        intensity={
          theme === "black"
            ? 0.7
            : theme === "moonlight"
            ? 0.8
            : 1.2
        }
      />

      <directionalLight
        position={[5, 8, 5]}
        intensity={
          theme === "moonlight"
            ? 2.2
            : 2.5
        }
        castShadow
      />

      <directionalLight
        position={[-5, 4, -4]}
        intensity={1}
      />

      {theme === "moonlight" && (
        <pointLight
          position={[0, 7, 4]}
          intensity={8}
          distance={15}
        />
      )}

      <group position={[0, -1.1, 0]}>
        <HeritageModel
          type={model}
          wireframe={wireframe}
        />
      </group>

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.12, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={1}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.45}
        scale={10}
        blur={2.5}
        far={6}
      />

      <Environment preset="city" />

      {/* 360-degree rotation */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={18}
        target={[0, 2, 0]}
      />
    </Canvas>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ThreeHeritagePage() {
  const [selectedModel, setSelectedModel] =
    useState<ModelType>("konark-wheel");

  const [theme, setTheme] =
    useState<Theme>("normal");

  const [wireframe, setWireframe] =
    useState(false);

  const currentModel = MODELS.find(
    (item) => item.id === selectedModel
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          theme === "black"
            ? "#050505"
            : theme === "moonlight"
            ? "#07101f"
            : "#f7f3ec",
        color:
          theme === "normal"
            ? "#261810"
            : "#f5f5f5",
        paddingBottom: 60,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          padding: "30px 5%",
          borderBottom:
            theme === "normal"
              ? "1px solid #ddd"
              : "1px solid #273044",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.65,
              marginBottom: 10,
            }}
          >
            HeritageHub
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, serif",
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 500,
            }}
          >
            3D Heritage Gallery
          </h1>

          <p
            style={{
              maxWidth: 720,
              lineHeight: 1.7,
              opacity: 0.75,
              marginTop: 15,
            }}
          >
            Explore Odisha-inspired heritage objects
            in an interactive 3D gallery. Drag to rotate,
            scroll to zoom, and switch between visual modes.
          </p>
        </div>
      </div>

      {/* =================================================
          CONTROLS
      ================================================= */}

      <div
        style={{
          maxWidth: 1400,
          margin: "25px auto",
          padding: "0 5%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          {/* Models */}

          {MODELS.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setSelectedModel(item.id)
              }
              style={{
                padding: "11px 16px",
                borderRadius: 999,
                border:
                  selectedModel === item.id
                    ? "2px solid #a64b28"
                    : "1px solid #999",
                background:
                  selectedModel === item.id
                    ? "#a64b28"
                    : "transparent",
                color:
                  selectedModel === item.id
                    ? "#fff"
                    : "inherit",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Visual controls */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 15,
          }}
        >
          <button
            onClick={() => setTheme("normal")}
            style={controlButton(theme === "normal")}
          >
            ☀ Normal
          </button>

          <button
            onClick={() => setTheme("moonlight")}
            style={controlButton(theme === "moonlight")}
          >
            ☾ Moonlight
          </button>

          <button
            onClick={() => setTheme("black")}
            style={controlButton(theme === "black")}
          >
            ● Black
          </button>

          <button
            onClick={() =>
              setWireframe((value) => !value)
            }
            style={controlButton(wireframe)}
          >
            {wireframe
              ? "▦ Solid Mode"
              : "⌁ Wireframe Mode"}
          </button>
        </div>
      </div>

      {/* =================================================
          MODEL VIEWER
      ================================================= */}

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 5%",
        }}
      >
        <div
          style={{
            position: "relative",
            height:
              "min(70vh, 720px)",
            minHeight: 500,
            borderRadius: 18,
            overflow: "hidden",
            border:
              theme === "normal"
                ? "1px solid #d5cec4"
                : "1px solid #273044",
            boxShadow:
              theme === "black"
                ? "0 20px 80px rgba(0,0,0,.8)"
                : "0 20px 60px rgba(0,0,0,.15)",
          }}
        >
          <Scene
            model={selectedModel}
            wireframe={wireframe}
            theme={theme}
          />

          {/* Viewer label */}

          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              padding: "12px 16px",
              borderRadius: 12,
              background:
                theme === "normal"
                  ? "rgba(255,255,255,.82)"
                  : "rgba(0,0,0,.55)",
              backdropFilter: "blur(10px)",
              color:
                theme === "normal"
                  ? "#261810"
                  : "#fff",
              pointerEvents: "none",
            }}
          >
            <strong>
              {currentModel?.name}
            </strong>

            <div
              style={{
                fontSize: 12,
                marginTop: 5,
                opacity: 0.7,
              }}
            >
              Drag to rotate • Scroll to zoom
            </div>
          </div>

          {/* Mode indicator */}

          <div
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              padding: "10px 14px",
              borderRadius: 999,
              background:
                theme === "normal"
                  ? "rgba(255,255,255,.82)"
                  : "rgba(0,0,0,.55)",
              backdropFilter: "blur(10px)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {wireframe
              ? "WIREFRAME"
              : "SOLID"}
          </div>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div
          style={{
            marginTop: 20,
            padding: 25,
            borderRadius: 16,
            background:
              theme === "normal"
                ? "#eee7dd"
                : theme === "moonlight"
                ? "#101b2d"
                : "#111",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            Selected Heritage Object
          </div>

          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 30,
              margin: "10px 0",
            }}
          >
            {currentModel?.name}
          </h2>

          <p
            style={{
              margin: 0,
              lineHeight: 1.7,
              opacity: 0.75,
            }}
          >
            {currentModel?.description}
          </p>
        </div>

        {/* =================================================
            INSTRUCTIONS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 15,
            marginTop: 20,
          }}
        >
          <InfoCard
            number="01"
            title="Rotate"
            text="Click and drag the model to inspect it from every direction."
            theme={theme}
          />

          <InfoCard
            number="02"
            title="Zoom"
            text="Use your mouse wheel or pinch on mobile to zoom."
            theme={theme}
          />

          <InfoCard
            number="03"
            title="Wireframe"
            text="Turn on Wireframe Mode to reveal the 3D geometry."
            theme={theme}
          />

          <InfoCard
            number="04"
            title="Lighting"
            text="Try Normal, Moonlight and Black backgrounds."
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function controlButton(active: boolean) {
  return {
    padding: "10px 16px",
    borderRadius: 999,
    border: active
      ? "2px solid #a64b28"
      : "1px solid #888",
    background: active
      ? "#a64b28"
      : "transparent",
    color: active
      ? "#fff"
      : "inherit",
    cursor: "pointer",
    fontWeight: 600,
  };
}

function InfoCard({
  number,
  title,
  text,
  theme,
}: {
  number: string;
  title: string;
  text: string;
  theme: Theme;
}) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 15,
        background:
          theme === "normal"
            ? "#eee7dd"
            : theme === "moonlight"
            ? "#101b2d"
            : "#111",
      }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.55,
          letterSpacing: 2,
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "10px 0",
          fontFamily: "Georgia, serif",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          lineHeight: 1.6,
          opacity: 0.7,
          fontSize: 14,
        }}
      >
        {text}
      </p>
    </div>
  );
}