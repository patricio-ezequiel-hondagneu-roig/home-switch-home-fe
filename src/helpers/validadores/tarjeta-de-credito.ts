/**
 * Dado un nombre de campo retorna una función que valida si un dato de tipo _string_ tiene formato de tarjeta de
 * crédito.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const tarjetaDeCredito = ( nombreDelCampo: string ) => ( valor?: unknown ) => {
	if ( typeof valor !== 'string' ) {
		return `El campo ${ nombreDelCampo } no contiene texto`;
	}
	if ( valor.trim( ) === '' ) {
		return `El campo "${ nombreDelCampo }" debe tener contenido`;
	}

	const patronDeTarjetaDeCredito: RegExp = /^\s*[0-9]{16}\s*$/;

	if ( patronDeTarjetaDeCredito.test( valor ) ) {
		return true;
	}

	const patronDeTarjetaDeCreditoIncompleta: RegExp = /^\s*[0-9]{1,15}\s*$/;

	if ( patronDeTarjetaDeCreditoIncompleta.test( valor ) ) {
		return `El campo "${ nombreDelCampo }" debe contener 16 dígitos`;
	}

	return `El campo "${ nombreDelCampo }" debe contener un número de tarjeta de crédito`;
};