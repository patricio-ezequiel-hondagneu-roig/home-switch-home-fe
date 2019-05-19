import App from '@/App.vue';
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import { obtenerLocalVue } from './shared/obtener-local-vue';

const localVue = obtenerLocalVue( );

const store = new Vuex.Store({
	getters: {
		esAdmin: ( ) => true,
	}
});

describe( 'App.vue', ( ) => {
	it( 'contiene el texto "Home Switch Home"', ( ) => {
		const wrapper = shallowMount( App, { store, localVue } );
		expect( wrapper.text( ) ).toMatch( 'Home Switch Home' );
	});
});