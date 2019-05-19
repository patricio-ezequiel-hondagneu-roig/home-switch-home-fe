/**
 * Dado un nombre de campo retorna una función que valida si un dato tiene un valor concreto.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const requerido = ( nombreDelCampo: string ) => ( valor: unknown ) => {
	return ( valor === undefined || valor === null || ( typeof valor === 'string' && valor === '' ) )
		? `El campo "${ nombreDelCampo }" es obligatorio`
		: true;
};