<template>
	<v-layout align-center column>
		<h1 class="mt-4">Administrar admins</h1>
		<v-container fluid>
			<v-layout column wrap>
				<v-flex>
					<TablaDeAdmins></TablaDeAdmins>
				</v-flex>
			</v-layout>
		</v-container>
	</v-layout>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeAdmins from '@/components/TablaDeAdmins.vue';
	import { server } from '@/utils/helper';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

	@Component({
		components: {
			TablaDeAdmins,
		},
	})
	export default class AdministracionDeAdmins extends Vue {

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga los clientes actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerClientes( );
			this.obtenerSuscripciones( );
		}
		/**
		 * Solicita la lista de todas los clientes actualmente en el sistema.
		 *
		 * Al recibir una respuesta de éxito, actualiza la lista de clientes del store con las recibidas.
		 */
		public obtenerClientes( ): void {
			this.$store.dispatch( 'obtenerClientes' );
		}
		public obtenerSuscripciones( ): void {
			this.$store.dispatch( 'obtenerSuscripciones' );
		}
	}
</script>