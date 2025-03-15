import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";

// Model component
function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  // Smooth rotation effect
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={18}
      position={[0, 0, 0]}
    />
  );
}

// Loader Component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}

// Main Component
export default function Three1() {
  const modelUrl = "/models/graph.glb";

  return (
    <div className="relative w-full h-[70vh] flex items-center justify-center">
      {/* Glassy Black Background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl rounded-lg shadow-lg border border-white/10"></div>

      <Canvas
        camera={{
          position: [0, 2, 40],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.4} />
        <spotLight position={[15, 20, 10]} angle={0.3} penumbra={1} intensity={1.2} castShadow />

        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={100}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.5}
            dampingFactor={0.08}
            enableDamping={true}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
