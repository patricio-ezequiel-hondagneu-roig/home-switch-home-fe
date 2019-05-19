import store from '@/store';
import Vue from 'vue';
import { NavigationGuard } from 'vue-router';

export const verificarPermisos: NavigationGuard<Vue> = ( to, from, next ) => {
	const requierePermisosDeAdmin: boolean = to.meta.requierePermisosDeAdmin;

	if ( ! requierePermisosDeAdmin || requierePermisosDeAdmin && store.getters.esAdmin ) {
		next( );
	}
	else {
		next({ name: '404' });
	}
};