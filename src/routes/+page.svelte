<script>
	import ChartControls from '$lib/components/chart-controls/chart-controls.svelte';
	import Chart from '$lib/components/chart/chart.svelte';
</script>

<div class="m-8 flex flex-grow flex-col gap-4">
	<div class="h-[300px] rounded-xl bg-secondary p-8">
		<ChartControls />
	</div>
	<div class="flex-grow rounded-xl bg-secondary p-8">
		<Chart />
	</div>
</div>
