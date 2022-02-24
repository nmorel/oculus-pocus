import { Suspense, useState } from "react";
import { VRCanvas, Interactive, DefaultXRControllers, useXR } from "@react-three/xr";
import { Html, Sky, Text } from "@react-three/drei";
import "@react-three/fiber";
import { useThree } from "@react-three/fiber";

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  );
}

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  );
}

function Button(props: any) {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(0x123456);

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0);
  };

  const {gl} = useThree()
  const session = gl.xr?.getSession()

  return (
    <Interactive
      onSelect={onSelect}
      onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Box
        color={color}
        scale={hover ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        size={[0.4, 0.1, 0.1]}
        {...props}
      >
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.05}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {`${session?.domOverlayState?.type}`}
        </Text>
      </Box>
    </Interactive>
  );
}

function HtmlScreen(props: any) {
  const tata = useXR()
  console.log(tata, document.querySelector('#overlay'))
  return (
    <Html
      sprite
      transform
      distanceFactor={1}
      style={{
        width: 1920,
        height: 1080,
        background: 'red'
      }}
      {...props}
    >
      Hello
    </Html>
  );
}

export function App() {
  return (
    <Suspense fallback={null}>
      <VRCanvas sessionInit={{
        optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
        domOverlay: { root: document.querySelector('#overlay') } 
       }} >
        <Sky sunPosition={[0, 1, 0]} />
        <Floor />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <DefaultXRControllers />
        <Button position={[0, 0.2, -1]} />
        <HtmlScreen position={[0, 2, -1]} />
      </VRCanvas>
    </Suspense>
  );
}
