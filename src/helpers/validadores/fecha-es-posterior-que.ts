import moment from 'moment';

export const fechaEsPosteriorQue = ( nombreDelCampo: string , fechaAnterior: string ) => ( valor: string ) => {
	// chequea que la fecha ingresada no sea anterior a la fecha anterior
	return ( moment( valor ).isBefore( fechaAnterior ) )
		? `La ${ nombreDelCampo } es anterior a la primer fecha ingresada`
		: true;

};