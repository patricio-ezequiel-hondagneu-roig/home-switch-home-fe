import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Subasta {
	_id: string;
	idResidencia: string;
	montoInicial: number;
	fechaDeInicio: string;
	fechaDeFin: string;
}

export type SubastaParaCrear = RemoverPropiedades<Subasta, '_id' >;
export type SubastaParaModificar = RemoverPropiedades<Subasta, '_id' | 'idResidencia' >;