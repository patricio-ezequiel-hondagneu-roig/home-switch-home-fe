import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Hotsale {
	_id: string;
	idPublicacion: string;
	fechaDeInicio: string;
	fechaDeFin: string;
	monto: number;
}

export type HotsaleParaCrear = RemoverPropiedades<Hotsale, '_id'>;