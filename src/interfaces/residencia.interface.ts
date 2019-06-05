import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Residencia {
	_id: string;
	titulo: string;
	pais: string;
	provincia: string;
	localidad: string;
	domicilio: string;
	descripcion: string;
	fotos: string[ ];
	montoInicialDeSubasta: number;
}

export type ResidenciaParaCrear = RemoverPropiedades<Residencia, '_id'>;
export type ResidenciaParaModificar = RemoverPropiedades<Residencia, '_id'>;