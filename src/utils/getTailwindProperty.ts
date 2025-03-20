export default function getTailwindProperty(property: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--${property}`);
}
