export default function remToPx(remValue: string): number {
	return (
		parseFloat(remValue.slice(0, -3)) *
		parseInt(getComputedStyle(document.documentElement).fontSize)
	);
}
