<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();

	let finishedMounting = $state(false);

	onMount(() => {
		//Permanent dark mode
		document.documentElement.classList.add('dark');
		finishedMounting = true;
	});
</script>

{#if finishedMounting}
	{@render children()}
{/if}
