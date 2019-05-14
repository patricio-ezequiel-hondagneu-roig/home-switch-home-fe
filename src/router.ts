import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import PaginaNoEncontrada from './views/PaginaNoEncontrada.vue';
import VistaAdministrador from './views/VistaAdministrador.vue';

Vue.use( Router );

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'inicio',
			component: Inicio,
		},
		{
			path: '/admin',
			name: 'admin',
			component: VistaAdministrador
		},
		{
			path: '/404',
			name: '404',
			component: PaginaNoEncontrada,
		},
		{
			path: '*',
			redirect: '404'
		}
	],
});
