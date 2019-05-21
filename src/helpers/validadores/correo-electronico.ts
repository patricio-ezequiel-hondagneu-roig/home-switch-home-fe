/**
 * Dado un nombre de campo retorna una función que valida si un dato de tipo _string_ tiene formato de tarjeta de
 * dirección de correo electrónico.
 *
 * Si la validación tiene éxito retorna _true_, en caso contrario retorna un mensaje de error.
 *
 * @param nombreDelCampo nombre del campo incluído en el mensaje de error si la validación falla
 */
export const correoElectronico = ( nombreDelCampo: string ) => ( valor?: unknown ) => {
	if ( typeof valor !== 'string' ) {
		return `El campo ${ nombreDelCampo } no contiene texto`;
	}
	if ( valor.trim( ) === '' ) {
		return `El campo "${ nombreDelCampo }" debe tener contenido`;
	}

	// Expresión regular para verificar correos electrónicos según RFC 5322
	const patronDeCorreoElectronico: RegExp = (
		// tslint:disable-next-line: max-line-length
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	if ( ! patronDeCorreoElectronico.test( valor ) ) {
		return `El campo "${ nombreDelCampo }" no contiene una dirección válida de correo electrónico`;
	}

	return true;
};