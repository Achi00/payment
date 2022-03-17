import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF,  } from "@react-three/drei";
import { proxy, useSnapshot } from 'valtio'
import { HexColorPicker } from 'react-colorful';
import "./card.css"


const state = proxy({
    current : null,
    items: {
        card: "#088083",
        white_plastic: "#FFFFFF",
        chip: "#EDD581",
        metall001: "#EAECED",
        metall002: "#EAECED",
    }
})

const Card = (props) => {
    const snap = useSnapshot(state)
    const group = useRef();
    const { nodes, materials } = useGLTF("/cardDraco.gltf");
    const [hovered, set] = useState(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
        group.current.rotation.x = Math.cos(t / 4) / 8
        group.current.rotation.y = Math.sin(t / 4) / 8
        group.current.position.y = (1 + Math.sin(t / 1.5)) / 10
      })

    useEffect(() => {
        const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
        const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
        if (hovered) {
          document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
          return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
        }
      }, [hovered])
    return (
      <group
      ref={group} 
      {...props}
      dispose={null} 
      onPointerOver = {(e) =>{e.stopPropagation();set(e.object.material.name)}}
      onPointerOut = {(e) =>{e.intersections.length === 0 && set(null)}}
      onPointerDown = {(e) => {e.stopPropagation();state.current = e.object.material.name}}
      onPointerMissed = {(e) => {state.current = null}}
      >
        <group position={[0.04, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <group position={[0, 0.42, 0]} scale={[0.09, 0.09, 0.24]}>
                {/* yellow */}
              <group position={[-4.3, 1.1, 0.05]}>
                <mesh material-color={snap.items.chip}
                  geometry={nodes.Object_7.geometry} material={materials.chip}
                />
              </group>
              {/* top row gray */}
              <group position={[-4.88, -1.61, 0.04]} scale={[1.16, 1.16, 0.95]}>
                <mesh material-color={snap.items.metall}
                  geometry={nodes.Object_11.geometry} material={nodes.Object_11.material}
                />
              </group>
              {/* low row gray */}
              <group position={[-0.29, -3.28, 0.03]} scale={[1.16, 1.16, 0.95]}>
                <mesh material-color={snap.items.metall}
                  geometry={nodes.Object_13.geometry} material={nodes.Object_13.material}
                />
              </group>
              {/* card BG */}
              <mesh material-color={snap.items.card}
                geometry={nodes.Object_4.geometry} material={materials.card}
              />
              {/* outline */}
              <mesh material-color={snap.items.white_plastic}
                geometry={nodes.Object_5.geometry} material={materials.white_plastic}
              />
            </group>
          </group>
        </group>
      </group>
    );
}

const Text = () =>{
    return(
    <div>
        <h1 className="text">Click On Card's Different Parts To Choose Style</h1>
    </div>
    )
}

function Picker() {
    const snap = useSnapshot(state)
    return(
        <div className='pick' style={{ display: snap.current ? "block" : "none"}}>
            <HexColorPicker  className="picker"
            color={snap.items[snap.current]}
            onChange={(color)=>(state.items[snap.current]=color)}
            />
            <h1 className='card-Part'>{snap.current}</h1>
        </div>
    )
}

function CardDesign() {
    return(
        <div className="App">
        <Picker/>
        <Text />
        <Canvas>
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
                <Card />
                {/* <Environment preset="night"/> */}
            </Suspense>
        </Canvas>
        
        </div>
    )
}

export default CardDesign