export const Floor = () => {
    return (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry attach='geometry' args={[100, 100]} />
            <shadowMaterial attach='material' transparent opacity={0.4} />
        </mesh>
    )
}