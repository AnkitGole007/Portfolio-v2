'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  delay?: number;
}

function NeuralNode({ position, scale = 0.08, color = '#0a84ff', delay = 0 }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay;
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(t * 2) * 0.1));
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[1, 16, 16]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity?: number;
}

function Connection({ start, end, opacity = 0.3 }: ConnectionProps) {
  return (
    <Line
      points={[start, end]}
      color="#0a84ff"
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  );
}

function NeuralNetworkScene() {
  const groupRef = useRef<THREE.Group>(null);

  const layers = useMemo(() => {
    const layerConfig = [4, 6, 8, 6, 4];
    const spacing = 1.8;
    const nodePositions: [number, number, number][][] = [];

    layerConfig.forEach((nodeCount, layerIndex) => {
      const layerNodes: [number, number, number][] = [];
      const xPos = (layerIndex - (layerConfig.length - 1) / 2) * spacing;

      for (let i = 0; i < nodeCount; i++) {
        const yPos = (i - (nodeCount - 1) / 2) * 0.6;
        const zPos = (Math.random() - 0.5) * 0.3;
        layerNodes.push([xPos, yPos, zPos]);
      }
      nodePositions.push(layerNodes);
    });

    return nodePositions;
  }, []);

  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number] }[] = [];

    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayer = layers[i];
      const nextLayer = layers[i + 1];

      currentLayer.forEach((startPos) => {
        const connectionCount = Math.min(3, nextLayer.length);
        const shuffled = [...nextLayer].sort(() => Math.random() - 0.5);

        for (let j = 0; j < connectionCount; j++) {
          conns.push({ start: startPos, end: shuffled[j] });
        }
      });
    }

    return conns;
  }, [layers]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  const colors = ['#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f', '#30d158'];

  return (
    <group ref={groupRef}>
      {connections.map((conn, idx) => (
        <Connection
          key={`conn-${idx}`}
          start={conn.start}
          end={conn.end}
          opacity={0.2}
        />
      ))}
      {layers.map((layer, layerIdx) =>
        layer.map((pos, nodeIdx) => (
          <NeuralNode
            key={`node-${layerIdx}-${nodeIdx}`}
            position={pos}
            color={colors[layerIdx % colors.length]}
            delay={layerIdx * 0.5 + nodeIdx * 0.2}
            scale={0.06 + Math.random() * 0.03}
          />
        ))
      )}
    </group>
  );
}

function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#0a84ff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function NeuralNetwork3D() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.log('WebGL context lost - will attempt recovery');
          });
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored');
          });
        }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 15]} />

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#0a84ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#5e5ce6" />

        <NeuralNetworkScene />
        <DataParticles />
      </Canvas>
    </div>
  );
}
