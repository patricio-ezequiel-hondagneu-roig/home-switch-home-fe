<template>
	<v-app>
		<v-toolbar app dark color="secondary" class="darken-2 primary--text text--lighten-1">
			<v-toolbar-title class="headline text-uppercase">
				<v-layout row align-content-space-between>
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
					v-if="!esAdmin"
					color="primary"
					class="text--lighten-1"
					:to="{ name: 'ingresar' }"
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
					v-if="esAdmin"
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
		</v-content>
	</v-app>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class App extends Vue {

		public get esAdmin( ): boolean {
			return this.$store.getters.esAdmin;
		}

		public async salir( ): Promise<void> {
			await this.$store.dispatch( 'cerrarSesionComoAdmin' );
			this.$router.push({ name: 'ingresar' });
		}
	}
</script>