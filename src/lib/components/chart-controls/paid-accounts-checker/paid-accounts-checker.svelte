<script lang="ts">
	import { chart } from '$lib/components/chart/chart.svelte.js';
	import { savingsAccounts } from '$utils/savingsAccounts';
	import { savingsIntersect } from '$utils/savingsAccounts';
	import { Button } from '$lib/components/ui/button';
	import {
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectGroup,
		Select
	} from '$lib/components/ui/select';
	import { getGeneralSettingsState } from '$lib/components/chart-controls/general-settings/general-settings-state.svelte';
	import { formatToCurrency } from '$utils/currency';

	const WorthinessStatus = {
		WORTH_IT: 'WORTH_IT',
		NOT_WORTH_IT: 'NOT_WORTH_IT'
	} as const;

	let secondSelectedAccount: string | undefined = $state();
	let firstSelectedAccount: string | undefined = $state();
	let key = $state(new Date());

	let status: keyof typeof WorthinessStatus | undefined = $state();
	let thresholdValue = $state(0);

	const generalSettings = getGeneralSettingsState();

	$effect(() => {
		if (!chart.chart) return;
		const lineSettings = chart.chart.options.plugins.annotation.annotations.thresholdLine;
		const lineLabelSettings = chart.chart.options.plugins.annotation.annotations.thresholdLineLabel;

		if (!firstSelectedAccount || !secondSelectedAccount) {
			lineSettings.display = false;
			lineLabelSettings.display = false;
			chart.chart.update();
			status = undefined;
			return;
		}

		const accountA = savingsAccounts.find((acc) => acc.name === secondSelectedAccount);
		const accountB = savingsAccounts.find((acc) => acc.name === firstSelectedAccount);

		if (!accountA || !accountB) {
			return;
		}

		const xIntercept = savingsIntersect(accountA, accountB, {
			taxEnabled: generalSettings.taxEnabled
		})?.[0];

		if (!xIntercept || accountA.slope > accountB.slope) {
			lineSettings.display = false;
			lineLabelSettings.display = false;
			chart.chart.update();
			status = WorthinessStatus.NOT_WORTH_IT;
			return;
		}

		console.log(accountA.slope);
		console.log(accountB.slope);

		thresholdValue = xIntercept;
		status = WorthinessStatus.WORTH_IT;

		const newX = xIntercept / 1000;

		lineSettings.display = true;
		lineSettings.xMin = newX;
		lineSettings.xMax = newX;

		lineLabelSettings.display = true;
		lineLabelSettings.xValue = newX;
		lineLabelSettings.yValue = undefined;
		lineLabelSettings.content = ['Worth it after:', formatToCurrency(xIntercept)];

		chart.chart.update();
	});

	const onReset = () => {
		key = new Date();
		secondSelectedAccount = undefined;
		firstSelectedAccount = undefined;
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4 text-center">
		<p>When is</p>
		{#key key}
			<Select
				type="single"
				onValueChange={(v) => {
					firstSelectedAccount = v?.toString();
				}}
			>
				<SelectTrigger class="w-[180px]">
					{firstSelectedAccount ?? 'Savings account'}
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{#each savingsAccounts.filter((sa) => !!sa.yearlyAccountCost) as account (account.name)}
							<SelectItem
								disabled={secondSelectedAccount === account.name}
								value={account.name}
								label={account.name}
							/>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
		{/key}
		<p>worth it compared to</p>
		{#key key}
			<Select
				type="single"
				onValueChange={(v) => {
					secondSelectedAccount = v?.toString();
				}}
			>
				<SelectTrigger class="w-[180px]">
					{secondSelectedAccount ?? 'Savings account'}
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{#each savingsAccounts as account (account.name)}
							<SelectItem
								disabled={firstSelectedAccount === account.name}
								value={account.name}
								label={account.name}
							/>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
		{/key}
		<p>?</p>
	</div>
	{#if status === WorthinessStatus.NOT_WORTH_IT}
		<p>{`${firstSelectedAccount} is never worth it over ${secondSelectedAccount}`}</p>
	{:else if status === WorthinessStatus.WORTH_IT}
		<p>
			{`${firstSelectedAccount} is better than ${secondSelectedAccount} after reaching ${formatToCurrency(thresholdValue)} in savings`}
		</p>
	{/if}
	<Button onclick={onReset} variant="secondary">Reset</Button>
</div>
