interface BlockHighlightProps {
  position: [number, number, number] | null;
}

export default function BlockHighlight({ position }: BlockHighlightProps) {
  if (!position) return null;

  const [x, y, z] = position;
  const adjustedPosition: [number, number, number] = [x + 0.5, y + 0.5, z + 0.5];

  return (
    <mesh position={adjustedPosition}>
      <boxGeometry args={[1.01, 1.01, 1.01]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.8} />
    </mesh>
  );
}
