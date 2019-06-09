import moment from 'moment';

export const mayorDeDieciocho = ( nombreDelCampo: string ) => ( valor: string ) => {

	const dieciocho: number = 18;

	return ( ( moment().diff(valor, 'years') ) < dieciocho )
		? 'Se necesita ser mayor de 18 años para crear una cuenta'
		: true;
};