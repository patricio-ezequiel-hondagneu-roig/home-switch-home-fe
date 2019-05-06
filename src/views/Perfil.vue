<template>
	<div class="pa-5">
		<span class="body-1">
			Perfil de <span class="body-2">{{ nombreDeUsuario }}</span>.
		</span>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator';
	import VueRouter, { Route } from 'vue-router';

	@Component
	export default class Perfil extends Vue {
		/**
		 * Prop que indica el ID del usuario en la URL actual.
		 *
		 * Su valor predeterminado es _undefined_.
		 */
		@Prop({ default: undefined })
		public readonly idDeUsuario!: string | undefined;

		/**
		 * Retorna el nombre del usuario cuyo perfil se está mostrando.
		 *
		 * Si hay un ID en la URL actual, muestra el nombre del usuario con ese ID, en caso contrario, muestra el
		 * nombre del usuario actualmente logueado.
		 */
		public get nombreDeUsuario( ): string | undefined {
			if ( this.idDeUsuario === undefined ) {
				return this.usuarioActual.nombre;
			}

			const usuario = this.usuarioConId( this.idDeUsuario );

			if ( usuario === undefined ) {
				this.$router.replace({ name: '404' });
			}
			else {
				return usuario.nombre;
			}
		}

		/**
		 * Método de ejemplo que debería retornar el usuario actualmente logueado.
		 */
		private get usuarioActual( ): { id: string, nombre: string } {
			return { id: '0', nombre: 'Actualus U. Ario' };
		}

		/**
		 * Método de ejemplo que debería retornar el usuario con un ID dado.
		 *
		 * Si no existe usuario con ese ID, retorna undefined.
		 */
		private usuarioConId( id: string ): { id: string, nombre: string } | undefined {
			const usuariosRegistrados = [
				{ id: '0', nombre: 'Actualus U. Ario' },
				{ id: '1', nombre: 'Primerus U. Ario' },
				{ id: '2', nombre: 'Segundous U. Ario' },
				{ id: '3', nombre: 'Tercerous U. Ario' }
			];

			const usuarioActual = usuariosRegistrados.find( ( usuario ) => usuario.id === id );

			return usuarioActual;
		}
	}
</script>

<style lang="stylus" scoped></style>
