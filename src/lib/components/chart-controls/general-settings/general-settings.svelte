<script lang="ts">
	import { Switch } from '$lib/shadcn/ui/switch';
	import { Separator } from '$lib/shadcn/ui/separator';
	import { generalSettingsState } from '$lib/components/chart-controls/general-settings/general-settings-state.svelte';
</script>

<div class="flex justify-center">
	<div class="flex gap-2">
		<Switch
			class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
			id="tax"
			bind:checked={$generalSettingsState.taxEnabled}
		/>
		<label for="tax"> Tax </label>
	</div>
	<Separator orientation="vertical" class="mx-4" />
	<div class="flex flex-col gap-4">
		<div class="flex gap-2">
			<Switch
				class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
				id="fintech_banks"
				bind:checked={$generalSettingsState.fintechBanksEnabled}
			/>
			<label for="fintech_banks"> Fintech banks </label>
		</div>
		<div class="flex gap-2">
			<Switch
				class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
				id="traditional_banks"
				bind:checked={$generalSettingsState.traditionalBanksEnabled}
			/>
			<label for="traditional_banks"> Traditional banks </label>
		</div>
	</div>
</div>
