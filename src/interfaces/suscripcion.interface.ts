import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Suscripcion {
	_id: string;
	tipoDeSuscripcion: string;
	monto: number;
	fechaDeCreacion: string;
}

export type SuscripcionParaCrear = RemoverPropiedades<Suscripcion, '_id' >;