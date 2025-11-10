'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  PerspectiveCamera,
  OrbitControls,
  Environment,
  ContactShadows,
  RoundedBox,
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Howl } from 'howler'

// Аудио эффект открытия
const createOpenSound = () => {
  try {
    const sound = new Howl({
      src: [],
      volume: 0.3,
      html5: true,
    })
    // Генерируем звук программно
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch (e) {
    // Игнорируем ошибки аудио
  }
}

// Определение типа устройства
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

const isTablet = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

// Компонент корпуса кошелька - улучшенный с глубиной и деталями
function WalletBody({ hovered, isOpen }: { hovered: boolean; isOpen: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const innerGlowRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
  const backWallRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const innerCavityRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (materialRef.current) {
      // Пульсация внутреннего свечения (каждые 3s)
      const pulse = Math.sin(state.clock.elapsedTime * (Math.PI / 3)) * 0.1 + 0.9
      materialRef.current.emissiveIntensity = isOpen ? 0.4 * pulse : (hovered ? 0.25 * pulse : 0.2 * pulse)
      
      // Градиентный цвет от #0090FF к #00F6FF (Filecoin)
      const gradientShift = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      materialRef.current.emissive = new THREE.Color().lerpColors(
        new THREE.Color('#0090FF'),
        new THREE.Color('#00F6FF'),
        0.3 + gradientShift
      )
      
      // Вариации шероховатости для реализма (не однородная)
      const roughnessVariation = Math.sin(state.clock.elapsedTime * 0.3 + state.camera.position.x * 0.1) * 0.05
      materialRef.current.roughness = 0.3 + roughnessVariation
      
      // Вариации clearcoat для бликов
      const clearcoatVariation = Math.sin(state.clock.elapsedTime * 0.4) * 0.1 + 0.8
      materialRef.current.clearcoat = clearcoatVariation
    }
    
    if (glowMaterialRef.current) {
      // Слабое свечение по периметру (0.2-0.4 intensity pulse)
      const glowPulse = Math.sin(state.clock.elapsedTime * (Math.PI / 3)) * 0.1 + 0.3
      glowMaterialRef.current.opacity = glowPulse
      glowMaterialRef.current.emissiveIntensity = glowPulse * 0.8
    }
    
    if (backWallRef.current) {
      // Металлик с мягким бликованием и вариациями
      const shimmer = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 0.1
      backWallRef.current.roughness = 0.1 + shimmer
      
      // Вариации envMapIntensity для реалистичных отражений
      const reflectionVariation = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 2.0
      backWallRef.current.envMapIntensity = reflectionVariation
    }
  })

  return (
    <group>
      {/* Микродетали - вариации поверхности для реализма */}
      <mesh position={[0, 0, 0.71]} castShadow>
        <planeGeometry args={[2.1, 0.9]} />
        <meshStandardMaterial
          color="#0090FF"
          transparent
          opacity={0.03}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Блики на поверхности (для реалистичных отражений) */}
      <mesh position={[0.5, 0.3, 0.71]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.1}
          roughness={0.1}
        />
      </mesh>
      
      {/* Основной корпус - матовый акрил (толщина стенок 2-3x больше) */}
      <RoundedBox
        ref={bodyRef}
        args={[2.2, 1.1, 1.4]} // Увеличена высота для толщины (2-3x)
        radius={0.15} // Скруглённые углы
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          ref={materialRef}
          metalness={0.2}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          ior={1.45}
          color="#0090FF" // Основной цвет корпуса (Filecoin blue)
          envMapIntensity={1.8} // Усиленные отражения
          emissive="#0090FF"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          // Вариации для реализма
          flatShading={false}
        />
      </RoundedBox>
      
      {/* Градиентный слой для внутренней подсветки с вариациями */}
      <RoundedBox
        args={[2.15, 0.95, 1.35]}
        radius={0.14}
        smoothness={8}
        position={[0, 0, 0.01]}
      >
        <meshPhysicalMaterial
          color="#0090FF"
          emissive="#00F6FF"
          emissiveIntensity={0.4} // Усилен
          transmission={0.5} // Усилен
          thickness={0.3}
          transparent
          opacity={0.6} // Усилен
          roughness={0.2} // Более гладкий
          clearcoat={0.9}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>
      
      {/* Дополнительный градиентный слой для глубины */}
      <RoundedBox
        args={[2.1, 0.9, 1.3]}
        radius={0.13}
        smoothness={8}
        position={[0, 0, 0.02]}
      >
        <meshPhysicalMaterial
          color="#0090FF"
          emissive="#00F6FF"
          emissiveIntensity={0.2}
          transmission={0.3}
          thickness={0.2}
          transparent
          opacity={0.3}
          roughness={0.15}
        />
      </RoundedBox>
      
      {/* Внутренняя выемка под токены с 3D-подсветкой (неоновая рамка) */}
      <RoundedBox
        ref={innerCavityRef}
        args={[1.9, 0.5, 1.1]}
        radius={0.12}
        smoothness={6}
        position={[0, 0.05, 0.05]}
      >
        <meshPhysicalMaterial
          color="#0a0a0f"
          roughness={0.15}
          clearcoat={1}
          metalness={0.1}
          envMapIntensity={1.5}
        />
      </RoundedBox>
      
      {/* Неоновая рамка внутри (3D-подсветка) */}
      <RoundedBox
        args={[1.95, 0.55, 1.15]}
        radius={0.13}
        smoothness={6}
        position={[0, 0.05, 0.06]}
      >
        <meshStandardMaterial
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </RoundedBox>
      
      {/* Задняя стенка - хром / металл */}
      <mesh position={[0, 0, -0.7]} castShadow receiveShadow>
        <RoundedBox args={[2.15, 1.05, 0.05]} radius={0.14} smoothness={8}>
          <meshPhysicalMaterial
            ref={backWallRef}
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2.0}
          />
        </RoundedBox>
      </mesh>
      
      {/* Внутренний glow-эффект (рассеянный, как от электроники) */}
      <RoundedBox
        ref={innerGlowRef}
        args={[1.95, 0.45, 1.2]}
        radius={0.12}
        smoothness={6}
        position={[0, 0.1, 0.02]}
      >
        <meshStandardMaterial
          ref={glowMaterialRef}
          color="#D1FFF5"
          emissive="#D1FFF5"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </RoundedBox>
      
      {/* Неоновое свечение контура (слабое свечение по периметру) */}
      <RoundedBox
        args={[2.25, 0.95, 1.45]}
        radius={0.16}
        smoothness={8}
      >
        <meshStandardMaterial
          color="#00F6FF"
          emissive="#00FFD4"
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </RoundedBox>
      
      {/* Внутренний разъём / слот (тонкая линия, как порт) */}
      <mesh position={[0.8, -0.35, 0.71]}>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Маленький пиктограммный символ блокчейна (в углу, barely visible) */}
      <mesh position={[-1.0, 0.35, 0.71]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color="#0090FF"
          emissive="#0090FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

// Компонент крышки - улучшенный с glow по краю
function WalletLid({ isOpen, hovered }: { isOpen: boolean; hovered: boolean }) {
  const lidRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const edgeGlowRef = useRef<THREE.MeshStandardMaterial>(null)
  const seamGlowRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (lidRef.current) {
      // Плавное открытие крышки (rotationX ≈ -40°)
      const targetRotation = isOpen ? -0.7 : 0
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetRotation,
        0.12
      )
      
      // Hover: glow усиливается, крышка слегка открывается
      if (hovered && !isOpen) {
        lidRef.current.rotation.y = THREE.MathUtils.lerp(lidRef.current.rotation.y, 0.087, 0.1)
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -0.1, 0.1)
      } else if (!isOpen) {
        lidRef.current.rotation.y = THREE.MathUtils.lerp(lidRef.current.rotation.y, 0, 0.1)
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, 0, 0.1)
      }
    }
    
    if (materialRef.current) {
      // Shimmer эффект при движении камеры (более выраженный)
      const shimmer = Math.sin(state.clock.elapsedTime * 2 + state.camera.position.x * 0.1) * 0.15 + 0.85
      materialRef.current.clearcoatRoughness = 0.05 + shimmer * 0.08
      
      // Вариации roughness для реалистичных бликов
      const roughnessVariation = Math.sin(state.clock.elapsedTime * 1.5) * 0.03 + 0.08
      materialRef.current.roughness = roughnessVariation
      
      // Усиление свечения при hover (блик по верхней крышке)
      materialRef.current.emissiveIntensity = hovered ? 0.6 : 0.4
      
      // Вариации envMapIntensity для динамичных отражений
      const reflectionPulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.3 + 2.0
      materialRef.current.envMapIntensity = reflectionPulse
    }
    
    if (edgeGlowRef.current) {
      // Лёгкое свечение по краю (glow)
      const glowPulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.1 + 0.5
      edgeGlowRef.current.opacity = glowPulse * 0.6
      edgeGlowRef.current.emissiveIntensity = glowPulse
    }
    
    if (seamGlowRef.current) {
      // Тонкая засветка по шву крышки
      const seamPulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.6
      seamGlowRef.current.opacity = seamPulse * 0.4
    }
  })

  return (
    <group ref={lidRef} position={[0, 0.35, 0]}>
      {/* Основная крышка - прозрачное стекло */}
      <RoundedBox
        args={[2.2, 0.12, 1.3]}
        radius={0.15}
        smoothness={8}
        castShadow
      >
        <meshPhysicalMaterial
          ref={materialRef}
          transmission={0.85} // Более прозрачное стекло
          thickness={0.5} // thickness: 0.4-0.6
          roughness={0.08} // Более гладкое для реалистичных отражений
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05} // Более глянцевое
          color="#0a0a0f"
          emissive="#00F6FF"
          emissiveIntensity={0.4}
          transparent
          opacity={0.75}
          envMapIntensity={2.0} // Усиленные отражения
          ior={1.4} // IOR: 1.4
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      
      {/* Текст "F" (FilVault) на крышке - выгравированный/подсвеченный */}
      <group position={[0, 0, 0.66]}>
        {/* Свечение вокруг текста */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.8, 0.12]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={0.8}
          transparent
            opacity={0.3}
        />
      </mesh>
        {/* Буква "F" (FilVault) - упрощённая геометрия */}
        <group>
          {/* F - вертикальная линия */}
          <mesh position={[-0.05, 0, 0]}>
            <boxGeometry args={[0.015, 0.08, 0.01]} />
            <meshStandardMaterial color="#33C3FF" emissive="#33C3FF" emissiveIntensity={0.7} />
          </mesh>
          {/* F - верхняя горизонтальная линия */}
          <mesh position={[0.02, 0.03, 0]}>
            <boxGeometry args={[0.05, 0.015, 0.01]} />
            <meshStandardMaterial color="#33C3FF" emissive="#33C3FF" emissiveIntensity={0.7} />
          </mesh>
          {/* F - средняя горизонтальная линия */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.04, 0.015, 0.01]} />
            <meshStandardMaterial color="#33C3FF" emissive="#33C3FF" emissiveIntensity={0.7} />
          </mesh>
        </group>
      </group>
      
      {/* Лёгкое свечение по краю (glow) */}
      <RoundedBox
        args={[2.25, 0.14, 1.35]}
        radius={0.15}
        smoothness={8}
        position={[0, 0, 0.66]}
      >
        <meshStandardMaterial
          ref={edgeGlowRef}
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </RoundedBox>
      
      {/* Тонкая засветка по шву крышки */}
      <mesh position={[0, 0.06, 0.65]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.1, 0.02, 0.01]} />
        <meshStandardMaterial
          ref={seamGlowRef}
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

