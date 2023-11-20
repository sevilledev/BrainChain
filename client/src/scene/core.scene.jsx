import { useRef } from 'react'
import { useSnapshot } from 'valtio'
import { Center, Environment, Float, Lightformer, OrbitControls, PerspectiveCamera, Text3D } from '@react-three/drei'
import { Controls, useControl } from 'react-three-gui'
import { genColor } from '../utilities/core.utils'
import { STInLobby, STIndicator, STProfile } from '../stores/app.store'


export const Scene = ({ core }) => {


    const Canvas = ({ children }) => {
        return (
            <Controls.Provider>
                <Controls.Canvas shadows>{children}</Controls.Canvas>
                {false && <Controls title='Settings' />}
            </Controls.Provider>
        )
    }


    const CamCon = () => {
        const SSIndicator = useSnapshot(STIndicator)
        const SSInLobby = useSnapshot(STInLobby)

        const camera = useRef()
        const controls = useRef()

        const orbitOptions = {
            enablePan: false,
            autoRotate: !SSInLobby.is,
            maxPolarAngle: Math.PI / 2.2,
            minPolarAngle: Math.PI / 2.2,
            // maxAzimuthAngle: Math.PI / 4,
            // minAzimuthAngle: -Math.PI / 4
        }


        return (
            <>
                <PerspectiveCamera ref={camera} position={[0, 1, core.isMobile ? 80 : SSInLobby.is ? 12 : 10 + SSIndicator.players.all]} fov={30} near={0.01} far={1500} makeDefault />
                <OrbitControls ref={controls} {...orbitOptions} />
            </>
        )
    }


    const Light = () => {
        return (
            <>
                <color attach='background' args={['#15151A']} />
                <ambientLight intensity={0.4} />
                <spotLight castShadow intensity={1} position={[-3, 5, 3]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
            </>
        )
    }


    const Env = () => {
        const intensity = useControl('Intensity', { type: 'number', group: 'Former', value: 1, min: 0, max: 20 })

        const posX = useControl('Pos X', { type: 'number', group: 'Former', value: 0, min: -10, max: 10 })
        const posY = useControl('Pos Y', { type: 'number', group: 'Former', value: 30, min: -10, max: 50 })
        const posZ = useControl('Pos Z', { type: 'number', group: 'Former', value: -6, min: -10, max: 10 })

        const sclX = useControl('Scl X', { type: 'number', group: 'Former', value: 60, min: 0, max: 200 })
        const sclY = useControl('Scl Y', { type: 'number', group: 'Former', value: 60, min: 0, max: 200 })


        return (
            <Environment frames={Infinity} resolution={256}>
                <Float speed={2} floatIntensity={10} rotationIntensity={2}>
                    <Lightformer form={'circle'} intensity={intensity} position={[posX, posY, posZ]} rotation={[-Math.PI / 2, 0, 0]} scale={[sclX, sclY, 0]} target={[0, 0, 0]} />
                </Float>
            </Environment>
        )
    }


    const Floor = () => {
        return (
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                <planeGeometry attach='geometry' args={[100, 100]} />
                <shadowMaterial attach='material' transparent opacity={0.4} />
            </mesh>
        )
    }


    const Player = ({ player, position, rotation }) => {
        const lod = 32
        const isReady = player.name !== 'Waiting...'


        const Material = () => {
            if (isReady) return <meshStandardMaterial color={player.color} metalness={0.2} roughness={0} />
            return <meshStandardMaterial color={'#fff'} opacity={0.08} transparent />
        }


        return (
            <group position={position}>
                <group position={[0, 0.9, 0]}>
                    <Float speed={6} floatIntensity={0.5} rotationIntensity={0}>
                        <Center rotation={rotation} cacheKey={player.name}>
                            <Text3D font={'Barlow_Regular.json'} bevelEnabled bevelSize={0.05} size={1} scale={0.25} height={0}>
                                {player.name}
                                <meshStandardMaterial color={'#fff'} metalness={0} roughness={1} />
                            </Text3D>
                        </Center>
                    </Float>
                </group>
                <mesh name='head' position={[0, 0, 0]} castShadow={isReady} receiveShadow={isReady}>
                    <sphereGeometry args={[0.5, lod, lod]} />
                    <Material />
                </mesh>
                <mesh name='body' position={[0, -1.5, 0]} castShadow={isReady} receiveShadow={isReady}>
                    <sphereGeometry args={[0.8, lod, lod, , , , Math.PI / 2]} />
                    <Material />
                </mesh>
                <mesh name='bottom' position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.8, lod]} />
                    <Material />
                </mesh>
            </group>
        )
    }


    const Avatar = () => {
        const SSProfile = useSnapshot(STProfile)
        const SSInLobby = useSnapshot(STInLobby)

        return SSInLobby.is && <Player player={SSProfile} position={[0, 0, 0]} />
    }


    const Players = () => {
        const SSIndicator = useSnapshot(STIndicator)

        const players = SSIndicator.players
        const playerCount = players ? players.all : 0
        const radius = playerCount * 0.8
        const angle = 360 / playerCount


        const radian = (index) => { return angle * (Math.PI / 180) * index }

        const pos = (index) => {
            return [
                /* Pos X */ +(Math.cos(Math.PI / 2 + radian(index)) * radius).toFixed(3),
                /* Pos Y */ 0,
                /* Pos Z */ +(Math.sin(Math.PI / 2 + radian(index)) * radius).toFixed(3)
            ]
        }


        return (
            Array(playerCount).fill().map((player, index) => {
                return <Player key={index}
                    position={pos(index)}
                    rotation={[0, Math.PI - radian(index), 0]}
                    player={players.joined > index ? players.list[index] : { name: 'Waiting...', color: genColor() }}
                />
            })
        )
    }


    return (
        <Canvas>
            <CamCon />
            <Light />
            <Env />
            <Floor />
            <Avatar />
            <Players />
        </Canvas>
    )
}