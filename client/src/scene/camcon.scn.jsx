import { useRef } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { STInLobby, STIndicator } from '../stores/app.store'


export const CamCon = ({ core }) => {
    const SSIndicator = useSnapshot(STIndicator)
    const SSInLobby = useSnapshot(STInLobby)

    const camera = useRef()
    const controls = useRef()

    const orbitOptions = {
        enablePan: false,
        autoRotate: !SSInLobby.is,
        maxPolarAngle: Math.PI / 2.2,
        minPolarAngle: Math.PI / 2.2
    }


    return (
        <>
            <PerspectiveCamera ref={camera} position={[0, 1, core.isMobile ? 80 : SSInLobby.is ? 12 : 10 + SSIndicator.players.all]} fov={30} near={0.01} far={1500} makeDefault />
            <OrbitControls ref={controls} {...orbitOptions} />
        </>
    )
}