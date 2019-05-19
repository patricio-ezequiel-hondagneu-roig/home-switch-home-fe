<template>
	<v-container fluid fill-height>
		<v-layout align-center row wrap>
			<v-flex box align-center justify-center>
				<v-btn flat class="success" @click.stop="mostrarFormularioDeCarga( )">
					Cargar residencia
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargaDeResidencia
						@residenciaCreada="agregarResidencia( $event )"
						@error="mostrarError( $event )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaDeResidencias
					:residencias="residencias"
					@residenciaModificada="modificarResidencia( $event )"
					@error="mostrarError( $event )"
					@residenciaEliminada="eliminarResidencia( $event )"
				></TablaDeResidencias>
			</v-flex>
		</v-layout>

		<v-snackbar
			v-model="alertaEsVisible"
			:color="tipoDeAlerta"
			bottom
			left
			multi-line
		>
			{{ textoDeAlerta }}
			<v-btn
				flat
				@click="ocultarAlerta( )"
			>Cerrar</v-btn>
		</v-snackbar>
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
		 * Flag que indica si se debe o no mostrar la alerta.
		 */
		public alertaEsVisible: boolean = false;

		/**
		 * Valor que indica el color con el que se muestra la alerta.
		 */
		public tipoDeAlerta: VuetifyThemeOptionName = 'info';

		/**
		 * Texto a mostrar en la alerta.
		 */
		public textoDeAlerta: string = '';

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
		 * Muestra un error en la alerta.
		 */
		public mostrarError( error: Error ): void {
			this.mostrarAlerta( error.message, 'error' );
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

		/**
		 * Muestra la alerta con el texto y tipo indicados.
		 */
		public mostrarAlerta( texto: string, tipo: VuetifyThemeOptionName ): void {
			this.textoDeAlerta = texto;
			this.tipoDeAlerta = tipo;
			this.alertaEsVisible = true;
		}

		/**
		 * Oculta la alerta.
		 */
		public ocultarAlerta( ): void {
			this.textoDeAlerta = '';
			this.tipoDeAlerta = 'info';
			this.alertaEsVisible = false;
		}
	}
</script>