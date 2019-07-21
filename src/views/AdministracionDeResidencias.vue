<template>
	<v-container fluid>

		<v-flex align-center>
			<v-layout align-center justify-center>
				<p class="display-1">
					<span class="font-weight-black"> Residencias en el sistema: </span>
				</p>
			</v-layout>

			<br>
			<hr>
		</v-flex>

		<v-layout column wrap>
			<v-flex ma-2>
				<v-btn flat class="primary" @click.stop="mostrarFormularioDeCarga( )">
					Cargar residencia
				</v-btn>
			</v-flex>

			<!-- Tabla de residencias viejo
			<v-flex>
				<TablaDeResidencias :residencias="residencias"></TablaDeResidencias>
			</v-flex>
			-->

			<!-- Tabla de residencias nueva -->
			<TablaDeResidenciasNueva :residencias="residencias"></TablaDeResidenciasNueva>
		</v-layout>

		<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
			<CargaDeResidencia
				@residenciaCreada="ocultarFormularioDeCarga( )"
				@cancelacion="ocultarFormularioDeCarga( )"
			/>
		</v-dialog>


	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeResidencia from '@/components/CargaDeResidencia.vue';
	import TablaDeResidencias from '@/components/TablaDeResidencias.vue';
	import TablaDeResidenciasNueva from '@/components/TablaDeResidenciasNueva.vue';
	import { server } from '@/utils/helper';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

	@Component({
		components: {
			CargaDeResidencia,
			TablaDeResidencias,
			TablaDeResidenciasNueva,
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

		// Metodos posibles a borrar

		public ubicacionCompleta( _residencia: Residencia ): string {
			return `${ _residencia.pais }, ${ _residencia.provincia }, ${ _residencia.localidad }, ${ _residencia.domicilio }`;
		}

		public generarRutaDeResidencia( idResidencia: string ): object {
			return {
				name: 'residencia con id',
				params: {
					idResidencia
				}
			};
		}
	}
</script>