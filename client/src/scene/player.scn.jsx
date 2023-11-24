import { Center, Float, Text3D } from '@react-three/drei'


export const Player = ({ player, position, rotation }) => {
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