import { RemoverPropiedades } from '@/typings/remover-propiedades';
import { TipoDeAdquisicion } from '@/enums/tipoDeAdquisicion.enum';

export interface Adquisicion {
	_id: string;
	idCliente: string;
	idPublicacion: string;
	monto: number;
	fechaDeCreacion: string;
	tipoDeAdquisicion: TipoDeAdquisicion;
}

export type AdquisicionParaCrear = RemoverPropiedades<Adquisicion, '_id' >;
