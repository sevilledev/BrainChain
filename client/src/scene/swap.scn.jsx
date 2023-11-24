import { useSnapshot } from 'valtio'
import { STScene } from '../stores/app.store'


export const Swap = (props) => {
    const SSScene = useSnapshot(STScene)
    return props.children.filter(c => c.props.name === SSScene.name)
}
