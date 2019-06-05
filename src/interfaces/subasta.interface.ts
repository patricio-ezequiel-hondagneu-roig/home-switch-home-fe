import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Subasta {
	_id: string;
	idResidencia: string;
	montoInicial: number;
	fechaDeInicio: string;
	fechaDeFin: string;
	ofertas: string[ ];
}

export type SubastaParaCrear = RemoverPropiedades<Subasta, '_id' | 'ofertas'>;
export type SubastaParaModificar = RemoverPropiedades<Subasta, '_id' | 'idResidencia' | 'ofertas' >;