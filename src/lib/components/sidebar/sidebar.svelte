<script lang="ts">
	import { TrendingUp } from '@lucide/svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';
	import { Button } from '$lib/components/ui/button';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectGroup
	} from '$lib/components/ui/select';
	import {
		GeneralSettingsStateDefaults,
		getGeneralSettingsState
	} from '$lib/state/general-settings-state.svelte';
	import { savingsAccounts, savingsIntersect } from '$utils/savingsAccounts';
	import { formatToCurrency } from '$utils/currency';
	import { chart } from '$lib/components/chart/chart.svelte.js';

	const STEP_SIZE = 1000;

	const generalSettings = getGeneralSettingsState();

	// Range slider visual state (live feedback before commit)
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

	// Compare accounts
	const WorthinessStatus = {
		WORTH_IT: 'WORTH_IT',
		NOT_WORTH_IT: 'NOT_WORTH_IT'
	} as const;

	let compareKey = $state(new Date());
	let firstSelectedAccount: string | undefined = $state();
	let secondSelectedAccount: string | undefined = $state();
	let compareStatus: keyof typeof WorthinessStatus | undefined = $state();
	let thresholdValue = $state(0);

	$effect(() => {
		if (!chart.chart) return;
		const lineSettings = chart.chart.options.plugins.annotation.annotations.thresholdLine;
		const lineLabelSettings = chart.chart.options.plugins.annotation.annotations.thresholdLineLabel;

		if (!firstSelectedAccount || !secondSelectedAccount) {
			lineSettings.display = false;
			lineLabelSettings.display = false;
			chart.chart.update();
			compareStatus = undefined;
			return;
		}

		const accountA = savingsAccounts.find((acc) => acc.name === secondSelectedAccount);
		const accountB = savingsAccounts.find((acc) => acc.name === firstSelectedAccount);

		if (!accountA || !accountB) return;

		const xIntercept = savingsIntersect(accountA, accountB, {
			taxEnabled: generalSettings.taxEnabled
		})?.[0];

		if (!xIntercept || accountA.slope > accountB.slope) {
			lineSettings.display = false;
			lineLabelSettings.display = false;
			chart.chart.update();
			compareStatus = WorthinessStatus.NOT_WORTH_IT;
			return;
		}

		thresholdValue = xIntercept;
		compareStatus = WorthinessStatus.WORTH_IT;

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

	const onCompareReset = () => {
		compareKey = new Date();
		firstSelectedAccount = undefined;
		secondSelectedAccount = undefined;
	};
</script>

<aside
	style="
    width: 290px;
    flex-shrink: 0;
    background: rgba(20,16,50,0.85);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
  "
>
	<!-- Logo -->
	<div style="display:flex; align-items:center; gap:12px;">
		<div
			style="
        width:38px; height:38px;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 16px rgba(56,189,248,0.4);
        flex-shrink: 0;
      "
		>
			<TrendingUp size={20} color="white" />
		</div>
		<div>
			<div style="font-size:15px; font-weight:600; color:rgba(255,255,255,0.9);">KJ Savings</div>
			<div style="font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:0.8px;">
				INTEREST CALCULATOR
			</div>
		</div>
	</div>

	<div style="height:1px; background:rgba(255,255,255,0.08);"></div>

	<!-- Settings -->
	<div>
		<div
			style="font-size:10px; font-weight:600; color:rgba(255,255,255,0.35); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px;"
		>
			Settings
		</div>
		<div style="display:flex; flex-direction:column; gap:4px;">
			<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0;">
				<label for="tax" style="font-size:13px; color:rgba(255,255,255,0.75); cursor:pointer;"
					>Tax</label
				>
				<Switch id="tax" bind:checked={generalSettings.taxEnabled} />
			</div>
			<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0;">
				<label
					for="fintech_banks"
					style="font-size:13px; color:rgba(255,255,255,0.75); cursor:pointer;">Fintech banks</label
				>
				<Switch id="fintech_banks" bind:checked={generalSettings.fintechBanksEnabled} />
			</div>
			<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0;">
				<label
					for="traditional_banks"
					style="font-size:13px; color:rgba(255,255,255,0.75); cursor:pointer;"
					>Traditional banks</label
				>
				<Switch id="traditional_banks" bind:checked={generalSettings.traditionalBanksEnabled} />
			</div>
		</div>
	</div>

	<div style="height:1px; background:rgba(255,255,255,0.08);"></div>

	<!-- Savings Range -->
	<div>
		<div
			style="font-size:10px; font-weight:600; color:rgba(255,255,255,0.35); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px;"
		>
			Savings Range
		</div>
		<Slider
			type="multiple"
			onValueCommit={onAmountSavedValueChanged}
			onValueChange={onAmountSavedRealtimeValueChanged}
			value={[generalSettings.minAmountSaved, generalSettings.maxAmountSaved]}
			max={GeneralSettingsStateDefaults.maxAmountSaved}
			step={STEP_SIZE}
			min={0}
		/>
		<div
			style="display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:rgba(255,255,255,0.4);"
		>
			<span>{formatToCurrency(visualState.min)}</span>
			<span>{formatToCurrency(visualState.max)}</span>
		</div>
	</div>

	<div style="height:1px; background:rgba(255,255,255,0.08);"></div>

	<!-- Compare Accounts -->
	<div style="flex:1; display:flex; flex-direction:column; gap:10px;">
		<div
			style="font-size:10px; font-weight:600; color:rgba(255,255,255,0.35); letter-spacing:1.5px; text-transform:uppercase;"
		>
			Compare Accounts
		</div>

		{#key compareKey}
			<Select
				type="single"
				onValueChange={(v) => {
					firstSelectedAccount = v?.toString();
				}}
			>
				<SelectTrigger style="font-size:12px;">
					{firstSelectedAccount ?? 'Paid account…'}
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

			<div
				style="text-align:center; font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:1px;"
			>
				VS
			</div>

			<Select
				type="single"
				onValueChange={(v) => {
					secondSelectedAccount = v?.toString();
				}}
			>
				<SelectTrigger style="font-size:12px;">
					{secondSelectedAccount ?? 'Baseline account…'}
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

		{#if compareStatus === WorthinessStatus.NOT_WORTH_IT}
			<div
				style="padding:10px 12px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); border-radius:8px; font-size:12px; color:rgba(255,255,255,0.7); line-height:1.5;"
			>
				{firstSelectedAccount} is never worth it over {secondSelectedAccount}
			</div>
		{:else if compareStatus === WorthinessStatus.WORTH_IT}
			<div
				style="padding:10px 12px; background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.25); border-radius:8px; font-size:12px; color:rgba(255,255,255,0.7); line-height:1.5;"
			>
				Worth it after <span style="color:#38bdf8; font-weight:600;"
					>{formatToCurrency(thresholdValue)}</span
				> in savings
			</div>
		{/if}

		<Button onclick={onCompareReset} variant="secondary" style="font-size:12px;">Reset</Button>
	</div>
</aside>
