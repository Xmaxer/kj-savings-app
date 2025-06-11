export function formatToCurrency(amount: string | number) {
	if (typeof amount === 'string') {
		amount = parseFloat(amount);
	}
	return new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR'
	}).format(amount);
}
