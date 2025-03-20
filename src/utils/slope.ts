export default function slope(vecA: [number, number], vecB: [number, number]): number {
	return (vecB[1] - vecA[1]) / (vecB[0] - vecB[1]);
}
