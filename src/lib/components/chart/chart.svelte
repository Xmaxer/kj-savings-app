<script lang="ts">
	import Chart from 'chart.js/auto';
	import { BankType, savingsAccounts } from '$utils/savingsAccounts';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import getTailwindProperty from '$utils/getTailwindProperty';
	import { chart } from '$lib/components/chart/chart.svelte.js';
	import type { Action } from 'svelte/action';
	import remToPx from '$utils/remToPx.js';
	import hslPointsToHslString from '$utils/hslPointsToHslString.js';
	import { getGeneralSettingsState } from '$lib/components/chart-controls/general-settings/general-settings-state.svelte';
	import { formatToCurrency } from '$utils/currency';

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasRef: HTMLCanvasElement | undefined = $state();

	const generalSettings = getGeneralSettingsState();

	const amounts = $derived([
		...new Set(
			new Array<number>(Math.floor(generalSettings.maxAmountSaved / 1000)).fill(0).map((_, i) => {
				const value = i * 1000;

				if (value > generalSettings.maxAmountSaved) {
					return generalSettings.maxAmountSaved;
				}

				if (value < generalSettings.minAmountSaved) {
					return generalSettings.minAmountSaved;
				}

				return value;
			})
		)
	]);

	const drawGraph = (node: HTMLCanvasElement) => {
		chart.chart = new Chart(node, {
			type: 'line',
			data: {
				labels: amounts.map((x) => x.toString()),
				datasets: [
					...savingsAccounts.map((account) => {
						const data = amounts.map((amount) => {
							return account.interestEarnedOnAmount(amount);
						});
						return {
							label: account.name,
							data: data,
							backgroundColor: account.color,
							borderColor: account.color,
							fill: false
						};
					})
				]
			},
			options: {
				maintainAspectRatio: false,
				borderColor: hslPointsToHslString(getTailwindProperty('secondary')),
				responsive: false,
				plugins: {
					tooltip: {
						backgroundColor: hslPointsToHslString(getTailwindProperty('primary')),
						titleColor: hslPointsToHslString(getTailwindProperty('primary-foreground')),
						bodyColor: hslPointsToHslString(getTailwindProperty('primary-foreground')),
						callbacks: {
							title: (val) => {
								return formatToCurrency(val[0].label);
							},
							label: (val) => {
								return `Interest earned (${val.dataset.label}): ${formatToCurrency(val.raw as number)}`;
							}
						}
					},
					annotation: {
						annotations: {
							thresholdLine: {
								type: 'line',
								display: false,
								xMin: 0,
								xMax: 0,
								borderWidth: 1,
								borderColor: '#00ffff'
							},
							thresholdLineLabel: {
								type: 'label',
								xValue: 0,
								yValue: 0,
								content: [''],
								display: false,
								backgroundColor: hslPointsToHslString(getTailwindProperty('primary')),
								borderRadius: remToPx(getTailwindProperty('radius')),
								color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
								font: {
									size: 18
								}
							}
						}
					},
					legend: {
						labels: {
							color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
							borderRadius: 5,
							useBorderRadius: true
						},
						position: 'bottom'
					}
				},
				scales: {
					y: {
						title: {
							text: 'Interest earned per annum',
							display: true,
							color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
							font: {
								size: 18
							}
						},
						ticks: {
							color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
							callback(value: number | string) {
								const val = typeof value === 'number' ? value : parseInt(value, 10);
								return formatToCurrency(val);
							}
						},
						grid: {
							color: hslPointsToHslString(getTailwindProperty('primary')),
							display: false
						}
					},
					x: {
						title: {
							text: 'Amount saved at start of year',
							display: true,
							color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
							font: {
								size: 18
							}
						},
						ticks: {
							color: hslPointsToHslString(getTailwindProperty('primary-foreground')),
							autoSkip: true,
							maxTicksLimit: 15,
							callback(index: number | string) {
								const amount = parseInt(
									this.getLabelForValue(typeof index === 'number' ? index : parseInt(index, 10))
								);
								return formatToCurrency(amount);
							}
						},
						grid: {
							display: false,
							color: hslPointsToHslString(getTailwindProperty('primary'))
						}
					}
				},
				elements: {
					point: {
						radius: 0,
						backgroundColor: '#55555580',
						hitRadius: 4,
						hoverRadius: 10
					}
				}
			}
		});
	};

	const onChartLoad: Action = (node: HTMLCanvasElement) => {
		Chart.register(annotationPlugin);
		drawGraph(node);
	};

	$effect(() => {
		if (canvasRef && height && width) {
			canvasRef.width = width;
			canvasRef.height = height;
			chart.chart?.resize(width, height);
		}
	});

	const bankTypes = $derived.by(() => {
		let types = Object.values(BankType);
		if (!generalSettings.fintechBanksEnabled) {
			types = types.filter((type) => type !== BankType.FINTECH);
		}
		if (!generalSettings.traditionalBanksEnabled) {
			types = types.filter((type) => type !== BankType.TRADITIONAL_BANK);
		}
		return types;
	});

	$effect(() => {
		if (chart.chart) {
			chart.chart.data.datasets = [
				...savingsAccounts
					.filter((acc) => bankTypes.includes(acc.bankType))
					.map((account) => {
						const data = amounts.map((amount) => {
							return account.interestEarnedOnAmount(amount, {
								taxEnabled: !!generalSettings.taxEnabled
							});
						});
						return {
							label: account.name,
							data: data,
							backgroundColor: account.color,
							borderColor: account.color,
							fill: false
						};
					})
			];
			chart.chart.data.labels = [...amounts];

			chart.chart.update();
		}
	});
</script>

<div class="flex h-full flex-col overflow-hidden text-center">
	<h1 class="p-8">Interest earned for amount saved per annum</h1>
	{#if !height || !width}
		<div bind:clientHeight={height} bind:clientWidth={width} class="flex-grow bg-black"></div>
	{/if}
	{#if height && width}
		<canvas id="graph" use:onChartLoad bind:this={canvasRef} {height} {width}></canvas>
	{/if}
</div>
