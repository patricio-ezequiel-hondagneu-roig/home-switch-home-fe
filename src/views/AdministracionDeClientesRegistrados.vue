<template>
	<v-container fluid>
		<v-layout column wrap>
			<v-flex>
				<TablaDeClientes></TablaDeClientes>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeClientes from '@/components/TablaDeClientes.vue';
	import { server } from '@/utils/helper';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

	@Component({
		components: {
			TablaDeClientes,
		},
	})
	export default class AdministracionDeClientesRegistrados extends Vue {

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga los clientes actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerClientes( );
		}
		/**
		 * Solicita la lista de todas los clientes actualmente en el sistema.
		 *
		 * Al recibir una respuesta de éxito, actualiza la lista de clientes del store con las recibidas.
		 */
		public obtenerClientes( ): void {
			this.$store.dispatch( 'obtenerClientes' );
		}
	}
</script>