/**
 * Dado un nombre de campo retorna una función que valida si un dato de tipo _string_ no consiste únicamente de
 * caracteres en blanco.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const textoNoVacio = ( nombreDelCampo: string ) => ( valor?: unknown ) => {
	return ( typeof valor !== 'string' )
		? `El campo "${ nombreDelCampo }" no contiene texto`
		: ( valor.trim( ) === '' )
			? `El campo "${ nombreDelCampo }" debe tener contenido`
			: true;
};