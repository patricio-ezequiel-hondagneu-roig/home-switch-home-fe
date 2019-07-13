import moment from 'moment';

export const fechaDeSemana = ( fecha: string ) => ( valor: string ) => {

	const meses: number = 6;

	return ( moment().add(meses, 'M').subtract(1 , 'days') > moment(valor) )
		? 'Faltan menos de 6 meses para el comienzo de la semana'
		: true;

};