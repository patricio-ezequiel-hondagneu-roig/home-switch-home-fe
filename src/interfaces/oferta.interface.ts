import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Oferta {
	_id: string;
	idCliente: string;
	idPublicacion: string;
	monto: number;
	fechaDeCreacion: string;
}

export type OfertaParaCrear = RemoverPropiedades<Oferta, '_id'>;
export type OfertaParaModificar = RemoverPropiedades<Oferta, '_id' | 'idCliente' | 'idPublicacion' | 'fechaDeCreacion'>;