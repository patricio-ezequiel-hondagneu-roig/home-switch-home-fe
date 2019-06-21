import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Solicitud {
	_id: string;
	idCliente: string;
}

export type SolicitudParaCrear = RemoverPropiedades<Solicitud, '_id'>;