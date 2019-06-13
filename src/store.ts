import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { Residencia, ResidenciaParaModificar, ResidenciaParaCrear } from './interfaces/residencia.interface';
import { Subasta, SubastaParaCrear, SubastaParaModificar } from './interfaces/subasta.interface';
import { Suscripcion, SuscripcionParaCrear } from './interfaces/suscripcion.interface';
import { Cliente, ClienteParaCrear, ClienteParaModificar } from './interfaces/cliente.interface';
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
		alerta: alerta,
		esAdmin: <boolean | null> null,
		perfil: <Cliente | null> null,
		clienteLoggedIn: <Cliente | null> null,
		clientes: <Cliente[ ]> [ ],
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

		clientes: ( state ) => {
			return state.clientes;
		},

		clienteLoggedIn: ( state ) => {
			return state.clienteLoggedIn;
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
		clienteConId: ( state ) => {
			return ( idCliente: Cliente[ '_id' ] ): Cliente | null => {
				const cliente = state.clientes.find( ( _cliente ) => {
					return _cliente._id === idCliente;
				});

				return ( cliente !== undefined )
					? cliente
					: null;
			};
		},

		clienteConEmail: ( state ) => {
			return ( emailCliente: Cliente[ 'email' ] ): Cliente | null => {
				const cliente = state.clientes.find( ( _cliente ) => {
					return _cliente.email === emailCliente;
				});

				return ( cliente !== undefined )
					? cliente
					: null;
			};
		},
	},
	mutations: {
		iniciarSesionComoAdmin( state ) {
			state.esAdmin = true;
			localStorage.setItem( 'esAdmin', 'esAdmin' );
		},

		iniciarSesionComoCliente( state, cliente: Cliente ) {
			state.perfil = cliente;
			localStorage.setItem( 'perfil', 'perfil' );
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

		// Residencias
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

		// Subastas
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

		// Suscripciones
		actualizarSuscripciones( state, suscripcion: Suscripcion[ ] ): void {
			state.suscripciones = suscripcion;
		},

		agregarSuscripcion( state, suscripcion: Suscripcion ): void {
			state.suscripciones.push( suscripcion );
		},

		// Clientes
		actualizarClientes( state, clientes: Cliente[ ] ): void {
			state.clientes = clientes;
		},

		agregarCliente( state, cliente: Cliente ): void {
			state.clientes.push( cliente );
		},

		modificarCliente( state, cliente: Cliente ): void {
			const indiceDeCliente = state.clientes.findIndex( ( _cliente ) => {
				return _cliente._id === cliente._id;
			});

			// Reemplaza si el cliente ya existe, agrega si no existe
			if ( indiceDeCliente !== -1 ) {
				state.clientes.splice( indiceDeCliente, 1, cliente );
			}
			else {
				state.clientes.push( cliente );
			}
		},
		modificarClienteLoggedIn( state, cliente: Cliente ): void {
			state.clienteLoggedIn = cliente;
		},
		eliminarCliente( state, idCliente: Cliente[ '_id' ] ): void {
			const indiceDeCliente = state.clientes.findIndex( ( _cliente ) => {
				return _cliente._id === idCliente;
			});

			if ( indiceDeCliente !== -1 ) {
				state.clientes.splice( indiceDeCliente, 1 );
			}
		},
	},
	actions: {
		iniciarSesionComoAdmin( { commit } ) {
			commit( 'iniciarSesionComoAdmin' );
		},

		iniciarSesionComoCliente( { commit } ) {
			commit( 'iniciarSesionComoCliente' );
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
		},

		/**
		 * Solicita al servidor que cree un cliente regular con los parámetros provistos y obtiene la lista de clientes
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param clienteParaCrear objeto que contiene la información necesaria para crear un cliente regular
		 */
		async crearClienteRegular( { commit, dispatch }, clienteParaCrear: ClienteParaCrear ): Promise<void> {
			try {
				// const url = `${ server.baseURL }/subastas`;
				// const respuesta = await axios.post<Subasta>( url, subastaParaCrear );
				// const subastaCreada = respuesta.data;
				// commit( 'agregarSubasta', subastaCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'El cliente se creo con éxito.'
				});

				// await dispatch( 'obtenerSubastas' );
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
		 * Solicita al servidor la lista de todos los clientes existentes y actualiza el store con ellas.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 */
		async obtenerClientes( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Cliente[ ]>( `${ server.baseURL }/clientes` );
				const clientes = respuesta.data;
				commit( 'actualizarClientes', clientes );
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
		 * Solicita al servidor que cree un cliente con los parámetros provistos y obtiene la lista de clientes
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param clienteParaCrear objeto que contiene la información necesaria para crear un cliente
		 */
		async crearCliente( { commit, dispatch }, clienteParaCrear: ClienteParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/clientes`;
				const respuesta = await axios.post<Cliente>( url, clienteParaCrear );
				const clienteCreado = respuesta.data;
				commit( 'agregarCliente', clienteCreado );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'El cliente se cargó con éxito.'
				});

				await dispatch( 'obtenerClientes' );
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
		 * Solicita al servidor que modifique un cliente con los parámetros provistos y obtiene la lista de
		 * clientes actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param argumentos objeto que contiene el ID y los datos del cliente a modificar
		 */
		async modificarCliente( { commit, dispatch }, argumentos: {
			_id: Cliente[ '_id' ],
			clienteParaModificar: ClienteParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/clientes/${ argumentos._id }`;
				const clienteParaModificar = argumentos.clienteParaModificar;
				const respuesta = await axios.put<Cliente>( url, clienteParaModificar );
				const clienteModificado = respuesta.data;
				commit( 'modificarCliente', clienteModificado );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'El cliente se modificó con éxito.'
				});

				await dispatch( 'obtenerClientes' );
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
		async modificarClienteLoggedIn( { commit, dispatch }, argumentos: {
			idCliente: Cliente[ '_id' ],
			clienteParaModificar: ClienteParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/clientes/${ argumentos.idCliente }`;
				const clienteParaModificar = argumentos.clienteParaModificar;
				const respuesta = await axios.put<Cliente>( url, clienteParaModificar );
				const clienteModificado = respuesta.data;
				commit( 'modificarClienteLoggedIn', clienteModificado );
				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'Su información se modificó con éxito.'
				});
				await dispatch( 'obtenerClientes' );
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
		 * Solicita al servidor que elimine al cliente con el ID provisto y obtiene la lista de clientes
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param idCliente ID del cliente a eliminar
		 */
		async eliminarCliente( { commit, dispatch }, idCliente: Cliente[ '_id' ] ): Promise<void> {
			try {
				const url: string = `${ server.baseURL }/clientes/${ idCliente }`;
				await axios.delete( url );
				commit( 'eliminarCliente', idCliente );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'El cliente se eliminó con éxito.'
				});

				await dispatch( 'obtenerClientes' );
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
	},
});