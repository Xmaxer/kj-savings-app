import { writable } from 'svelte/store';

export const generalSettingsState = writable({
	taxEnabled: true,
	fintechBanksEnabled: true,
	traditionalBanksEnabled: true
});
