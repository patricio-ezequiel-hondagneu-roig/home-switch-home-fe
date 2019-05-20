import store from '@/store';
import Vue from 'vue';
import { NavigationGuard } from 'vue-router';

export const verificarPermisos: NavigationGuard<Vue> = ( to, from, next ) => {
	const requierePermisosDeAdmin: boolean | undefined = to.meta.requierePermisosDeAdmin;

	if ( requierePermisosDeAdmin ) {
		next( store.getters.esAdmin ? undefined : { name: '404' } );
	}

	const requiereNoHaberIngresado: boolean | undefined = to.meta.requiereNoHaberIngresado;

	if ( requiereNoHaberIngresado ) {
		next( ! store.getters.esAdmin ? undefined : { name: '404' } );
	}

	next( );
};