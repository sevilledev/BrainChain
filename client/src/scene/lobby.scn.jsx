import { useSnapshot } from 'valtio'
import { STProfile, STScene } from '../stores/app.store'
import { Player } from './player.scn'


export const Lobby = () => {
    const SSProfile = useSnapshot(STProfile)
    const SSScene = useSnapshot(STScene)

    return SSScene.name === 'Lobby' && <Player player={SSProfile} position={[0, 0, 0]} />
}