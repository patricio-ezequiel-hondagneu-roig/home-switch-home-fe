<template>
	<v-app>
		<v-toolbar app dark color="secondary" class="darken-2 primary--text text--lighten-1">
			<v-toolbar-title class="headline text-uppercase">
				<v-layout row>
					<img src="@/assets/images/logo-imagen.svg" class="mr-3 toolbar-logo-image">
					<span class="font-weight-light">Home</span>
					<span class="font-weight-bold">Switch</span>
					<span class="font-weight-light">Home</span>
				</v-layout>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn
					flat
					color="primary"
					class="text--lighten-1"
					:to="{ name: 'inicio' }"
					exact
				>
					Inicio
				</v-btn>
				<v-btn
					flat
					v-if="(clienteLoggedIn === null) & !esAdmin"
					color="primary"
					class="text--lighten-1"
					:to="{ name: 'iniciar sesion como cliente' }"
				>
					Ingresar
				</v-btn>
				<v-btn
					flat
					v-if="esAdmin"
					color="primary"
					class="text--lighten-1"
					:to="{ name: 'administracion' }"
				>
					Administración
				</v-btn>
				<v-btn
					flat
					v-if="clienteLoggedIn === null"
					color="primary"
					class="text--lighten-1"
					:to="{ name: 'info de usuario' }"
				>
					Cuenta <v-icon dark class="ml-1">build</v-icon>
				</v-btn>
				<v-btn
					flat
					v-if="(clienteLoggedIn !== null) | esAdmin"
					color="accent"
					class="text--lighten-3 ml-4"
					@click="salir( )"
				>
					Salir <v-icon class="ml-1">exit_to_app</v-icon>
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<v-content>
			<router-view></router-view>
			<Alerta></Alerta>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';
import Alerta from '@/components/Alerta.vue';
import { Cliente } from '@/interfaces/cliente.interface';

@Component({
	components: {
		Alerta
	}
})
export default class App extends Vue {
	/**
	 * Retorna si el usuario tiene permisos de administrador.
	 */
	public get esAdmin( ): boolean {
		return this.$store.getters.esAdmin;
	}
	public get clienteLoggedIn(): Cliente | null {
		return this.$store.getters.clienteLoggedIn;
	}
	/**
	 * Cierra la sesión del usuario actual
	 */
	public async salir( ): Promise<void> {
		if (this.clienteLoggedIn === null) {
			await this.$store.dispatch( 'cerrarSesionComoAdmin' );
		} else {
			this.$store.getters.clienteLoggedIn = null;
		}
		await this.$store.dispatch( 'mostrarAlerta', { texto: 'Saliste de Home Switch Home', tipo: 'success' } );
		this.$router.push({ name: 'inicio' });
	}
}
</script>

<style lang="stylus" scoped>
	.toolbar-logo-image
		max-height: 2rem
</style>
