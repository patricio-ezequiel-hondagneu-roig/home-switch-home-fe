import Vue from 'vue';
import Router from 'vue-router';
import Inicio from './views/Inicio.vue';
import Ingreso from './views/Ingreso.vue';
import Residencia from './views/Residencia.vue';
import Publicacion from './views/Publicacion.vue';
import Administracion from './views/Administracion.vue';
import AdministracionDeResidencias from './views/AdministracionDeResidencias.vue';
import AdministracionDeReservasDirectas from './views/AdministracionDeReservasDirectas.vue';
import AdministracionDeSubastas from './views/AdministracionDeSubastas.vue';
import AdministracionDeSuscripciones from './views/AdministracionDeSuscripciones.vue';
import AdministracionDeCreditos from './views/AdministracionDeCreditos.vue';
import AdministracionDePublicaciones from './views/AdministracionDePublicaciones.vue';
import AdministracionDeClientes from './views/AdministracionDeClientes.vue';
import AdministracionDeClientesRegistrados from './views/AdministracionDeClientesRegistrados.vue';
import AdministracionDeSolicitudes from './views/AdministracionDeSolicitudes.vue';
import AdministracionDePosiblesHotSales from './views/AdministracionDePosiblesHotSales.vue';
import AdministracionDeHotsalesActivos from './views/AdministracionDeHotsalesActivos.vue';
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
			path: '/residencias/:idResidencia',
			name: 'residencia con id',
			component: Residencia,
			props: true,
		},
		{
			path: '/publicaciones/:idPublicacion',
			name: 'publicacion con id',
			component: Publicacion,
			props: true,
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
			path: '/administracion/creditos',
			name: 'administracion de creditos',
			component: AdministracionDeCreditos,
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
			path: '/administracion/publicaciones/reservasDirectas',
			name: 'administracion de reservas directas',
			component: AdministracionDeReservasDirectas,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/publicaciones/posiblesHotSales',
			name: 'administracion de posibles hot sales',
			component: AdministracionDePosiblesHotSales,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/publicaciones/hotsales',
			name: 'administracion de hot sales',
			component: AdministracionDeHotsalesActivos,
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
			path: '/administracion/clientes/all',
			name: 'clientes registrados',
			component: AdministracionDeClientesRegistrados,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/administracion/solicitudes',
			name: 'solicitudes',
			component: AdministracionDeSolicitudes,
			meta: {
				requierePermisosDeAdmin: true,
			}
		},
		{
			path: '/admin',
			name: 'ingreso de admin',
			component: Ingreso,
			meta: {
				requiereNoHaberIngresado: true,
			}
		},
		{
			path: '/ingresar',
			name: 'iniciar sesion como cliente',
			component: IniciarSesion,
			meta: {
				requiereNoHaberIngresado: true,
			}
		},
		{
			path: '/infoUsuario',
			name: 'info de usuario',
			component: DatosDeUsuario
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