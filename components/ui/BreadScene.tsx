"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";

function hash(n: number): number {
    let x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
}

function noise3D(x: number, y: number, z: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);
    const fx = x - ix;
    const fy = y - iy;
    const fz = z - iz;

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const uz = fz * fz * (3 - 2 * fz);

    const n000 = hash(ix + iy * 157 + iz * 113);
    const n100 = hash(ix + 1 + iy * 157 + iz * 113);
    const n010 = hash(ix + (iy + 1) * 157 + iz * 113);
    const n110 = hash(ix + 1 + (iy + 1) * 157 + iz * 113);
    const n001 = hash(ix + iy * 157 + (iz + 1) * 113);
    const n101 = hash(ix + 1 + iy * 157 + (iz + 1) * 113);
    const n011 = hash(ix + (iy + 1) * 157 + (iz + 1) * 113);
    const n111 = hash(ix + 1 + (iy + 1) * 157 + (iz + 1) * 113);

    const x0 = n000 + ux * (n100 - n000);
    const x1 = n010 + ux * (n110 - n010);
    const x2 = n001 + ux * (n101 - n001);
    const x3 = n011 + ux * (n111 - n011);

    const y0 = x0 + uy * (x1 - x0);
    const y1 = x2 + uy * (x3 - x2);

    return y0 + uz * (y1 - y0);
}

