import { Center, Text3D } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { STGame } from '../stores/app.store'
import { Player } from './player.scn'


export const Winner = () => {
    const SSGame = useSnapshot(STGame)
    

    return (
        <>
            <Center position={[0, 2.1, 0]}>
                <Text3D font={'Barlow_Regular.json'} bevelEnabled bevelSize={0.03} size={1} height={0.01}>
                    Winner
                    <meshStandardMaterial color={'#33FF66'} metalness={0} roughness={1} />
                </Text3D>
            </Center>
            <Player player={SSGame.winner} position={[0, 0, 0]} />
        </>
    )
}