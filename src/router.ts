import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import Perfil from './views/Perfil.vue';
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
