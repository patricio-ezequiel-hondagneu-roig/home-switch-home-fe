import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { Residencia, ResidenciaParaModificar, ResidenciaParaCrear } from './interfaces/residencia.interface';
import { Subasta, SubastaParaCrear, SubastaParaModificar } from './interfaces/subasta.interface';
import { Suscripcion, SuscripcionParaCrear } from './interfaces/suscripcion.interface';
import { Cliente, ClienteParaCrear, ClienteParaModificar } from './interfaces/cliente.interface';
import { Publicacion, PublicacionParaCrear, PublicacionParaModificar } from './interfaces/publicacion.interface';
import { Adquisicion, AdquisicionParaCrear, AdquisicionParaModificar } from './interfaces/adquisicion.interface';
import { server } from './utils/helper';
import { CreditoBD, CreditoParaCrear } from './interfaces/creditoBD.interface';

import moment from 'moment';
import { Solicitud, SolicitudParaCrear } from './interfaces/solicitud.interface';
import { Credito } from './interfaces/credito.interface';

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
		adquisiciones: <Adquisicion[ ]> [ ],
		clientes: <Cliente[ ]> [ ],
		solicitudes: <Solicitud[ ]> [ ],
		residencias: <Residencia[ ]> [ ],
		subastas: <Subasta[ ]> [ ],
		suscripciones: <Suscripcion[ ]> [ ],
		publicaciones: <Publicacion[ ]> [ ],
		creditos: <CreditoBD[ ]> [ ],
	},
	getters: {
		esAdmin: ( state ) => {
			if ( state.esAdmin === null ) {
				state.esAdmin = localStorage.getItem( 'esAdmin' ) !== null;
			}

			return state.esAdmin;
		},

		perfil: ( state ) => {
			if ( state.perfil === null ) {
				const perfilEnLocalStorage = localStorage.getItem( 'perfil' );
				state.perfil = ( perfilEnLocalStorage !== null )
					? <Cliente> JSON.parse( perfilEnLocalStorage )
					: null;
			}

			return state.perfil;
		},

		adquisiciones: ( state ) => {
			return state.adquisiciones;
		},

		creditos: ( state ) => {
			return state.creditos;
		},

		obtenerCreditoActual: ( state ) => {
			const creditos = [ ...state.creditos ];
			const credito = creditos
				.sort( ( a, b ) => {
					if ( moment(a.fechaDeCreacion) > moment(b.fechaDeCreacion) ) {
						return -1;
					}
					else if ( moment(a.fechaDeCreacion) < moment(b.fechaDeCreacion) ) {
						return +1;
					}
					else {
						return 0;
					}
				});
			return credito[0];
		},

		adquisicionConId: ( state ) => {
			return ( idAdquisicion: Adquisicion[ '_id' ] ): Adquisicion | null => {
				const adquisicion = state.adquisiciones.find( ( _adquisicion ) => {
					return _adquisicion._id === idAdquisicion;
				});

				return ( adquisicion !== undefined )
					? adquisicion
					: null;
			};
		},

		alerta: ( state ) => {
			return state.alerta;
		},

		clientes: ( state ) => {
			return state.clientes;
		},

		publicaciones: ( state ) => {
			return state.publicaciones;
		},

		reservasDirectas: ( state ) => {
			const meses: number = 6;
			let reservasDirectas: Publicacion[ ];
			// Primero quiero saber que faltan más de 6 meses
			reservasDirectas = state.publicaciones.filter( (publicacion) => {
				return moment().add(meses, 'M') < moment(publicacion.fechaDeInicioDeSemana);
			});

			// Segundo me interesa que no este adquirida
			reservasDirectas = reservasDirectas.filter( (reservaDirecta) => {
				const _adquisicion = state.adquisiciones.find( (adquisicion) => {
					return adquisicion.idPublicacion === reservaDirecta._id;
				});

				return _adquisicion === undefined;
			});

			return reservasDirectas;
		},

		posiblesHotSales: ( state ) => {
			const meses: number = 6;
			const dias: number = 3;
			let posiblesHotSales: Publicacion[ ];

			posiblesHotSales = state.publicaciones.filter( (publicacion) => {
				const finDeSubasta = moment(publicacion.fechaDeInicioDeSemana).subtract(meses, 'months').add(dias, 'days');
				const comienzoDeSemana = moment(publicacion.fechaDeInicioDeSemana);
				return moment( moment() ).isBetween(finDeSubasta, comienzoDeSemana);
			});

			// Me interesa que no este adquirida, ya que si lo esta no es posible hot sale
			posiblesHotSales = posiblesHotSales.filter( (posibleHotSale) => {
				const _adquisicion = state.adquisiciones.find( (adquisicion) => {
					return adquisicion.idPublicacion === posibleHotSale._id;
				});

				return _adquisicion === undefined;
			});

			return posiblesHotSales;
		},

		subastasActivas: ( state ) => {
			const meses: number = 6;
			const dias: number = 3;
			let subastasActivas: Publicacion[ ];

			// Quiero saber que faltan 6 meses o menos
			subastasActivas = state.publicaciones.filter( (publicacion) => {
				// 1° No esta cerrada
				const noCerroSubasta: boolean = !(publicacion.cerroSubasta);

				// 2° Me fijo el intervalo de fechas de una subasta
				const comienzoDeSubasta = moment(publicacion.fechaDeInicioDeSemana).subtract(meses, 'M');
				const finDeSubasta = moment(publicacion.fechaDeInicioDeSemana).subtract(meses, 'M').add(dias, 'days');

				const fechaDeSubastaValida = moment( moment( ) ).isBetween(comienzoDeSubasta, finDeSubasta);

				// 3° No hay ganador, pero supongo que si hay ganador no esta cerrada
				// ?????

				return noCerroSubasta && fechaDeSubastaValida;
			});

			return subastasActivas;
		},

		publicacionConId: ( state ) => {
			return ( idPublicacion: Publicacion[ '_id' ] ): Publicacion | null => {
				const publicacion = state.publicaciones.find( ( _publicacion ) => {
					return _publicacion._id === idPublicacion;
				});

				return ( publicacion !== undefined )
					? publicacion
					: null;
			};
		},

		publicacionesConIdResidencia: ( state ) => {
			return ( idResidencia: Publicacion[ 'idResidencia' ] ): Publicacion[ ] => {
				const publicaciones = state.publicaciones.filter( ( _publicacion ) => {
					return _publicacion.idResidencia === idResidencia;
				});

				return publicaciones;
			};
		},

		solicitudes: ( state ) => {
			return state.solicitudes;
		},

		solicitudConId: ( state ) => {
			return ( idCliente: Solicitud[ 'idCliente' ] ): Solicitud | null => {
				const solicitud = state.solicitudes.find( ( _solicitud ) => {
					return _solicitud.idCliente === idCliente;
				});

				return ( solicitud !== undefined )
					? solicitud
					: null;
			};
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

		suscripcionConId: ( state ) => {
			return ( idSuscripcion: Suscripcion[ '_id' ] ): Suscripcion | null => {
				const suscripcion = state.suscripciones.find( ( _suscripcion ) => {
					return _suscripcion._id === idSuscripcion;
				});

				return ( suscripcion !== undefined )
					? suscripcion : null;
			};
		},

		clienteConId: ( state ) => {
			return ( idCliente: Cliente[ '_id' ] ): Cliente | null => {
				const cliente = state.clientes.find( ( _cliente ) => {
					return _cliente._id === idCliente;
				});

				return ( cliente !== undefined )
					? cliente : null;
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
			localStorage.setItem( 'perfil', JSON.stringify( cliente ) );
		},

		// actualizarPerfil( state ) {
		// 	if (state.perfil === null ){
		// 		return;
		// 	} else {
		// 		const nuevoCliente: Cliente | undefined = state.clientes.find( (_cliente) => {
		// 			// Dejame de joder tslint
		// 			if (state.perfil !== null ){
		// 				return _cliente._id === state.perfil._id;
		// 			}
		// 		});
		// 		if (nuevoCliente !== undefined) {
		// 			state.perfil = nuevoCliente;
		// 		}
		// 	}
		// },

		cerrarSesionComoAdmin( state ) {
			state.esAdmin = false;
			localStorage.removeItem( 'esAdmin' );
		},

		cerrarSesionComoCliente( state ) {
			state.perfil = null;
			localStorage.removeItem( 'perfil' );
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

		// Creditos
		actualizarCreditos( state, creditos: CreditoBD[ ] ): void {
			state.creditos = creditos;
		},

		agregarCredito( state, credito: CreditoBD ): void {
			state.creditos.push( credito );
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

		modificarPerfil( state, cliente: Cliente ): void {
			state.perfil = cliente;
		},

		eliminarCliente( state, idCliente: Cliente[ '_id' ] ): void {
			const indiceDeCliente = state.clientes.findIndex( ( _cliente ) => {
				return _cliente._id === idCliente;
			});

			if ( indiceDeCliente !== -1 ) {
				state.clientes.splice( indiceDeCliente, 1 );
			}
		},

		/** Solicitudes de mejora de plan */
		agregarSolicitud( state, solicitud: Solicitud ): void {
			state.solicitudes.push( solicitud );
		},

		actualizarSolicitudes( state, solicitud: Solicitud[ ] ): void {
			state.solicitudes = solicitud;
		},

		eliminarSolicitud( state, idSolicitud: Solicitud[ '_id' ] ): void {
			const indiceDeSolicitud = state.solicitudes.findIndex( ( _solicitud ) => {
				return _solicitud._id === idSolicitud;
			});

			if ( indiceDeSolicitud !== -1 ) {
				state.clientes.splice( indiceDeSolicitud, 1 );
			}
		},

		actualizarAdquisiciones( state, adquisiciones: Adquisicion[ ] ): void {
			state.adquisiciones = adquisiciones;
		},

		agregarAdquisicion( state, adquisicion: Adquisicion ): void {
			state.adquisiciones.push( adquisicion );
		},

		modificarAdquisicion( state, adquisicion: Adquisicion ): void {
			const indiceDeAdquisicion = state.adquisiciones.findIndex( ( _adquisicion ) => {
				return _adquisicion._id === adquisicion._id;
			});

			if ( indiceDeAdquisicion !== -1 ) {
				state.adquisiciones.splice( indiceDeAdquisicion, 1, adquisicion );
			}
			else {
				state.adquisiciones.push( adquisicion );
			}
		},

		// Publicaciones
		actualizarPublicaciones( state, publicaciones: Publicacion[ ] ): void {
			state.publicaciones = publicaciones;
		},

		agregarPublicacion( state, publicacion: Publicacion ): void {
			state.publicaciones.push( publicacion );
		},

		modificarPublicacion( state, publicacion: Publicacion ): void {
			const indiceDePublicacion = state.publicaciones.findIndex( ( _publicacion ) => {
				return _publicacion._id === publicacion._id;
			});

			// Reemplaza si la publicacion ya existe, agrega si no existe
			if ( indiceDePublicacion !== -1 ) {
				state.publicaciones.splice( indiceDePublicacion, 1, publicacion );
			}
			else {
				state.publicaciones.push( publicacion );
			}
		},

		eliminarPublicacion( state, idPublicacion: Publicacion[ '_id' ] ): void {
			const indiceDePublicacion = state.publicaciones.findIndex( ( _publicacion ) => {
				return _publicacion._id === idPublicacion;
			});

			if ( indiceDePublicacion !== -1 ) {
				state.publicaciones.splice( indiceDePublicacion, 1 );
			}
		},
		// Adquisiciones
		actualizarAdquisicionesDeCliente( state, adquisiciones: Adquisicion[ ] ): void {
			state.adquisiciones = adquisiciones;
		},

	},
	actions: {
		iniciarSesionComoAdmin( { commit }, cliente: Cliente ) {
			commit( 'iniciarSesionComoAdmin', cliente );
		},

		iniciarSesionComoCliente( { commit }, cliente: Cliente ) {
			commit( 'iniciarSesionComoCliente', cliente );
		},

		cerrarSesionComoAdmin( { commit } ) {
			commit( 'cerrarSesionComoAdmin' );
		},

		cerrarSesionComoCliente( { commit } ) {
			commit( 'cerrarSesionComoCliente' );
		},

		mostrarAlerta( { commit }, informacionDeAlerta: InformacionDeAlerta ) {
			commit( 'mostrarAlerta', informacionDeAlerta );
		},

		ocultarAlerta( { commit } ) {
			commit( 'ocultarAlerta' );
		},

		async obtenerCreditos( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<CreditoBD[ ]>( `${ server.baseURL }/creditos` );
				const creditos = respuesta.data;
				commit( 'actualizarCreditos', creditos );
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
			cliente: ClienteParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/clientes/${ argumentos._id }`;
				const clienteParaModificar = argumentos.cliente;
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
		async pagarConCredito( { commit, dispatch }, argumentos: {
			idCliente: Cliente[ '_id' ],
			clienteParaModificar: ClienteParaModificar
		}): Promise<void> {
			const nuevosCreditos = argumentos.clienteParaModificar.creditos.sort( );
			const indexCreditoABorrar = nuevosCreditos.findIndex( ( credito ) => {
				return credito.activo;
			});
			if ( indexCreditoABorrar !== 0 ) {
				const elementCero = nuevosCreditos[ 0 ];
				nuevosCreditos[ indexCreditoABorrar ] = elementCero;
			}
			nuevosCreditos.shift();
			argumentos.clienteParaModificar.creditos = nuevosCreditos;
			await dispatch('modificarPerfil', argumentos);
		},
		async modificarPerfil( { commit, dispatch }, argumentos: {
			idCliente: Cliente[ '_id' ],
			clienteParaModificar: ClienteParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/clientes/${ argumentos.idCliente }`;
				const clienteParaModificar = argumentos.clienteParaModificar;
				const respuesta = await axios.put<Cliente>( url, clienteParaModificar );
				const clienteModificado = respuesta.data;
				commit( 'modificarPerfil', clienteModificado );
				commit( 'modificarCliente', clienteModificado );
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

		/** Solicitudes de mejora de plan */
		async obtenerSolicitudes( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Solicitud[ ]>( `${ server.baseURL }/solicitudes` );
				const solicitudes = respuesta.data;
				commit( 'actualizarSolicitudes', solicitudes );
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

		async crearSolicitud( { commit, dispatch }, solicitudParaCrear: SolicitudParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/solicitudes`;
				const respuesta = await axios.post<Solicitud>( url, solicitudParaCrear );
				const solicitudCreada = respuesta.data;
				commit( 'agregarSolicitud', solicitudCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La solicitud esta en espera'
				});

				await dispatch( 'obtenerSolicitudes' );
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

		async eliminarSolicitud( { commit, dispatch }, idSolicitud: Solicitud[ '_id' ] ): Promise<void> {
			try {
				const url: string = `${ server.baseURL }/solicitudes/${ idSolicitud }`;
				await axios.delete( url );
				commit( 'eliminarSolicitud', idSolicitud );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La solicitud se eliminó con éxito.'
				});

				await dispatch( 'obtenerSolicitudes' );
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

		async obtenerAdquisiciones( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Adquisicion[ ]>( `${ server.baseURL }/adquisiciones` );
				const adquisiciones = respuesta.data;
				commit( 'actualizarAdquisiciones', adquisiciones );
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
		 * Solicita al servidor la lista de todas las publicaciones existentes y actualiza el store con ellas.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 */
		async obtenerPublicaciones( { commit, dispatch } ): Promise<void> {
			try {
				const respuesta = await axios.get<Publicacion[ ]>( `${ server.baseURL }/publicaciones` );
				const publicaciones = respuesta.data;
				commit( 'actualizarPublicaciones', publicaciones );
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
		 * Solicita al servidor que cree una Publicacion con los parámetros provistos y obtiene la lista de Publicaciones
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param publicacionParaCrear objeto que contiene la información necesaria para crear una Publicacion
		 */
		async crearPublicacion( { commit, dispatch }, publicacionParaCrear: PublicacionParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/publicaciones`;
				const respuesta = await axios.post<Publicacion>( url, publicacionParaCrear );
				const publicacionCreada = respuesta.data;
				commit( 'agregarPublicacion', publicacionCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La Publicacion se cargó con éxito.'
				});

				await dispatch( 'obtenerPublicaciones' );
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
		 * Solicita al servidor que modifique una Publicacion con los parámetros provistos y obtiene la lista de
		 * Publicaciones actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param argumentos objeto que contiene el ID y los datos de la Publicacion a modificar
		 */
		async modificarPublicacion( { commit, dispatch }, argumentos: {
			_id: Publicacion[ '_id' ],
			publicacionParaModificar: PublicacionParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/publicaciones/${ argumentos._id }`;
				const publicacionParaModificar = argumentos.publicacionParaModificar;
				const respuesta = await axios.put<Publicacion>( url, publicacionParaModificar );
				const publicacionModificada = respuesta.data;
				commit( 'modificarPublicacion', publicacionModificada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La publicacion se modificó con éxito.'
				});

				await dispatch( 'obtenerPublicaciones' );
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
		 * Solicita al servidor que elimine la Publicacion con el ID provisto y obtiene la lista de Publicaciones
		 * actualizada.
		 *
		 * En caso de que la solicitud falle, muestra una alerta informando el error.
		 *
		 * @param idPublicacion ID de la Publicaciones a eliminar
		 */
		async eliminarPublicacion( { commit, dispatch }, idPublicacion: Publicacion[ '_id' ] ): Promise<void> {
			try {
				const url: string = `${ server.baseURL }/publicaciones/${ idPublicacion }`;
				await axios.delete( url );
				commit( 'eliminarPublicacion', idPublicacion );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La publicacion se eliminó con éxito.'
				});

				await dispatch( 'obtenerPublicaciones' );
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

		async adquisicionesDeClienteId( { commit , dispatch },
			idCliente: string
		): Promise<void> {
			try {
				const respuesta = await axios.get<Adquisicion[ ]>( `${ server.baseURL }/adquisiciones/cliente/${ idCliente }` );
				commit( 'actualizarAdquisicionesDeCliente', respuesta.data );
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

		async crearCredito( { commit, dispatch }, creditoParaCrear: CreditoParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/creditos`;
				const respuesta = await axios.post<CreditoBD>( url, creditoParaCrear );
				const creditoCreado = respuesta.data;
				commit( 'agregarCredito', creditoCreado );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'El crédito se cargó con éxito.'
				});

				await dispatch( 'obtenerCreditos' );
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

		async crearAdquisicion( { commit, dispatch }, adquisicionParaCrear: AdquisicionParaCrear ): Promise<void> {
			try {
				const url = `${ server.baseURL }/adquisiciones`;
				const respuesta = await axios.post<Adquisicion>( url, adquisicionParaCrear );
				const adquisicionCreada = respuesta.data;
				commit( 'agregarAdquisicion', adquisicionCreada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La Adquisicion se cargó con éxito.'
				});

				await dispatch( 'obtenerAdquisiciones' );
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

		async modificarAdquisicion( { commit, dispatch }, argumentos: {
			_id: Adquisicion[ '_id' ],
			adquisicionParaModificar: AdquisicionParaModificar
		}): Promise<void> {
			try {
				const url = `${ server.baseURL }/adquisiciones/${ argumentos._id }`;
				const adquisicionParaModificar = argumentos.adquisicionParaModificar;
				const respuesta = await axios.put<Adquisicion>( url, adquisicionParaModificar );
				const adquisicionModificada = respuesta.data;
				commit( 'modificarAdquisicion', adquisicionModificada );

				dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: 'La adquisicion se modificó con éxito.'
				});

				await dispatch( 'obtenerAdquisiciones' );
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