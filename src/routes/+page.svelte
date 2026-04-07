<script>
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import Chart from '$lib/components/chart/chart.svelte';
</script>

<div style="display:flex; width:100%; height:100vh; gap:16px; padding:16px; box-sizing:border-box;">
	<Sidebar />
	<div
		style="flex:1; min-width:0; min-height:0; background:rgba(20,16,50,0.85); border:1px solid rgba(255,255,255,0.14); border-radius:16px; overflow:hidden; display:flex; flex-direction:column;"
	>
		<Chart />
	</div>
</div>
