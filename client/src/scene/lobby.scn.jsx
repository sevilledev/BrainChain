import { useSnapshot } from 'valtio'
import { STProfile } from '../stores/app.store'
import { Player } from './player.scn'


export const Lobby = () => {
    const SSProfile = useSnapshot(STProfile)

    return <Player player={SSProfile} position={[0, 0, 0]} />
}