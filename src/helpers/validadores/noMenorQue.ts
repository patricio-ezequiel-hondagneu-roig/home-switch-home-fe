export const noMenorQue = ( nombreDelCampo: string , numero: number) => ( valor: string ) => {
	return (parseInt(valor, 10) < numero)
		? `El campo "${ nombreDelCampo }" es menor al minimo permitido.`
		: true;
};