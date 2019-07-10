import { TipoDeAdquisicion } from '@/utils/tipoDeAdquisicion.enum';
import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Adquisicion {
	readonly _id: string;
	readonly idCliente: string;
	readonly idPublicacion: string;
	readonly monto: number;
	readonly fechaDeCreacion: string;
	readonly tipoDeAdquisicion: TipoDeAdquisicion;
}

export type AdquisicionWithoutId = RemoverPropiedades<Adquisicion, '_id' >;