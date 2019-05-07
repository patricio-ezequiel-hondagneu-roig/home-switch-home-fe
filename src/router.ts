import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import VistaAdministrador from './views/VistaAdministrador.vue';
import Perfil from './views/Perfil.vue';
import PaginaNoEncontrada from './views/PaginaNoEncontrada.vue';

Vue.use( Router );

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/admin',
			name: 'admin',
			component: VistaAdministrador
		},
		{
			path: '/perfil',
			name: 'perfil-propio',
			component: Perfil
		},
		{
			path: '/perfil/:idDeUsuario',
			name: 'perfil-ajeno',
			component: Perfil,
			props: true,
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
