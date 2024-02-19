import { useSnapshot } from 'valtio'
import { STIndicator, STScene } from '../stores/app.store'


export const Lights = () => {
    const SSScene = useSnapshot(STScene)
    const SSIndicator = useSnapshot(STIndicator)

    const los = 2048

    
    const getPos = () => {
        if (['Lobby', 'Winner'].includes(SSScene.name)) {
            return [-3, 5, 3]
        } else if (SSScene.name === 'Game') {
            return [0, 2 + SSIndicator.players.all / 2, 0]
        }
    }

    const getInts = () => {
        if (['Lobby', 'Winner'].includes(SSScene.name)) {
            return 1
        } else if (SSScene.name === 'Game') {
            return 1
        }
    }


    return (
        <>
            <color attach='background' args={['#15151A']} />
            <ambientLight intensity={0.4} />
            <spotLight castShadow color={'#ffd60a'} intensity={getInts()} position={getPos()} shadow-mapSize-width={los} shadow-mapSize-height={los} />
        </>
    )
}