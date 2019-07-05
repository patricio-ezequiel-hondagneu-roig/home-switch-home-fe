import moment from 'moment';
import { Publicacion } from '@/interfaces/publicacion.interface';

/*
	Tienen que llegar dos parametros:
		> semana ingresada en el formulario.
		> semanas de la residencia.
*/

export const colisionDeSemanas = ( nombreDelCampo: string, publicaciones: Publicacion[ ]  ) => ( valor: unknown ) => {
	if (typeof valor !== 'string') {
		return `La propieddad "${ nombreDelCampo }" tiene que ser una cadena de texto.`;
	}

	const diasEnSemana: number = 7;
	const fechaDeInicioDeSemanaDeseada = moment(valor);
	const fechaDeFinDeSemanaDeseada =  moment(valor).add( diasEnSemana, 'days' );

	const publicacionQueColisiona = publicaciones.find( ( publicacion ) => {
		const fechaDeInicioDePublicacion = moment(publicacion.fechaDeInicioDeSemana);
		const fechaDeFinDePublicacion = moment(publicacion.fechaDeInicioDeSemana).add( diasEnSemana, 'days' );

		const solapaInicio = fechaDeInicioDeSemanaDeseada > fechaDeInicioDePublicacion
			&& fechaDeInicioDeSemanaDeseada < fechaDeFinDePublicacion;

		const solapaFin = fechaDeFinDeSemanaDeseada > fechaDeInicioDePublicacion
			&& fechaDeFinDeSemanaDeseada < fechaDeFinDePublicacion;

		const solapaTotal = fechaDeInicioDeSemanaDeseada === fechaDeInicioDePublicacion
			&& fechaDeFinDeSemanaDeseada === fechaDeFinDePublicacion;

		return (solapaInicio || solapaFin || solapaTotal);
	});

	return ( publicacionQueColisiona !== undefined )
		? 'La semana ingresada no es valida, ya hay una publicacion activa para la semana que se hace referencia.'
		: true;

};