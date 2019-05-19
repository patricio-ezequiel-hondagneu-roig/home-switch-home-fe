import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Subasta {
	idSubasta: string;
	idResidencia: string;
	montoInicial: string;
	fechaDeInicio: string;
	fechaDeFin: string;
	ofertas: string[ ];
}

export type SubastaParaCrear = RemoverPropiedades<Subasta, 'idSubasta'>;
export type SubastaParaModificar = RemoverPropiedades<Subasta, 'idSubasta' | 'idResidencia' | 'ofertas' >;