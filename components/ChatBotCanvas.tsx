/** @format */

"use client";
import { AppContext } from "../app/context/isPlayingContext";
import {
	Environment,
	Html,
	Loader,
	OrbitControls,
	SpotLight,
	useAnimations,
	useDepthBuffer,
	useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useRef } from "react";
import { Vector3 } from "three";

const Torch = ({ vec = new Vector3(), ...props }) => {
	const light = useRef<THREE.SpotLight>(null);
	const viewport = useThree((state) => state.viewport);
	useFrame((state) => {
		light.current?.target.position.lerp(
			vec.set(
				(state.mouse.x * viewport.width) / 2,
				(state.mouse.y * viewport.height) / 2,
				0
			),
			0.1
		);
		light.current?.target.updateMatrixWorld();
	});
	return (
		<SpotLight
			castShadow
			ref={light}
			penumbra={1}
			distance={10}
			angle={0.35}
			attenuation={5}
			anglePower={4}
			intensity={3}
			{...props}
		/>
	);
};

const Head = () => {
	const { isPlaying, setIsPlaying } = useContext(AppContext);
	const model = useGLTF("/head.glb");
	const animations = useAnimations(model.animations, model.scene);
	const action = animations.actions.Animation;
	const depthBuffer = useDepthBuffer({ frames: 1 });
	useEffect(() => {
		if (isPlaying) {
			action?.play();
		} else {
			action?.fadeOut(0.5);
			setTimeout(() => {
				action?.stop();
			}, 500);
		}
	}, [isPlaying, action]);

	return (
		<>
			<primitive object={model.scene} scale={3} rotation-z={0.2} />
			<Torch
				depthBuffer={depthBuffer}
				color="blue"
				position={[3, 2, 2]}
			/>
			<Torch
				depthBuffer={depthBuffer}
				color="#b00c3f"
				position={[-3, 2, 2]}
			/>
		</>
	);
};

export const ChatBotCanvas = () => {
	return (
		<Canvas>
			<OrbitControls
				enableZoom={false}
				enableDamping
				maxPolarAngle={2}
				minAzimuthAngle={-Math.PI * 0.5}
				maxAzimuthAngle={Math.PI * 0.5}
			/>
			<color attach="background" args={["black"]} />
			<ambientLight intensity={0.315} />
			<Suspense
				fallback={
					<Html>
						<Loader />
					</Html>
				}>
				<Head />
			</Suspense>
		</Canvas>
	);
};
