import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import Ingreso from './views/Ingreso.vue';
import VistaAdministrador from './views/VistaAdministrador.vue';
import PaginaNoEncontrada from './views/PaginaNoEncontrada.vue';

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
			path: '/ingresar',
			name: 'ingresar',
			component: Ingreso,
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
