import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';

export interface InformacionDeAlerta {
	esVisible: boolean;
	tipo: VuetifyThemeOptionName;
	texto: string;
}