"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Image as DreiImage, Plane } from "@react-three/drei";

interface Props {
  songTitle: string;
  artistName: string;
  albumCoverUrl: string;
  mousePosition?: { x: number; y: number };
}

export default function GlassPolaroidCard({
  songTitle,
  artistName,
  albumCoverUrl,
  mousePosition = { x: 0, y: 0 },
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const targetY = mousePosition.x * Math.PI; // Rotate up to ±180°
      const targetX = mousePosition.y * Math.PI;
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.2, 3.2, 0.3]} />
      <meshPhysicalMaterial
        transparent
        opacity={0.35}
        roughness={0}
        metalness={0.2}
        transmission={1}
        thickness={1}
        reflectivity={0.8}
        clearcoat={1}
        clearcoatRoughness={0}
        ior={1.5}
        color="#ffffff"
      />

      <group position={[0, 0, 0.16]}>
        <Plane args={[1.8, 1.8]} position={[0, 0.4, 0]}>
          <DreiImage url={albumCoverUrl} toneMapped={false} />
        </Plane>
        <Text
          position={[0, -0.7, 0.01]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {songTitle}
        </Text>
        <Text
          position={[0, -1, 0.01]}
          fontSize={0.1}
          color="gray"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {artistName}
        </Text>
      </group>

      <group position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
        <Plane args={[1.8, 1.8]} position={[0, 0.4, 0]}>
          <DreiImage url={albumCoverUrl} toneMapped={false} />
        </Plane>
        <Text
          position={[0, -0.7, 0.01]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {songTitle}
        </Text>
        <Text
          position={[0, -1, 0.01]}
          fontSize={0.1}
          color="gray"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {artistName}
        </Text>
      </group>
    </mesh>
  );
}
