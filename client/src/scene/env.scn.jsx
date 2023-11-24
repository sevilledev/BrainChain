import { Environment, Float, Lightformer } from '@react-three/drei'
import { useControl } from 'react-three-gui'


export const Env = () => {
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