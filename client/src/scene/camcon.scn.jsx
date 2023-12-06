import { useEffect, useRef } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSnapshot } from 'valtio'
import { STIndicator, STUI } from '../stores/app.store'


export const CamCon = ({ core }) => {
    const SSIndicator = useSnapshot(STIndicator)
    const SSUI = useSnapshot(STUI)

    const camera = useRef()
    const controls = useRef()

    const cameraOptions = {
        fov: 30,
        near: 0.01,
        far: 1500
    }

    const orbitOptions = {
        enablePan: false,
        autoRotate: SSIndicator.id && SSUI.value.name !== 'Game',
        maxPolarAngle: SSUI.value.name === 'Game' ? Math.PI : Math.PI / 2.2,
        minPolarAngle: SSUI.value.name === 'Game' ? 0 : Math.PI / 2.2
    }


    const getPos = () => {
        let pos = [0, 0, 0]

        if (core.isMobile) {
            pos = [0, 1, 80]
        } else {
            if (SSUI.value.name !== 'Game') {
                pos = [0, 1, 10 + SSIndicator.players.all]
            } else {
                pos = [0, 1, 12]
            }
        }

        return pos
    }


    useEffect(() => {
        if (SSUI.value.name === 'Game') {
            gsap.to(camera.current.position, { duration: 2, x: 0, y: 10 + SSIndicator.players.all * 2.5, z: 0 })
        }
    }, [SSUI.value.name])


    return (
        <>
            <PerspectiveCamera ref={camera} position={getPos()} {...cameraOptions} makeDefault />
            <OrbitControls ref={controls} {...orbitOptions} />
        </>
    )
}