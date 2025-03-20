<script lang="ts">
	import PaidAccountsChecker from './paid-accounts-checker/paid-accounts-checker.svelte';
	import GeneralSettings from './general-settings/general-settings.svelte';
	import { Card } from '$lib/shadcn/ui/card';
	import { CardContent } from '$lib/shadcn/ui/card/index.js';
	import { TabsContent, TabsList, TabsTrigger, Tabs } from '$lib/shadcn/ui/tabs';

	const TABS = {
		paid_account_comparison: 'paid_account_comparison',
		general_settings: 'general_settings'
	};
</script>

<!--// TODO add toggle for tax, add toggle between fintech vs traditional banks, add FX currency rate-->
<!--translations, Add cumilitive gain over time-->
<div class="flex flex-col items-center space-y-4 text-center">
	<Tabs>
		<TabsList class="bg-card">
			<TabsTrigger class="data-[state=active]:bg-secondary" value={TABS.paid_account_comparison}
				>Paid account comparison</TabsTrigger
			>
			<TabsTrigger class="data-[state=active]:bg-secondary" value={TABS.general_settings}
				>General settings</TabsTrigger
			>
		</TabsList>
		<TabsContent value={TABS.paid_account_comparison}>
			<Card>
				<CardContent>
					<PaidAccountsChecker />
				</CardContent>
			</Card>
		</TabsContent>
		<TabsContent value={TABS.general_settings}>
			<Card>
				<CardContent>
					<GeneralSettings />
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>

<style>
</style>
