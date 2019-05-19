import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import Ingreso from './views/Ingreso.vue';
import Administracion from './views/Administracion.vue';
import AdministracionDeResidencias from './views/AdministracionDeResidencias.vue';
import AdministracionDeSubastas from './views/AdministracionDeSubastas.vue';
import PaginaNoEncontrada from './views/PaginaNoEncontrada.vue';
import { verificarPermisos } from './helpers/guardas-de-navegacion/verificar-permisos.guard';

Vue.use( Router );

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'inicio',
			component: Inicio
		},
		{
			path: '/administracion',
			name: 'administracion',
			component: Administracion,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/residencias',
			name: 'administracion de residencias',
			component: AdministracionDeResidencias,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/subastas',
			name: 'administracion de subastas',
			component: AdministracionDeSubastas,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/ingresar',
			name: 'ingresar',
			component: Ingreso
		},
		{
			path: '/404',
			name: '404',
			component: PaginaNoEncontrada
		},
		{
			path: '*',
			redirect: '404'
		}
	],
});

router.beforeEach( verificarPermisos );

export default router;