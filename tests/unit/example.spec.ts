import App from '@/App.vue';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

Vue.use( VueRouter );
Vue.use( Vuetify );

describe( 'App.vue', ( ) => {
	it( 'contiene el texto "Home Switch Home"', ( ) => {
		const wrapper = shallowMount( App );
		expect( wrapper.text( ) ).toMatch( 'Home Switch Home' );
	});
});