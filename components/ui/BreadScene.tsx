"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";
function PratoDePaes() {
    const { scene } = useGLTF("/bakery_products_collection.glb");
    const modelRef = useRef<THREE.Group>(null);
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const nome = child.name.toLowerCase();
                if (nome.includes("shadow") || nome.includes("plane") || nome.includes("ground")) {
                    child.visible = false;
                }
            }
        });
    }, [scene]);
    useFrame((state) => {
        if (!modelRef.current) return;
        const time = state.clock.getElapsedTime();
        modelRef.current.rotation.y = time * 0.1;
        modelRef.current.position.y = Math.sin(time * 1.5) * 0.05;
    });
    return (
        <group ref={modelRef}>
            <primitive object={scene} scale={10} position={[0, -0.5, 0]} />
        </group>
    );
}

export default function BreadScene() {
    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
            <Canvas
                shadows
                camera={{ position: [0, 2, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                className="w-full h-full"
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.9} color="#ffffff" />
                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={1.2}
                        color="#FFFDF9"
                        castShadow
                    />
                    <PratoDePaes />
                    <ContactShadows
                        position={[0, -0.6, 0]}
                        opacity={0.35}
                        scale={10}
                        blur={2}
                        far={2}
                        color="#2B1B12"
                    />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.8}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}