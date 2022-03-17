import { Canvas, useLoader, extend, useThree, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, useGLTF, Image, useIntersect, Scroll, useScroll, ScrollControls, } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BlurPass, Resizer, KernelSize } from 'postprocessing'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import  { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from 'three'
import "./How.css"

const Model = () => {
  const scroll = useScroll()
  const cardRef = useRef()
  const gltf = useLoader(GLTFLoader, "./card.gltf");
  const group = useRef();
  const { nodes, materials } = useGLTF("/cardDraco.gltf");
  useFrame(() => (cardRef.current.rotation.y = -scroll.offset * 6.5))
  return (
    <group ref={cardRef}>
      <primitive object={gltf.scene} scale={0.4} />
    </group>
  );
};

const Ground = () => {
  const scroll = useScroll()
  const floorRef = useRef()
  useFrame(() => (floorRef.current.rotation.z = -scroll.offset * 6.5))
  return (
    <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} ref={floorRef}>
          <planeGeometry args={[10, 10]} />
          <MeshReflectorMaterial
            blur={[100, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={40}
            roughness={3}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#343A40"
            metalness={0.5}
          />
        </mesh>
    </>
  )
}


function Item({ url, scale, ...props }) {
  const visible = useRef(false)
  const ref = useIntersect((isVisible) => (visible.current = isVisible))
  const { height } = useThree((state) => state.viewport)
  useFrame((state, delta) => {
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta)
    ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? 1 : 1.5, 4, delta)
  })
  return (
    <group {...props}>
      <Image ref={ref} scale={scale} url={url} />
    </group>
  )
}


function Items() {
  const { width: w, height: h } = useThree((state) => state.viewport)
  return (
    <Scroll>
      <Item url="/1.jpeg" scale={[w / 10, w / 10, 0.5]} position={[-w / 6, 0.3, 0.3]} />
      <Item url="/2.jpg" scale={[0.5, w / 10, 0]} position={[w / 30, -h, 0.3]} />
      <Item url="/3.jpg" scale={[w / 7, w / 8, 0.5]} position={[-w / 4, -h * 1, -0.3]} />
      <Item url="/4.jpg" scale={[w / 10, w / 8, 0.5]} position={[w / 4, -h * 1.2, -0.8]} />
      <Item url="/5.png" scale={[w / 10, w / 8, 0.5]} position={[w / 10, -h * 1.75, -0.2]} />
      <Item url="/2.jpg" scale={[w / 10, w / 5, 0.5]} position={[-w / 4, -h * 2, 0]} />
      <Item url="/3.jpg" scale={[w / 10, w / 5, 1]} position={[-w / 4, -h * 2.6, 0]} />
      <Item url="/1.jpeg" scale={[w / 2, w / 2, 1]} position={[w / 4, -h * 3.1, 0]} />
      <Item url="/4.jpg" scale={[w / 2.5, w / 2, 1]} position={[-w / 6, -h * 4.1, 0]} />
    </Scroll>
  )
}

function How() {
  return (
    <div className="App">
    <Canvas camera={{ fov: 75, position: [0, 0.3, 1] }}>
      <Suspense fallback={null}>
      <ScrollControls pages={3}>
        <Ground />
        <Model />
        <Items />
      <Scroll html style={{ width: '100%' }}>
        <h1 style={{ position: 'absolute',color: "aliceblue", top: `100vh`, right: '20vw', fontSize: '5em',letterSpacing: '3px', transform: `translate3d(0,-100%,0)` }}>
          Create<br />
          payment<br />
          requests
        </h1>
        <h1 style={{ position: 'absolute', top: '180vh', left: '10vw', fontSize: '2em',color: "#059C9F" }}>Make a simple payment link in 5 seconds.
Use our powerful features to customize your request.</h1>
        <h1 style={{ position: 'absolute', top: '260vh', width:"30vw", right: '30vw', color: "aliceblue"}}>Request one payment, or get paid multiple times with reusable link.</h1>
        <h1 style={{ position: 'absolute', top: '260vh', width:"25vw", left: '10vw', color: "aliceblue" }}>Offer downloadable files after your customer completes the payment</h1>
        <h1 style={{ position: 'absolute', top: '260vh', width:"25vw", left: '68vw', color: "aliceblue" }}>Easily send requests via e-mail or SMS</h1>
      </Scroll>
      </ScrollControls>
        <ambientLight intensity={1}/>
        <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  </div>
  )
}

export default How
