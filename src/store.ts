import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { Residencia, ResidenciaParaModificar, ResidenciaParaCrear } from './interfaces/residencia.interface';
import { Subasta, SubastaParaCrear, SubastaParaModificar } from './interfaces/subasta.interface';
import { Suscripcion, SuscripcionParaCrear } from './interfaces/suscripcion.interface';
import { server } from './utils/helper';

import * as moment from 'moment';

Vue.use( Vuex );

const alerta: InformacionDeAlerta & { esVisible: boolean } = {
	texto: '',
	tipo: 'info',
	esVisible: false,
};

export default new Vuex.Store({
	state: {
		esAdmin: <boolean | null> null,
		alerta: alerta,
		residencias: <Residencia[ ]> [ ],
		subastas: <Subasta[ ]> [ ],
		suscripciones: <Suscripcion[ ]> [ ],
	},
	getters: {
		esAdmin: ( state ) => {
			if ( state.esAdmin === null ) {
				state.esAdmin = localStorage.getItem( 'esAdmin' ) !== null;
			}

			return state.esAdmin;
		},

		alerta: ( state ) => {
			return state.alerta;
		},

		residencias: ( state ) => {
			return state.residencias;
		},

		residenciaConId: ( state ) => {
			return ( idResidencia: Residencia[ '_id' ] ): Residencia | null => {
				const residencia = state.residencias.find( ( _residencia ) => {
					return _residencia._id === idResidencia;
				});

				return ( residencia !== undefined )
					? residencia
					: null;
			};
		},

		subastas: ( state ) => {
			return state.subastas;
		},

		subastaConId: ( state ) => {
			return ( idSubasta: Subasta[ '_id' ] ): Subasta | null => {
				const subasta = state.subastas.find( ( _subasta ) => {
					return _subasta._id === idSubasta;
				});

				return ( subasta !== undefined )
					? subasta
					: null;
			};
		},

		suscripciones: ( state ) => {
			return state.suscripciones;
		},

		obtenerSuscripcionPremium: ( state ) => {
			const suscripciones = [ ...state.suscripciones ];
			return suscripciones
				.sort( ( a, b ) => {
					if ( a.fechaDeCreacion > b.fechaDeCreacion ) {
						return -1;
					}
					else if ( a.fechaDeCreacion < b.fechaDeCreacion ) {
						return +1;
					}
					else {
						return 0;
					}
				})
				.find( ( suscripcion ) => suscripcion.tipoDeSuscripcion === 'Premium' );
		},

		obtenerSuscripcionRegular: ( state ) => {
			const suscripciones = [ ...state.suscripciones ];
			return suscripciones
				.sort( ( a, b ) => {
					if ( a.fechaDeCreacion > b.fechaDeCreacion ) {
						return -1;
					}
					else if ( a.fechaDeCreacion < b.fechaDeCreacion ) {
						return +1;
					}
					else {
						return 0;
					}
				})
				.find( ( suscripcion ) => suscripcion.tipoDeSuscripcion === 'Regular' );
		},
	},
	mutations: {
		iniciarSesionComoAdmin( state ) {
			state.esAdmin = true;
			localStorage.setItem( 'esAdmin', 'esAdmin' );
		},

		cerrarSesionComoAdmin( state ) {
			state.esAdmin = false;
			localStorage.removeItem( 'esAdmin' );
		},

		mostrarAlerta( state, informacionDeAlerta: InformacionDeAlerta ) {
			state.alerta.texto = informacionDeAlerta.texto;
			state.alerta.tipo = informacionDeAlerta.tipo;
			state.alerta.esVisible = true;
		},

		ocultarAlerta( state ) {
			state.alerta.texto = '';
			state.alerta.tipo = 'info';
			state.alerta.esVisible = false;
		},

		actualizarResidencias( state, residencias: Residencia[ ] ): void {
			state.residencias = residencias;
		},

		agregarResidencia( state, residencia: Residencia ): void {
			state.residencias.push( residencia );
		},

		modificarResidencia( state, residencia: Residencia ): void {
			const indiceDeResidencia = state.residencias.findIndex( ( _residencia ) => {
				return _residencia._id === residencia._id;
			});

			// Reemplaza si la residencia ya existe, agrega si no existe
			if ( indiceDeResidencia !== -1 ) {
				state.residencias.splice( indiceDeResidencia, 1, residencia );
			}
			else {
				state.residencias.push( residencia );
			}
		},

		eliminarResidencia( state, idResidencia: Residencia[ '_id' ] ): void {
			const indiceDeResidencia = state.residencias.findIndex( ( _residencia ) => {
				return _residencia._id === idResidencia;
			});

			if ( indiceDeResidencia !== -1 ) {
				state.residencias.splice( indiceDeResidencia, 1 );
			}
		},

		actualizarSubastas( state, subastas: Subasta[ ] ): void {
			state.subastas = subastas;
		},

		agregarSubasta( state, subasta: Subasta ): void {
			state.subastas.push( subasta );
		},

		modificarSubasta( state, subasta: Subasta ): void {
			const indiceDeSubasta = state.subastas.findIndex( ( _subasta ) => {
				return _subasta._id === subasta._id;
			});

			// Reemplaza si la subasta ya existe, agrega si no existe
			if ( indiceDeSubasta !== -1 ) {
				state.subastas.splice( indiceDeSubasta, 1, subasta );
			}
			else {
				state.subastas.push( subasta );
			}
		},

		eliminarSubasta( state, idSubasta: Subasta[ '_id' ] ): void {
			const indiceDeSubasta = state.subastas.findIndex( ( _subasta ) => {
				return _subasta._id === idSubasta;
			});

			if ( indiceDeSubasta !== -1 ) {
				state.subastas.splice( indiceDeSubasta, 1 );
			}
		},

		actualizarSuscripciones( state, suscripcion: Suscripcion[ ] ): void {
			state.suscripciones = suscripcion;
		},

		agregarSuscripcion( state, suscripcion: Suscripcion ): void {
			state.suscripciones.push( suscripcion );
		},
	},
	actions: {
		iniciarSesionComoAdmin( { commit } ) {
			commit( 'iniciarSesionComoAdmin' );
		},

		cerrarSesionComoAdmin( { commit } ) {
			commit( 'cerrarSesionComoAdmin' );
		},

		mostrarAlerta( { commit }, informacionDeAlerta: InformacionDeAlerta ) {
			commit( 'mostrarAlerta', informacionDeAlerta );
		},

		ocultarAlerta( { commit } ) {
			commit( 'ocultarAlerta' );
		},

		/**
		 * Solicita al servidor la lista de todas las residencias existentes y actualiza el store con ellas.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 */
		async obtenerResidencias( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Residencia[ ]>( `${ server.baseURL }/residencias` );
				const residencias = respuesta.data;
				commit( 'actualizarResidencias', residencias );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que cree una residencia con los parámetros provistos y obtiene la lista de residencias
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param residenciaParaCrear objeto que contiene la información necesaria para crear una residencia
		 */
		async crearResidencia( { commit, dispatch }, residenciaParaCrear: ResidenciaParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/residencias`;
				const respuesta = await axios.post<Residencia>( url, residenciaParaCrear );
				const residenciaCreada = respuesta.data;
				commit( 'agregarResidencia', residenciaCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La residencia se cargó con éxito.'
				});

				await dispatch( 'obtenerResidencias' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que modifique una residencia con los parámetros provistos y obtiene la lista de
		 * residencias actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param argumentos objeto que contiene el ID y los datos de la residencia a modificar
		 */
		async modificarResidencia( { commit, dispatch }, argumentos: {
			_id: Residencia[ '_id' ],
			residenciaParaModificar: ResidenciaParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/residencias/${ argumentos._id }`;
				const residenciaParaModificar = argumentos.residenciaParaModificar;
				const respuesta = await axios.put<Residencia>( url, residenciaParaModificar );
				const residenciaModificada = respuesta.data;
				commit( 'modificarResidencia', residenciaModificada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La residencia se modificó con éxito.'
				});

				await dispatch( 'obtenerResidencias' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que elimine la residencia con el ID provisto y obtiene la lista de residencias
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param idResidencia ID de la residencias a eliminar
		 */
		async eliminarResidencia( { commit, dispatch }, idResidencia: Residencia[ '_id' ] ): Promise<void> {
			try {
				const url: string = `${ server.baseURL }/residencias/${ idResidencia }`;
				await axios.delete( url );
				commit( 'eliminarResidencia', idResidencia );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La residencia se eliminó con éxito.'
				});

				await dispatch( 'obtenerResidencias' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor la lista de todas las subastas existentes y actualiza el store con ellas.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 */
		async obtenerSubastas( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Subasta[ ]>( `${ server.baseURL }/subastas` );
				const subastas = respuesta.data;
				commit( 'actualizarSubastas', subastas );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que cree una subasta con los parámetros provistos y obtiene la lista de subastas
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param subastaParaCrear objeto que contiene la información necesaria para crear una subasta
		 */
		async crearSubasta( { commit, dispatch }, subastaParaCrear: SubastaParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/subastas`;
				const respuesta = await axios.post<Subasta>( url, subastaParaCrear );
				const subastaCreada = respuesta.data;
				commit( 'agregarSubasta', subastaCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La subasta se cargó con éxito.'
				});

				await dispatch( 'obtenerSubastas' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que modifique una subasta con los parámetros provistos y obtiene la lista de subastas
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param argumentos objeto que contiene el ID y los datos de la subasta a modificar
		 */
		async modificarSubasta( { commit, dispatch }, argumentos: {
			idSubasta: Subasta[ '_id' ],
			subastaParaModificar: SubastaParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/subastas/${ argumentos.idSubasta }`;
				const subastaParaModificar = argumentos.subastaParaModificar;
				const respuesta = await axios.put<Subasta>( url, subastaParaModificar );
				const subastaModificada = respuesta.data;
				commit( 'modificarSubasta', subastaModificada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La subasta se modificó con éxito.'
				});

				await dispatch( 'obtenerSubastas' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que elimine la subasta con el ID provisto y obtiene la lista de subastas actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param idSubasta ID de la subasta a eliminar
		 */
		async eliminarSubasta( { commit, dispatch }, idSubasta: Subasta[ '_id' ] ): Promise<void> {
			try {
				const url: string = `${ server.baseURL }/subastas/${ idSubasta }`;
				await axios.delete( url );
				commit( 'eliminarSubasta', idSubasta );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La subasta se eliminó con éxito.'
				});

				await dispatch( 'obtenerSubastas' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor la lista de todas las suscripciones existentes y actualiza el store con ellas.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 */
		async obtenerSuscripciones( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Suscripcion[ ]>( `${ server.baseURL }/suscripciones` );
				const suscripciones = respuesta.data;
				commit( 'actualizarSuscripciones', suscripciones );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		},

		/**
		 * Solicita al servidor que cree una suscripcion con los parámetros provistos y obtiene la lista de suscripciones
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param suscripcionParaCrear objeto que contiene la información necesaria para crear una suscripcion
		 */
		async crearSuscripcion( { commit, dispatch }, suscripcionParaCrear: SuscripcionParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/suscripciones`;
				const respuesta = await axios.post<Suscripcion>( url, suscripcionParaCrear );
				const suscripcionCreada = respuesta.data;
				commit( 'agregarSuscripcion', suscripcionCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La suscripcion se cargó con éxito.'
				});

				await dispatch( 'obtenerSuscripciones' );
			}
			catch ( error ) {
				dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: ( error.response !== undefined )
						? error.response.data.message
						: 'Ocurrió un error al conectarse al servidor'
				});
			}
		}
	},
});