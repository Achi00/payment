import { useLoader, useFrame, Canvas, useThree } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial, PerspectiveCamera, Text, useGLTF  } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useRef, useState } from "react";
import * as THREE from 'three'
import { EffectComposer, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import url from "./Chart.mp4";
import './App.css';

const Video = () => {
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });
  return (
    <group >
      <mesh rotation={[0, 0, 0]} position={[-1.084, 0.15, 0.7826]}>
        <planeGeometry args={[0.37, 0.21]} />
        <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
      </mesh>
    </group>
  );
}

const Info = () => {
  return(
    <>
    <Text position={[1.5, 1.2, 2]} rotation={[-Math.PI / 1, -1, 3.1]} font="/Inter-Bold.woff" fontSize={0.2} letterSpacing={-0.06}>  
      Send payment 
    </Text>
    <Text position={[1.5, 1, 2]} rotation={[-Math.PI / 1, -1, 3.1]} font="/Inter-Bold.woff" fontSize={0.3} letterSpacing={-0.06}>  
      requests, get paid
      
    </Text>
    <Text position={[1.5, 0.6, 2]} rotation={[-Math.PI / 1, -1, 3.1]} font="/Inter-Bold.woff" fontSize={0.5} letterSpacing={-0.06}>  
      fast! 
    </Text>
    </>
  )
}

const Laptop = () => {
  const gltf = useLoader(GLTFLoader, "./laptop.gltf");
  const { viewport } = useThree()
  return (
    <>
      <primitive object={gltf.scene} scale={0.2} position={[-1.18, -0.040, 0.64]}/>
    </>
  );
};

const Ground = () => {

  const floorRef = useRef()
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

function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/cardDraco.gltf");
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.position.y = (1 + Math.sin(t / 1.5)) / 20
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0.04, 0.2, 0]} rotation={[-Math.PI / 2, 0, 3]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0, 0.42, 0]} scale={[0.09, 0.09, 0.24]}>
            <group position={[-4.3, 1.1, 0.05]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_7.geometry}
                material={materials.chip}
              />
            </group>
            <group position={[-4.88, -3.28, 0.03]} scale={[1.16, 1.16, 0.95]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_9.geometry}
                material={nodes.Object_9.material}
              />
            </group>
            <group position={[-4.88, -1.61, 0.04]} scale={[1.16, 1.16, 0.95]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_11.geometry}
                material={nodes.Object_11.material}
              />
            </group>
            <group position={[-0.29, -3.28, 0.03]} scale={[1.16, 1.16, 0.95]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_13.geometry}
                material={nodes.Object_13.material}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_5.geometry}
              material={materials.white_plastic}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={materials.card}
            />
          </group>
        </group>
      </group>
    </group>
  );
}



function App() {

  return (
    <div className="App">
      <Canvas id="canvas">
        <Suspense fallback={null}>
        <PerspectiveCamera makeDefault fov={70} position={[-1.5, 0.1, -0.8]} rotation={[9.3, 6, 3.1]}>
        <spotLight position={[10, 10, 5]} angle={0.15} penumbra={1} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
        </PerspectiveCamera>
          <Video />
          <Ground />
          <Laptop />
          {/* <Card /> */}
          <Model scale={0.3} position={[-0.8, -0.2, 0.32]}/>
          <Info />
          <Environment preset="sunset"/>
        </Suspense>
        <EffectComposer multisampling={0} disableNormalPass={true}>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      </Canvas>
    </div>
  );
}


export default App;
