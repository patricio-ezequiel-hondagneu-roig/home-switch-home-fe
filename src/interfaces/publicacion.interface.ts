import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Publicacion {
	_id: string;
	idResidencia: string;
	montoInicialDeSubasta: number;
	fechaDeInicioDeSemana: string;
	cerroSubasta: boolean;
}

export type PublicacionParaCrear = RemoverPropiedades<Publicacion, '_id' >;
export type PublicacionParaModificar = RemoverPropiedades<Publicacion, '_id' | 'idResidencia' >;