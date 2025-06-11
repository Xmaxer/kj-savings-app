export const GeneralSettingsStateDefaults = {
	taxEnabled: true,
	fintechBanksEnabled: true,
	traditionalBanksEnabled: true,
	minAmountSaved: 0,
	maxAmountSaved: 150000
};

const generalSettingsState = $state(GeneralSettingsStateDefaults);

export function getGeneralSettingsState() {
	return generalSettingsState;
}
