import Vue from 'vue';
import Vuex from 'vuex';

Vue.use( Vuex );

export default new Vuex.Store({
	state: {
		esAdmin: <boolean | null> null,
	},
	getters: {
		esAdmin: ( state ) => {
			if ( state.esAdmin === null ) {
				state.esAdmin = localStorage.getItem( 'esAdmin' ) !== null;
			}

			return state.esAdmin;
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
		}
	},
	actions: {
		iniciarSesionComoAdmin( context ) {
			context.commit( 'iniciarSesionComoAdmin' );
		},
		cerrarSesionComoAdmin( context ) {
			context.commit( 'cerrarSesionComoAdmin' );
		}
	},
});