import moment from 'moment';

export const cuatroCaracteres = ( nombreDelCampo: string ) => ( valor: string ) => {

	const cuatro: number = 4;

	return ( valor.length < cuatro )
		? 'No es valido el codigo de seguridad'
		: true;
};