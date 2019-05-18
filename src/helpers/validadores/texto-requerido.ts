/**
 * Dado un nombre de campo retorna una función que valida si un dato de tipo _string_ tiene un valor concreto.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const textoRequerido = ( nombreDelCampo: string ) => ( valor?: string ) => {
	return ( valor !== undefined && valor.trim( ) !== '' )
		? true
		: `El campo "${ nombreDelCampo }" es un campo obligatorio`;
};