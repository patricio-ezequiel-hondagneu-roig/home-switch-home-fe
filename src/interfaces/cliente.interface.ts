import { RemoverPropiedades } from '@/typings/remover-propiedades';

export interface Cliente {
	_id: string;
	idSuscripcion: string;
	nombre: string;
	apellido: string;
	email: string;
	contraseña: string;
	fechaDeNacimiento: string;
	celular: string;
	ciudad: string;

	tarjetaDeCredito: string;
	codigoDeSeguridad: string; // Codigo de seguridad de la tarjeta
	fechaDeExpiracion: string; // Fecha de expiracion de la tarjeta

	// Va a tener un arreglo de objetos {fechaDeCreacion: string, valido: boollean} ¿es un arreglo de strings?
	creditos: string[ ];
}

export type ClienteParaCrear = RemoverPropiedades<Cliente, '_id' >;