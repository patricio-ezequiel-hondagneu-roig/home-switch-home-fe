export const noMenorQue = ( nombreDelCampo: string , numero: number) => ( valor: number ) => {
	if ( typeof valor !== 'number' && typeof valor !== 'string' ) {
		return `El campo ${ nombreDelCampo } no es un número`;
	}

	const patronDeNumero: RegExp = /^\s*(?:\+|\-)?[0-9]+(?:(?:\,|\.)[0-9]+)?\s*$/;

	if ( typeof valor === 'string' && ! patronDeNumero.test( valor ) ) {
		return `El campo "${ nombreDelCampo }" no es un número`;
	}
	const valorNumerico: number = Number.parseFloat( valor.toString( ) );

	return ( isNaN( valorNumerico ) )
		? `El campo "${ nombreDelCampo }" no es un número`
		: (valor < numero)
			? `El campo "${ nombreDelCampo }" es menor al necesario`
			: true;
};