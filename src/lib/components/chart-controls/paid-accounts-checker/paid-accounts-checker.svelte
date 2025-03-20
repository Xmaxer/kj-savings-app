<script lang="ts">
	import { chart } from '$lib/components/chart/chart.svelte.js';
	import { savingsAccounts } from '$utils/savingsAccounts';
	import { savingsIntersect } from '$utils/savingsAccounts';
	import { Button } from '$lib/shadcn/ui/button';
	import {
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
		SelectGroup,
		Select
	} from '$lib/shadcn/ui/select';
	import { generalSettingsState } from '../general-settings/general-settings-state.svelte';

	const WorthinessStatus = {
		WORTH_IT: 'WORTH_IT',
		NOT_WORTH_IT: 'NOT_WORTH_IT'
	} as const;

	let firstSelectedAccount: string | undefined = $state();
	let secondSelectedAccount: string | undefined = $state();
	let key = $state(new Date());

	let status: keyof typeof WorthinessStatus | undefined = $state();
	let thresholdValue = $state(0);

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

		const accountA = savingsAccounts.find((acc) => acc.name === firstSelectedAccount);
		const accountB = savingsAccounts.find((acc) => acc.name === secondSelectedAccount);

		if (!accountA || !accountB) {
			return;
		}

		const xIntercept = savingsIntersect(accountA, accountB, {
			taxEnabled: $generalSettingsState.taxEnabled
		})?.[0];

		if (!xIntercept) {
			lineSettings.display = false;
			lineLabelSettings.display = false;
			chart.chart.update();
			status = WorthinessStatus.NOT_WORTH_IT;
			return;
		}

		console.log(xIntercept);
		thresholdValue = xIntercept;
		status = WorthinessStatus.WORTH_IT;

		const newX = xIntercept / 1000;

		lineSettings.display = true;
		lineSettings.xMin = newX;
		lineSettings.xMax = newX;

		lineLabelSettings.display = true;
		lineLabelSettings.xValue = newX;
		lineLabelSettings.yValue = undefined;
		lineLabelSettings.content = [
			'Worth it after:',
			new Intl.NumberFormat('en-IE', {
				style: 'currency',
				currency: 'EUR'
			}).format(xIntercept)
		];

		chart.chart.update();
	});

	const onReset = () => {
		key = new Date();
		firstSelectedAccount = undefined;
		secondSelectedAccount = undefined;
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4 text-center">
		<p>When is</p>
		{#key key}
			<Select
				onSelectedChange={(v) => {
					secondSelectedAccount = v?.value?.toString();
				}}
			>
				<SelectTrigger class="w-[180px]">
					<SelectValue placeholder="Savings account" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{#each savingsAccounts.filter((sa) => !!sa.yearlyAccountCost) as account (account.name)}
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
		<p>worth it compared to</p>
		{#key key}
			<Select
				onSelectedChange={(v) => {
					firstSelectedAccount = v?.value?.toString();
				}}
			>
				<SelectTrigger class="w-[180px]">
					<SelectValue placeholder="Savings account" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{#each savingsAccounts as account (account.name)}
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
		<p>?</p>
	</div>
	{#if status === WorthinessStatus.NOT_WORTH_IT}
		<p>{`${secondSelectedAccount} is never worth it over ${firstSelectedAccount}`}</p>
	{:else if status === WorthinessStatus.WORTH_IT}
		<p>
			{`${secondSelectedAccount} is better than ${firstSelectedAccount} after reaching ${new Intl.NumberFormat(
				'en-IE',
				{
					style: 'currency',
					currency: 'EUR'
				}
			).format(thresholdValue)} in savings`}
		</p>
	{/if}
	<Button on:click={onReset} variant="secondary">Reset</Button>
</div>
