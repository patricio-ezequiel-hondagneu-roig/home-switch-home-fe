<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-flex align-center justify-center>
				<v-btn flat class="success" @click.stop="mostrarFormularioDeCarga( )">
					Cargar residencia
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargaDeResidencia
						@residenciaCreada="agregarResidencia( $event )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaDeResidencias
					:residencias="residencias"
					@residenciaModificada="modificarResidencia( $event )"
					@residenciaEliminada="eliminarResidencia( $event )"
				></TablaDeResidencias>
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

	@Component({
		components: {
			CargaDeResidencia,
			TablaDeResidencias,
		},
	})
	export default class VistaAdministrador extends Vue {
		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaEsVisible: boolean = false;

		/**
		 * Lista de todas las residencias actualmente en el sistema.
		 */
		public residencias: Residencia[ ] = [ ];

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
		public async obtenerResidencias( ): Promise<void> {
			// TODO: Agregar bloque try para el caso donde la solicitud falle

			const respuestaResidencias = await axios.get<Residencia[ ]>( `${ server.baseURL }/residencias` );
			this.residencias = respuestaResidencias.data;
		}

		/**
		 * Agrega una residencia a la lista de residencias y oculta el formulario de carga.
		 */
		public agregarResidencia( residenciaCreada: Residencia ): void {
			this.residencias.push( residenciaCreada );
			this.ocultarFormularioDeCarga( );
		}

		/**
		 * Modifica una residencia de la lista de residencias.
		 */
		public modificarResidencia( residenciaModificada: Residencia ): void {
			this.residencias = this.residencias.map( ( _residenciaActual ) => {
				return ( _residenciaActual.idResidencia === residenciaModificada.idResidencia )
					? residenciaModificada
					: _residenciaActual;
			});
		}

		/**
		 * Elimina un residencia de la lista de residencias.
		 */
		public eliminarResidencia( residenciaEliminada: Residencia ): void {
			const indiceDeResidencia: number = this.residencias.findIndex( ( residencia ) => {
				return residencia.idResidencia === residenciaEliminada.idResidencia;
			});

			this.residencias.splice( indiceDeResidencia, 1 );
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