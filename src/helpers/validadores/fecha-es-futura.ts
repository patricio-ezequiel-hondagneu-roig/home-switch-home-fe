import moment from 'moment';

export const fechaEsFutura = ( nombreDelCampo: string ) => ( valor: string ) => {

	// chequea que la fecha ingresada no sea anterior a la actual
	return ( moment( valor ).isBefore( moment() ) )
		? `La ${ nombreDelCampo } es anterior a la actual`
		: true;

};