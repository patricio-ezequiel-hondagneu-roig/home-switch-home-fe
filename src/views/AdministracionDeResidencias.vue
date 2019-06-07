<template>
	<v-container fluid fill-height>
		<v-layout align-center row wrap>
			<v-flex align-center justify-center>
				<v-btn flat class="primary" @click.stop="mostrarFormularioDeCarga( )">
					Cargar residencia
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargaDeResidencia
						@residenciaCreada="ocultarFormularioDeCarga( )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaDeResidencias :residencias="residencias"></TablaDeResidencias>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeResidencia from '@/components/CargaDeResidencia.vue';
	import TablaDeResidencias from '@/components/TablaDeResidencias.vue';
	import { server } from '@/utils/helper';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

	@Component({
		components: {
			CargaDeResidencia,
			TablaDeResidencias,
		},
	})
	export default class AdministracionDeResidencias extends Vue {
		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaEsVisible: boolean = false;

		/**
		 * Lista de todas las residencias actualmente en el sistema.
		 */
		public get residencias( ): Residencia[ ] {
			return this.$store.getters.residencias;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga las residencias actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerResidencias( );
		}

		/**
		 * Solicita la lista de todas las residencias actualmente en el sistema.
		 *
		 * Al recibir una respuesta de éxito, actualiza la lista de residencias del componente con las recibidas.
		 */
		public obtenerResidencias( ): void {
			this.$store.dispatch( 'obtenerResidencias' );
		}

		/**
		 * Muestra el formulario de carga de residencias.
		 */
		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = true;
		}

		/**
		 * Oculta el formulario de carga de residencias.
		 */
		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = false;
		}
	}
</script>