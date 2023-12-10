import { useEffect, useRef } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSnapshot } from 'valtio'
import { STGame, STIndicator, STUI } from '../stores/app.store'


export const CamCon = ({ core }) => {
    const SSIndicator = useSnapshot(STIndicator)
    const SSGame = useSnapshot(STGame)
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
        autoRotate: SSIndicator.id && !['Join', 'Game'].includes(SSUI.value.name),
        maxPolarAngle: SSUI.value.name === 'Game' ? Math.PI : Math.PI / 2.2,
        minPolarAngle: SSUI.value.name === 'Game' ? 0 : Math.PI / 2.2
    }

    const zoomOut = core.isMobile ? [1.5, 1.5, 3, 3, 1.5] : [1, 1, 1, 1, 1]
    

    useEffect(() => {
        if (SSUI.history.index === 0) {
            gsap.to(camera.current.position, { duration: 2.5, delay: 0.5, x: 0, y: 1, z: 12 * zoomOut[0] })
        } else if (SSUI.value.name === 'Game') {
            if (SSGame.ui === 'Winner') {
                controls.current.autoRotate = false
                gsap.to(camera.current.position, { duration: 2.5, delay: 0.5, x: 0, y: 2, z: 14 * zoomOut[1] })
            } else if (SSGame.ui === 'Board') {
                controls.current.autoRotate = true
                gsap.to(camera.current.position, { duration: 2, x: 0, y: 1, z: (10 + SSIndicator.players.all) * zoomOut[2] })
            } else {
                gsap.to(camera.current.position, { duration: 2, x: 0, y: 10 + SSIndicator.players.all * 2.5, z: 0 })
            }
        } else if (SSUI.value.name !== 'Game') {
            gsap.to(camera.current.position, { duration: 2, x: 0, y: 1, z: (10 + SSIndicator.players.all) * zoomOut[3] })
        } else {
            gsap.to(camera.current.position, { duration: 2, x: 0, y: 1, z: 12 * zoomOut[4] })
        }
    }, [SSUI.value.name, SSGame.ui, SSIndicator.players.all])


    return (
        <>
            <PerspectiveCamera ref={camera} position={[0, 0, 0]} {...cameraOptions} makeDefault />
            <OrbitControls ref={controls} {...orbitOptions} />
        </>
    )
}