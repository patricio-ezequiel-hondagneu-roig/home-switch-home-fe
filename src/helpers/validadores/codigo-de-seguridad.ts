import moment from 'moment';

export const codigoDeSeguridad = ( nombreDelCampo: string ) => ( valor: string ) => {

	return ( moment() > moment(valor) )
		? 'El código de expiración no es válido'
		: true;

};