function fbm(x: number, y: number, z: number, octaves: number): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;

    for (let i = 0; i < octaves; i++) {
        value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

function SourdoughMesh() {
    const groupRef = useRef<THREE.Group>(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null);

    useEffect(() => {
        if (!geometryRef.current) return;
        const geom = geometryRef.current;
        const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
        const v = new THREE.Vector3();

        const colorFlour = new THREE.Color("#E8D1A7");
        const colorPale = new THREE.Color("#F5E6C8");
        const colorGolden = new THREE.Color("#D9A05B");
        const colorDeep = new THREE.Color("#A06830");
        const colorDark = new THREE.Color("#73441F");
        const colorToast = new THREE.Color("#4A2510");
        const colorChar = new THREE.Color("#2E1508");

        const colors: number[] = [];

        for (let i = 0; i < posAttr.count; i++) {
            v.fromBufferAttribute(posAttr, i);

            const origLen = v.length();
            const norm = v.clone().normalize();

            const largeBumps = fbm(v.x * 2.2, v.y * 2.2, v.z * 2.2, 4) * 0.22;
            const mediumBumps = fbm(v.x * 5.5, v.y * 5.5, v.z * 5.5, 3) * 0.08;
            const fineCracks = fbm(v.x * 15, v.y * 15, v.z * 15, 2) * 0.025;
            const microGrain = fbm(v.x * 35, v.y * 35, v.z * 35, 1) * 0.012;
            const tinyBlisters = (Math.sin(v.x * 80) * Math.cos(v.z * 80) > 0.8) ? 0.005 : 0;

            let scoreOffset = 0;
            const scoreCurveZ = v.x * v.x * 0.15 + Math.sin(v.x * 3) * 0.05;
            const distToScore = Math.abs(v.z - scoreCurveZ);
            const scoreWidth = 0.24;
            const isUpperHalf = v.y > 0.05;

            if (isUpperHalf && distToScore < scoreWidth) {
                const t = 1 - distToScore / scoreWidth;
                const smoothT = t * t * (3 - 2 * t);

                scoreOffset = -0.18 * smoothT;

                if (v.z > scoreCurveZ && distToScore < scoreWidth * 0.6) {
                    const earT = 1 - distToScore / (scoreWidth * 0.6);
                    scoreOffset += 0.32 * earT * earT;
                }
            }

            const score2Dist = Math.abs(v.x + v.z * 0.4 - 0.5);
            if (isUpperHalf && score2Dist < 0.07 && v.x > 0.3 && v.x < 0.8) {
                scoreOffset -= 0.05 * (1 - score2Dist / 0.07);
            }

            const totalDisplacement = largeBumps + mediumBumps + fineCracks + microGrain + tinyBlisters + scoreOffset;
            v.addScaledVector(norm, totalDisplacement);

            posAttr.setXYZ(i, v.x, v.y, v.z);

            const displacedLen = v.length();
            const delta = displacedLen - origLen;
            const activeColor = colorGolden.clone();

            if (isUpperHalf && distToScore < scoreWidth * 0.5) {
                const t = 1 - distToScore / (scoreWidth * 0.5);
                if (v.z <= scoreCurveZ || distToScore < scoreWidth * 0.15) {
                    activeColor.lerp(colorFlour, t * 0.9);
                } else {
                    activeColor.lerp(colorDeep, t * 0.5);
                }
            } else if (delta < -0.03) {
                const t = Math.min(Math.abs(delta) / 0.14, 1);
                activeColor.lerp(colorPale, t * 0.7);
            } else if (delta > 0.05) {
                const t = Math.min(delta / 0.20, 1);
                activeColor.lerp(colorDark, t * 0.85);

                if (v.y > 0.3) {
                    const charT = (v.y - 0.3) / 0.7;
                    activeColor.lerp(colorToast, charT * 0.6);
                }

                if (tinyBlisters > 0) activeColor.lerp(colorChar, 0.4);
            } else {
                const t = Math.max(0, delta) / 0.05;
                activeColor.lerp(colorDeep, t * 0.45);
            }

            if (v.y < -0.25) {
                const bottomT = Math.min((-0.25 - v.y) / 0.5, 1);
                activeColor.lerp(colorChar, bottomT * 0.7);
            }

            const colorNoise = fbm(v.x * 8, v.y * 8, v.z * 8, 2) * 0.1;
            activeColor.r = Math.min(1, Math.max(0, activeColor.r + colorNoise - 0.05));
            activeColor.g = Math.min(1, Math.max(0, activeColor.g + colorNoise * 0.5 - 0.04));

            colors.push(activeColor.r, activeColor.g, activeColor.b);
        }

        posAttr.needsUpdate = true;
        geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geom.computeVertexNormals();
    }, []);

    const sesameSeeds = useMemo(() => {
        const list = [];
        const count = 45;

        for (let i = 0; i < count; i++) {
            const phi = Math.random() * (Math.PI / 3.2);
            const theta = Math.random() * Math.PI * 2;

            const sx = Math.sin(phi) * Math.cos(theta);
            const sy = Math.cos(phi);
            const sz = Math.sin(phi) * Math.sin(theta);

            const displacement =
                fbm(sx * 1.8, sy * 1.8, sz * 1.8, 3) * 0.18 +
                fbm(sx * 4.5, sy * 4.5, sz * 4.5, 2) * 0.06;

            const totalR = 1.0 + displacement;

            const px = sx * totalR;
            const py = sy * totalR;
            const pz = sz * totalR;

            const rx = Math.random() * 0.4 - 0.2;
            const ry = theta + Math.PI / 2;
            const rz = phi + Math.random() * 0.3 - 0.15;

            list.push({
                position: [px, py, pz] as [number, number, number],
                rotation: [rz, ry, rx] as [number, number, number],
                scale: [0.035, 0.018, 0.08] as [number, number, number],
            });
        }
        return list;
    }, []);

    const flourDust = useMemo(() => {
        const list = [];
        const count = 60;

        for (let i = 0; i < count; i++) {
            const phi = Math.random() * (Math.PI / 2.5);
            const theta = Math.random() * Math.PI * 2;

            const sx = Math.sin(phi) * Math.cos(theta);
            const sy = Math.cos(phi);
            const sz = Math.sin(phi) * Math.sin(theta);

            const displacement =
                fbm(sx * 1.8, sy * 1.8, sz * 1.8, 3) * 0.18 +
                fbm(sx * 4.5, sy * 4.5, sz * 4.5, 2) * 0.06;

            const totalR = 1.0 + displacement + 0.015;

            list.push({
                position: [sx * totalR * 1.15, sy * totalR * 0.78, sz * totalR * 0.98] as [number, number, number],
                scale: (Math.random() * 0.012 + 0.006) as number,
            });
        }
        return list;
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        groupRef.current.rotation.y = time * 0.05;
        groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
        groupRef.current.position.x = 0;
    });

    return (
        <group ref={groupRef}>
            <mesh castShadow receiveShadow scale={[1.15, 0.78, 0.98]}>
                <sphereGeometry ref={geometryRef} args={[1.0, 128, 128]} />
                <meshStandardMaterial
                    vertexColors
                    roughness={0.85}
                    metalness={0.1}
                    envMapIntensity={1.5}
                />
            </mesh>

            {flourDust.map((dust, idx) => (
                <mesh
                    key={`flour-${idx}`}
                    position={dust.position}
                >
                    <sphereGeometry args={[dust.scale * 0.6, 4, 4]} />
                    <meshStandardMaterial
                        color="#F5E6C8"
                        roughness={1.0}
                        metalness={0.0}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function BreadScene() {
    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
            <Canvas
                shadows
                camera={{ position: [0, 0, 4.2], fov: 36 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
                className="w-full h-full"
            >
                <Suspense fallback={null}>
                    <Environment preset="apartment" />
                    <ambientLight intensity={0.4} color="#F5EFE4" />
                    <pointLight
                        position={[2.5, -2.5, -1]}
                        intensity={10}
                        color="#FF7F00"
                        castShadow
                        decay={1.5}
                    />
                    <pointLight
                        position={[-2, -2, -0.5]}
                        intensity={6}
                        color="#E8B468"
                        decay={2}
                    />
                    <directionalLight
                        position={[-2, 4, 3]}
                        intensity={2.0}
                        color="#FFFDF9"
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <pointLight
                        position={[-2, 1, -3]}
                        intensity={4}
                        color="#FFE0B2"
                        decay={2}
                    />
                    <SourdoughMesh />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        target={[0, 0, 0]}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                        rotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}