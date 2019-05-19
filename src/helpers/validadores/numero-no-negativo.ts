/**
 * Dado un nombre de campo retorna una función que valida si un dato de tipo _number_ tiene un valor no negativo.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const numeroNoNegativo = ( nombreDelCampo: string ) => ( valor: unknown ) => {
	if ( typeof valor !== 'number' && typeof valor !== 'string' ) {
		return `El campo ${ nombreDelCampo } no es un número`;
	}

	const patronDeNumero: RegExp = /^\s*(?:\+|\-)?[0-9]+(?:(?:\,|\.)[0-9]+)?\s*$/;

	if ( typeof valor === 'string' && ! patronDeNumero.test( valor ) ) {
		return `El campo ${ nombreDelCampo } no es un número`;
	}

	const valorNumerico: number = Number.parseFloat( valor.toString( ) );

	return ( isNaN( valorNumerico ) )
		? `El campo "${ nombreDelCampo }" no es un número`
		: ( valorNumerico < 0 )
			? `El campo "${ nombreDelCampo }" no puede ser negativo`
			: true;
};