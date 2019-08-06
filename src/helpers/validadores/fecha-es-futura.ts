import moment from 'moment';

export const fechaEsFutura = ( nombreDelCampo: string ) => ( valor: string ) => {
	const fecha = moment.utc( valor );
	const madrugadaDeHoy = moment.utc( ).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

	// chequea que la fecha ingresada no sea anterior a la actual
	return ( fecha.isBefore( madrugadaDeHoy ) )
		? `La ${ nombreDelCampo } es anterior a la actual`
		: true;

};