import { RemoverPropiedades } from '@/typings/remover-propiedades';
import { Credito } from './credito.interface';

export interface Cliente {
	_id: string;
	idSuscripcion: string;
	nombre: string;
	apellido: string;
	email: string;
	contraseña: string;
	fechaDeNacimiento: string;
	celular: string;
	pais: string;

	tarjetaDeCredito: string;
	codigoDeSeguridad: string; // Codigo de seguridad de la tarjeta
	fechaDeExpiracion: string; // Fecha de expiracion de la tarjeta

	creditos: Credito[ ];
}

export type ClienteParaCrear = RemoverPropiedades<Cliente, '_id' >;