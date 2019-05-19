import { VuetifyTheme } from 'vuetify';

export type VuetifyThemeOptionName = keyof Pick<
	VuetifyTheme,
	'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
>;