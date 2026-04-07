<script lang="ts">
	import Chart, { type TooltipItem } from 'chart.js/auto';
	import { BankType, savingsAccounts } from '$utils/savingsAccounts';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import { chart } from '$lib/components/chart/chart.svelte.js';
	import type { Action } from 'svelte/action';
	import { getGeneralSettingsState } from '$lib/state/general-settings-state.svelte';
	import { formatToCurrency } from '$utils/currency';

	let width: number = $state(0);
	let height: number = $state(0);
	let canvasRef: HTMLCanvasElement | undefined = $state();

	const generalSettings = getGeneralSettingsState();

	const amounts = $derived([
		...new Set(
			new Array<number>(Math.floor(generalSettings.maxAmountSaved / 1000)).fill(0).map((_, i) => {
				const value = i * 1000;
				if (value > generalSettings.maxAmountSaved) return generalSettings.maxAmountSaved;
				if (value < generalSettings.minAmountSaved) return generalSettings.minAmountSaved;
				return value;
			})
		)
	]);

	// Glow plugin — draws a canvas shadow behind each dataset path
	const glowPlugin = {
		id: 'glowPlugin',
		beforeDatasetsDraw(chartInstance: InstanceType<typeof Chart>) {
			chartInstance.ctx.save();
		},
		beforeDatasetDraw(chartInstance: InstanceType<typeof Chart>, args: { index: number }) {
			const dataset = chartInstance.data.datasets[args.index];
			const color = dataset.borderColor as string;
			chartInstance.ctx.shadowColor = color;
			chartInstance.ctx.shadowBlur = 5;
		},
		afterDatasetDraw(chartInstance: InstanceType<typeof Chart>) {
			chartInstance.ctx.shadowColor = 'transparent';
			chartInstance.ctx.shadowBlur = 0;
		},
		afterDatasetsDraw(chartInstance: InstanceType<typeof Chart>) {
			chartInstance.ctx.restore();
		}
	};

	function makeGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);
		gradient.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
		gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
		return gradient;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function buildDatasets(canvas: HTMLCanvasElement, bankTypes: string[]): any[] {
		const ctx = canvas.getContext('2d')!;
		return savingsAccounts
			.filter((acc) => bankTypes.includes(acc.bankType))
			.map((account) => {
				const data = amounts.map((amount) =>
					account.interestEarnedOnAmount(amount, {
						taxEnabled: !!generalSettings.taxEnabled
					})
				);
				return {
					label: account.name,
					data,
					borderColor: account.color,
					backgroundColor: makeGradient(ctx, account.color),
					borderDash: account.dashed ? [8, 4] : [],
					fill: true,
					tension: 0.4,
					pointRadius: 0,
					pointHitRadius: 8,
					pointHoverRadius: 6,
					pointHoverBackgroundColor: account.color,
					pointHoverBorderColor: 'white',
					pointHoverBorderWidth: 2,
					borderWidth: account.dashed ? 1.8 : 2.5
				};
			});
	}

	const bankTypes = $derived.by(() => {
		let types = Object.values(BankType);
		if (!generalSettings.fintechBanksEnabled) types = types.filter((t) => t !== BankType.FINTECH);
		if (!generalSettings.traditionalBanksEnabled)
			types = types.filter((t) => t !== BankType.TRADITIONAL_BANK);
		return types;
	});

	const drawGraph = (node: HTMLCanvasElement) => {
		chart.chart = new Chart(node, {
			type: 'line',
			plugins: [glowPlugin],
			data: {
				labels: amounts.map((x) => x.toString()),
				datasets: buildDatasets(node, Object.values(BankType))
			},
			options: {
				maintainAspectRatio: false,
				responsive: false,
				plugins: {
					tooltip: {
						backgroundColor: 'rgba(15,12,41,0.92)',
						borderColor: 'rgba(255,255,255,0.15)',
						borderWidth: 1,
						titleColor: 'rgba(255,255,255,0.5)',
						bodyColor: 'rgba(255,255,255,0.85)',
						padding: 12,
						cornerRadius: 10,
						callbacks: {
							title: (val: TooltipItem<'line'>[]) => formatToCurrency(parseInt(val[0].label)),
							label: (val: TooltipItem<'line'>) =>
								` ${val.dataset.label}: ${formatToCurrency(val.raw as number)}`
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
								borderColor: 'rgba(56,189,248,0.6)',
								borderDash: [4, 4]
							},
							thresholdLineLabel: {
								type: 'label',
								xValue: 0,
								yValue: 0,
								content: [''],
								display: false,
								backgroundColor: 'rgba(15,12,41,0.88)',
								borderColor: 'rgba(56,189,248,0.3)',
								borderWidth: 1,
								borderRadius: 6,
								color: 'white',
								font: { size: 13 },
								padding: { x: 10, y: 6 }
							}
						}
					},
					legend: {
						position: 'bottom',
						labels: {
							color: 'rgba(255,255,255,0.55)',
							borderRadius: 4,
							useBorderRadius: true,
							padding: 16,
							font: { size: 11 }
						}
					}
				},
				scales: {
					y: {
						title: {
							text: 'Interest earned per annum',
							display: true,
							color: 'rgba(255,255,255,0.4)',
							font: { size: 12 }
						},
						ticks: {
							color: 'rgba(255,255,255,0.35)',
							callback(value: number | string) {
								const val = typeof value === 'number' ? value : parseInt(value, 10);
								return formatToCurrency(val);
							}
						},
						grid: {
							color: 'rgba(255,255,255,0.06)',
							borderDash: [4, 6]
						}
					},
					x: {
						title: {
							text: 'Amount saved at start of year',
							display: true,
							color: 'rgba(255,255,255,0.4)',
							font: { size: 12 }
						},
						ticks: {
							color: 'rgba(255,255,255,0.35)',
							autoSkip: true,
							maxTicksLimit: 15,
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							callback(this: any, index: number | string) {
								const amount = parseInt(
									this.getLabelForValue(typeof index === 'number' ? index : parseInt(index, 10))
								);
								return formatToCurrency(amount);
							}
						},
						grid: { display: false }
					}
				},
				elements: {
					point: {
						radius: 0,
						hitRadius: 8,
						hoverRadius: 6
					}
				}
			}
		});
	};

	const onChartLoad: Action<HTMLCanvasElement> = (node: HTMLCanvasElement) => {
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

	$effect(() => {
		if (chart.chart && canvasRef) {
			chart.chart.data.datasets = buildDatasets(canvasRef, bankTypes);
			chart.chart.data.labels = amounts.map((x) => x.toString());
			chart.chart.update();
		}
	});
</script>

<div style="display:flex; flex-direction:column; flex:1; min-height:0; overflow:hidden;">
	<div
		style="padding:20px 24px 8px; font-size:13px; color:rgba(255,255,255,0.5); letter-spacing:0.3px;"
	>
		Interest earned per annum · Amount saved at start of year
	</div>
	<div
		bind:clientHeight={height}
		bind:clientWidth={width}
		style="flex:1; min-height:0; position:relative;"
	>
		{#if height && width}
			<canvas
				id="graph"
				use:onChartLoad
				bind:this={canvasRef}
				{height}
				{width}
				style="position:absolute; inset:0;"
			></canvas>
		{/if}
	</div>
</div>
