import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import Ingreso from './views/Ingreso.vue';
import Administracion from './views/Administracion.vue';
import AdministracionDeResidencias from './views/AdministracionDeResidencias.vue';
import AdministracionDeSubastas from './views/AdministracionDeSubastas.vue';
import AdministracionDeSuscripciones from './views/AdministracionDeSuscripciones.vue';
import AdministracionDePublicaciones from './views/AdministracionDePublicaciones.vue';
import AdministracionDeClientes from './views/AdministracionDeClientes.vue';
import IniciarSesion from './views/IniciarSesion.vue';
import DatosDeUsuario from './views/DatosDeUsuario.vue';
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
			path: '/administracion/suscripciones',
			name: 'administracion de suscripciones',
			component: AdministracionDeSuscripciones,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/publicaciones',
			name: 'administracion de publicaciones',
			component: AdministracionDePublicaciones,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/clientes',
			name: 'administracion de clientes',
			component: AdministracionDeClientes,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/ingresar',
			name: 'ingresar',
			component: Ingreso,
			meta: {
				requiereNoHaberIngresado: true,
			}
		},
		{
			path: '/iniciarSesion',
			name: 'iniciar sesion',
			component: IniciarSesion,
			meta: {
				requiereNoHaberIngresado: true,
			}
		},
		{
			path: '/infoUsuario/:idDeUsuario',
			name: 'info de usuario',
			component: DatosDeUsuario,
			props: true
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