// Компонент надписи "F" (FilVault) - гравировка с внутренним свечением
function EmblemF({ hovered }: { hovered: boolean }) {
  const emblemRef = useRef<THREE.Group>(null)
  const textMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const innerGlowRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (emblemRef.current) {
      emblemRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.01
    }
    
    if (textMaterialRef.current) {
      // Гравировка: emissive: #00FFC6, metalness: 1
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + (hovered ? 0.7 : 0.5)
      textMaterialRef.current.emissiveIntensity = pulse
    }
    
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * Math.PI) * 0.15 + 0.35
      glowRef.current.opacity = glowPulse * 0.4
    }
    
    if (innerGlowRef.current) {
      // Внутреннее свечение гравировки
      const innerPulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 + 0.6
      innerGlowRef.current.opacity = innerPulse * 0.3
    }
  })

  return (
    <group ref={emblemRef} position={[0.7, -0.25, 0.71]}>
      {/* Внутреннее свечение гравировки */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[0.35, 0.18]} />
        <meshStandardMaterial
          ref={innerGlowRef}
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Свечение вокруг надписи */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial
          ref={glowRef}
          color="#00F6FF"
          emissive="#00F6FF"
          emissiveIntensity={1.0}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Текст "F" (FilVault) - используем геометрию */}
      <group>
        {/* Цифра "4" */}
        <mesh position={[-0.08, 0.02, 0]}>
          <boxGeometry args={[0.015, 0.08, 0.01]} />
        <meshStandardMaterial
            ref={textMaterialRef}
            color="#00F6FF"
            emissive="#00F6FF"
            emissiveIntensity={hovered ? 0.8 : 0.5}
            metalness={1}
            roughness={0.1}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-0.04, 0.02, 0]}>
          <boxGeometry args={[0.015, 0.08, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        <mesh position={[-0.06, 0.05, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        {/* Цифра "0" */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.04, 0.012, 8, 32]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        {/* Цифра "2" */}
        <mesh position={[0.08, 0.05, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        <mesh position={[0.08, -0.05, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        <mesh position={[0.06, 0.025, 0]}>
          <boxGeometry args={[0.015, 0.04, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
          />
        </mesh>
        <mesh position={[0.1, -0.025, 0]}>
          <boxGeometry args={[0.015, 0.04, 0.01]} />
          <meshStandardMaterial
            color="#33C3FF"
            emissive="#33C3FF"
            emissiveIntensity={hovered ? 0.8 : 0.6}
        />
      </mesh>
      </group>
    </group>
  )
}

// Интерфейс токена
interface TokenProps {
    symbol: string
  position: [number, number, number]
  rotation: number
  isActive: boolean
  hovered: boolean
  isOpen: boolean
}

// Компонент токена
function Token({ symbol, position, rotation, isActive, hovered, isOpen }: TokenProps) {
  const tokenRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)

  // Параметры материалов для каждого токена (улучшенные)
  const getTokenConfig = () => {
    switch (symbol) {
      case 'SOL':
        // Фиолетово-бирюзовый глянец
        return {
          color: '#9945FF',
          emissive: '#0090FF',
          metalness: 0.4,
          roughness: 0.15,
          transmission: 0.7,
          clearcoat: 0.95,
          thickness: 0.12,
        }
      case 'BTC':
        // Металлический с оранжевым свечением
        return {
          color: '#F7931A',
          emissive: '#FFA500',
          metalness: 0.85,
          roughness: 0.12,
          transmission: 0.15,
          clearcoat: 1.0,
          thickness: 0.1,
        }
      case 'USDC':
        // Синий стеклянный
        return {
          color: '#2775CA',
          emissive: '#4A90E2',
          metalness: 0.3,
          roughness: 0.2,
          transmission: 0.75,
          clearcoat: 0.9,
          thickness: 0.12,
        }
      case 'ETH':
        // Серый металл с отражением
        return {
          color: '#627EEA',
          emissive: '#8FA3E8',
          metalness: 0.95,
          roughness: 0.08,
          transmission: 0.2,
          clearcoat: 1.0,
          thickness: 0.1,
        }
      default:
        return {
          color: '#FFFFFF',
          emissive: '#FFFFFF',
          metalness: 0.6,
          roughness: 0.3,
          transmission: 0.5,
          clearcoat: 0.8,
          thickness: 0.1,
        }
    }
  }

  const config = getTokenConfig()

  useFrame((state) => {
    if (tokenRef.current) {
      // Idle анимация: лёгкое покачивание (амплитуда ±3°, скорость 0.5s)
      const idleRotation = Math.sin(state.clock.elapsedTime * 4 + rotation) * 0.05
      tokenRef.current.rotation.y = rotation + idleRotation
      
      // При hover - монеты вращаются на 5-10° (эффект "живого объекта")
      if (hovered && isActive) {
        const hoverRotation = THREE.MathUtils.lerp(
          tokenRef.current.rotation.y,
          rotation + 0.15, // ~8.5°
          0.1
        )
        tokenRef.current.rotation.y = hoverRotation
        
        // Поднимается на 5-10px
        const hoverY = THREE.MathUtils.lerp(
          tokenRef.current.position.y,
          position[1] + 0.08,
          0.1
        )
        tokenRef.current.position.y = hoverY
      } else {
        tokenRef.current.position.y = position[1]
      }
      
      // При открытии: токены слегка "приподнимаются" (translateY +10px, rotateZ +5°)
      if (isOpen) {
        const openY = THREE.MathUtils.lerp(
          tokenRef.current.position.y,
          position[1] + 0.1, // +10px
          0.1
        )
        tokenRef.current.position.y = openY
        
        const openRotation = THREE.MathUtils.lerp(
          tokenRef.current.rotation.y,
          rotation + 0.2, // ~11.5°
          0.1
        )
        tokenRef.current.rotation.y = openRotation
        
        // rotateZ +5°
        tokenRef.current.rotation.z = THREE.MathUtils.lerp(
          tokenRef.current.rotation.z,
          0.087, // ~5°
          0.1
        )
      } else {
        tokenRef.current.rotation.z = THREE.MathUtils.lerp(
          tokenRef.current.rotation.z,
          0,
          0.1
        )
      }
    }
    
    if (materialRef.current) {
      // Усиление glow при hover
      const glowIntensity = hovered && isActive ? 0.7 : 0.4
      materialRef.current.emissiveIntensity = glowIntensity
    }
    
    if (glowRef.current) {
      const glowPulse = isActive ? (Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8) : 0.4
      glowRef.current.opacity = glowPulse * 0.5
    }
  })

  return (
    <group ref={tokenRef} position={position} castShadow>
      {/* Основной токен - 3D-диск с гравировкой (глубина ~3px = 0.03) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, config.thickness || 0.03, 32]} />
        <meshPhysicalMaterial
        ref={materialRef}
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.3}
          metalness={config.metalness}
          roughness={config.roughness}
          transmission={config.transmission}
          clearcoat={config.clearcoat}
          clearcoatRoughness={0.08}
          envMapIntensity={2.0}
          thickness={config.thickness || 0.03}
          ior={1.5}
      />
    </mesh>
      
      {/* Эмиссивное свечение логотипа токена (эмблема) */}
      <group position={[0, 0, (config.thickness || 0.03) / 2 + 0.01]}>
        {/* Основной диск эмблемы */}
        <mesh>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial
            color={config.emissive}
            emissive={config.emissive}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Гравировка эмблемы (упрощённая геометрия) */}
        {symbol === 'SOL' && (
          <>
            {/* Символ Filecoin */}
            <mesh position={[0, 0.03, 0.001]}>
              <boxGeometry args={[0.06, 0.01, 0.002]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <boxGeometry args={[0.06, 0.01, 0.002]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, -0.03, 0.001]}>
              <boxGeometry args={[0.06, 0.01, 0.002]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
            </mesh>
          </>
        )}
        {symbol === 'BTC' && (
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.002]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
          </mesh>
        )}
        {symbol === 'USDC' && (
          <mesh>
            <boxGeometry args={[0.06, 0.06, 0.002]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
          </mesh>
        )}
        {symbol === 'ETH' && (
          <>
            {/* Ромб Ethereum */}
            <mesh position={[0, 0.02, 0.001]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.04, 0.002]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
            </mesh>
          </>
        )}
      </group>
      
      {/* Edge glow - Fresnel effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.001, 32]} />
        <meshStandardMaterial
          ref={glowRef}
          color={config.emissive}
          emissive={config.emissive}
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Точечное освещение для токена */}
      <pointLight
        position={[0, 0, 0.1]}
        intensity={isActive ? 0.4 : 0.15}
        color={config.emissive}
        distance={2.5}
        decay={2}
      />
    </group>
  )
}

// Компонент частиц при открытии
function OpenParticles({ isOpen }: { isOpen: boolean }) {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (particlesRef.current && isOpen) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  if (!isOpen) return null

  return (
    <group ref={particlesRef} position={[0, 0.1, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 0.15 - 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.5, 0.02, 0.01]} />
          <meshStandardMaterial
            color="#00F6FF"
            emissive="#00F6FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// Фоновая сетка Filecoin-style
function BackgroundGrid() {
  const gridRef = useRef<THREE.Group>(null)
  const vGeometryRef = useRef<THREE.BufferGeometry>(null)
  const hGeometryRef = useRef<THREE.BufferGeometry>(null)
  
  useEffect(() => {
    if (vGeometryRef.current && hGeometryRef.current) {
      // Вертикальные линии
      const vPositions = new Float32Array(20 * 6)
      for (let i = 0; i < 20; i++) {
        const idx = i * 6
        vPositions[idx] = i - 10
        vPositions[idx + 1] = -10
        vPositions[idx + 2] = 0.01
        vPositions[idx + 3] = i - 10
        vPositions[idx + 4] = 10
        vPositions[idx + 5] = 0.01
      }
      vGeometryRef.current.setAttribute('position', new THREE.BufferAttribute(vPositions, 3))
      
      // Горизонтальные линии
      const hPositions = new Float32Array(20 * 6)
      for (let i = 0; i < 20; i++) {
        const idx = i * 6
        hPositions[idx] = -10
        hPositions[idx + 1] = i - 10
        hPositions[idx + 2] = 0.01
        hPositions[idx + 3] = 10
        hPositions[idx + 4] = i - 10
        hPositions[idx + 5] = 0.01
      }
      hGeometryRef.current.setAttribute('position', new THREE.BufferAttribute(hPositions, 3))
    }
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      // Parallax эффект
      gridRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01
    }
  })

  return (
    <group ref={gridRef} position={[0, 0, -5]}>
        {/* Фон - глубокий синий с Filecoin градиентом (#001A26) */}
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
            color="#001A26"
            transparent
            opacity={0.95}
          />
        </mesh>
        
        {/* Дополнительный синий градиент */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#001A3F"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Сетка */}
      <lineSegments>
        <bufferGeometry ref={vGeometryRef} />
        <lineBasicMaterial color="#0090FF" transparent opacity={0.1} />
      </lineSegments>
      
      <lineSegments>
        <bufferGeometry ref={hGeometryRef} />
        <lineBasicMaterial color="#0090FF" transparent opacity={0.1} />
      </lineSegments>
    </group>
  )
}

// Частицы на фоне
function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 100
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15
  }

  useFrame((state) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
      <points ref={particlesRef} position={[0, 0, -4]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        {/* Ambient particles - редкие световые точки вокруг (opacity 0.05) */}
        <pointsMaterial size={0.01} color="#0090FF" transparent opacity={0.05} />
      </points>
  )
}

// Основной компонент кошелька
function Wallet({ isOpen, onToggle, hovered }: { isOpen: boolean; onToggle: () => void; hovered: boolean }) {
  const walletRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  
  // Токены расположены в полукруге (угол поворота ~10° между токенами)
  // Улучшенное расположение для видимости всех 4 токенов
  const tokens = [
    { symbol: 'SOL', angle: -0.26, zOffset: 0.25 }, // -15°
    { symbol: 'BTC', angle: -0.09, zOffset: 0.2 },  // -5°
    { symbol: 'USDC', angle: 0.09, zOffset: 0.2 },   // 5°
    { symbol: 'ETH', angle: 0.26, zOffset: 0.25 },  // 15°
  ].map((token, index) => {
    const radius = 0.35
    const x = Math.sin(token.angle) * radius
    const z = Math.cos(token.angle) * radius + token.zOffset
    return {
      symbol: token.symbol,
      position: [x, 0.1, z] as [number, number, number],
      rotation: token.angle,
    }
  })

  useFrame((state) => {
    if (walletRef.current && !isOpen) {
      // Idle: кошелёк парит (hover 3-5px вверх-вниз, glow пульсирует)
      const float = Math.sin(state.clock.elapsedTime * 2) * 0.04 // 3-5px
      walletRef.current.position.y = float
      
      // Медленная пульсация
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
      walletRef.current.scale.set(scale, scale, scale)
    } else if (walletRef.current && isOpen) {
      walletRef.current.position.y = 0
      walletRef.current.scale.set(1.05, 1.05, 1.05)
    }
    
    // Пульсация glow (0.2-0.4 intensity pulse каждые 3s)
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * (Math.PI / 3)) * 0.1 + 0.3
      glowRef.current.opacity = hovered ? glowPulse * 0.3 : glowPulse * 0.15
      glowRef.current.emissiveIntensity = glowPulse
    }
    
    // Light Pulse: каждые 10 сек — лёгкий пробег света по периметру
    const lightPulseTime = (state.clock.elapsedTime % 10) / 10
    if (lightPulseTime < 0.1 && walletRef.current) {
      const pulseIntensity = Math.sin(lightPulseTime * Math.PI * 10) * 0.3 + 0.7
      walletRef.current.scale.set(pulseIntensity, pulseIntensity, pulseIntensity)
    }
  })

  return (
    <group
      ref={walletRef}
      onClick={(e) => {
        e.stopPropagation()
        if (!isOpen) {
          createOpenSound()
        }
        onToggle()
      }}
      onPointerEnter={() => {}}
      onPointerLeave={() => {}}
    >
      <WalletBody hovered={hovered} isOpen={isOpen} />
      <WalletLid isOpen={isOpen} hovered={hovered} />
      <EmblemF hovered={hovered} />
      
      {/* Токены внутри - расположены в полукруге, частично выступают из кошелька */}
        {isOpen && (
        <group>
            {tokens.map((token, index) => (
            <Token
                key={token.symbol}
              symbol={token.symbol}
              position={token.position}
              rotation={token.rotation}
              isActive={index === 0}
                hovered={hovered}
              isOpen={isOpen}
              />
            ))}
          </group>
        )}

      {/* Частицы при открытии */}
      <OpenParticles isOpen={isOpen} />
      
      {/* Свечение при hover */}
        {hovered && !isOpen && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.6, 32, 32]} />
            <meshStandardMaterial
              ref={glowRef}
              color="#00F6FF"
              transparent
              opacity={0.1}
              emissive="#00F6FF"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
    </group>
  )
}

// Камера с авто-вращением
function AnimatedCamera({ isOpen }: { isOpen: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame((state) => {
    if (cameraRef.current && !isOpen) {
      // Auto-orbit 2°/s
      const angle = state.clock.elapsedTime * (Math.PI / 90) // 2° в секунду
      cameraRef.current.position.x = Math.sin(angle) * 0.3
      cameraRef.current.position.y = Math.cos(angle) * 0.15
      
      const targetZ = 5
      cameraRef.current.position.z = THREE.MathUtils.lerp(
        cameraRef.current.position.z,
        targetZ,
        0.05
      )
    } else if (cameraRef.current && isOpen) {
      cameraRef.current.position.z = THREE.MathUtils.lerp(
        cameraRef.current.position.z,
        4,
        0.05
      )
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 5]}
      fov={45} // FoV: 45-50°
    />
  )
}

// Главный компонент
export default function Wallet3D() {
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const mobile = isMobile()
  const tablet = isTablet()

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0, // Снижен для реализма
        }}
        shadows
        dpr={mobile ? 1 : 2}
      >
        <AnimatedCamera isOpen={isOpen} />
        
        {/* 3D-сцена с атмосферой Filecoin - 3 источника света */}
        {/* Основной источник света: color: #0090FF, intensity: 1, position: [2, 3, 2] */}
        <directionalLight
          position={[2, 3, 2]}
          intensity={1.2} // Усилен для контраста
          color="#0090FF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-radius={4}
        />
        
        {/* Контровой (синий): color: #00F6FF, intensity: 0.7, position: [-3, 2, -1] */}
        <directionalLight
          position={[-3, 2, -1]}
          intensity={0.8} // Усилен для контраста
          color="#00F6FF"
        />
        
        {/* Ambient: color: #0090FF, intensity: 0.3 */}
        <ambientLight intensity={0.25} color="#0090FF" /> {/* Снижен для контраста */}
        
        {/* Дополнительный направленный свет для объёма */}
        <directionalLight
          position={[0, -2, 3]}
          intensity={0.3}
          color="#00F6FF"
        />
        
        {/* Внутренний (emissive light) - бело-синий #B3E5FF */}
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#B3E5FF" distance={4} />
        
        {/* Дополнительные источники для объёма */}
        <pointLight position={[3, 3, 3]} intensity={0.2} color="#00F6FF" distance={6} />
        <pointLight position={[-3, -2, 3]} intensity={0.15} color="#0090FF" distance={6} />
        
        {/* Volumetric fog (плотность 0.05) */}
        <fog attach="fog" args={['#001A26', 1, 12]} />
        
        {/* Environment для отражений */}
        <Environment preset="night" />
        
        
        {/* Фон */}
        <BackgroundGrid />
        <BackgroundParticles />
        
        {/* Vault (сейф) */}
        <Suspense fallback={null}>
          <Wallet isOpen={isOpen} onToggle={handleToggle} hovered={hovered} />
        </Suspense>
        
        {/* Soft shadow под сейфом (вниз, размытие 15px, opacity 0.25) */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.4} // Усилена для реализма
          scale={6} // Увеличен масштаб
          blur={20} // Больше размытие
          far={2.5}
          color="#0090FF"
        />
        
        {/* Дополнительная тень для глубины */}
        <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Подсветка дна */}
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial
            color="#0090FF"
            emissive="#0090FF"
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
          />
        </mesh>
        
        {/* Orbit Controls только для idle */}
        {!isOpen && !mobile && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        )}
      </Canvas>
    </div>
  )
}

