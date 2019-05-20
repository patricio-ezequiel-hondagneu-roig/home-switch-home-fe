import Vue from 'vue';
import Vuex from 'vuex';
import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';
import { RemoverPropiedades } from './typings/remover-propiedades';

Vue.use( Vuex );

const alerta: InformacionDeAlerta = {
	esVisible: false,
	texto: '',
	tipo: 'info',
};

export default new Vuex.Store({
	state: {
		esAdmin: <boolean | null> null,
		alerta: alerta,
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
		}
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
		mostrarAlerta( state, argumentos: RemoverPropiedades<InformacionDeAlerta, 'esVisible'> ) {
			state.alerta.texto = argumentos.texto;
			state.alerta.tipo = argumentos.tipo;
			state.alerta.esVisible = true;
		},
		ocultarAlerta( state ) {
			state.alerta.texto = '';
			state.alerta.tipo = 'info';
			state.alerta.esVisible = false;
		}
	},
	actions: {
		iniciarSesionComoAdmin( { commit } ) {
			commit( 'iniciarSesionComoAdmin' );
		},
		cerrarSesionComoAdmin( { commit } ) {
			commit( 'cerrarSesionComoAdmin' );
		},
		mostrarAlerta( { commit }, argumentos: RemoverPropiedades<InformacionDeAlerta, 'esVisible'> ) {
			commit( 'mostrarAlerta', argumentos );
		},
		ocultarAlerta( { commit } ) {
			commit( 'ocultarAlerta' );
		}
	},
});