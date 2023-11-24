export const Lights = () => {
    return (
        <>
            <color attach='background' args={['#15151A']} />
            <ambientLight intensity={0.4} />
            <spotLight castShadow intensity={1} position={[-3, 5, 3]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        </>
    )
}