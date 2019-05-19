import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

export function obtenerLocalVue( ) {
	const localVue = createLocalVue( );

	// HACK: Importado globalmente como solución a bug. Ver issue https://github.com/vuetifyjs/vuetify/issues/4964.
	Vue.use( Vuetify );

	localVue.use( Vuex );
	localVue.use( VueRouter );

	return localVue;
}