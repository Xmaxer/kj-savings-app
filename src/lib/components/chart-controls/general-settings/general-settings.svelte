<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	import {
		GeneralSettingsStateDefaults,
		getGeneralSettingsState
	} from '$lib/components/chart-controls/general-settings/general-settings-state.svelte';
	import { Slider } from '$lib/components/ui/slider';
	import { formatToCurrency } from '$utils/currency.js';

	const STEP_SIZE = 1000;

	const generalSettings = getGeneralSettingsState();

	const visualState = $state({
		min: generalSettings.minAmountSaved,
		max: generalSettings.maxAmountSaved
	});

	const onAmountSavedValueChanged = (values: number[]) => {
		generalSettings.minAmountSaved = values[0];
		generalSettings.maxAmountSaved = values[1];
	};

	const onAmountSavedRealtimeValueChanged = (values: number[]) => {
		visualState.min = values[0];
		visualState.max = values[1];
	};
</script>

<div class="flex justify-center">
	<div class="flex gap-2">
		<Switch
			class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
			id="tax"
			bind:checked={generalSettings.taxEnabled}
		/>
		<label for="tax"> Tax </label>
	</div>
	<Separator orientation="vertical" class="mx-4" />
	<div class="flex flex-col gap-4">
		<div class="flex gap-2">
			<Switch
				class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
				id="fintech_banks"
				bind:checked={generalSettings.fintechBanksEnabled}
			/>
			<label for="fintech_banks"> Fintech banks </label>
		</div>
		<div class="flex gap-2">
			<Switch
				class="data-[state=checked]:bg-input data-[state=unchecked]:bg-primary"
				id="traditional_banks"
				bind:checked={generalSettings.traditionalBanksEnabled}
			/>
			<label for="traditional_banks"> Traditional banks </label>
		</div>
	</div>
	<Separator orientation="vertical" class="mx-4" />
	<div class="w-[500px] space-y-2">
		<p>Savings amount visible range</p>
		<Slider
			type="multiple"
			onValueCommit={onAmountSavedValueChanged}
			onValueChange={onAmountSavedRealtimeValueChanged}
			value={[generalSettings.minAmountSaved, generalSettings.maxAmountSaved]}
			max={GeneralSettingsStateDefaults.maxAmountSaved}
			step={STEP_SIZE}
			min={0}
		/>
		<p>
			{formatToCurrency(visualState.min)} - {formatToCurrency(visualState.max)}
		</p>
	</div>
</div>
