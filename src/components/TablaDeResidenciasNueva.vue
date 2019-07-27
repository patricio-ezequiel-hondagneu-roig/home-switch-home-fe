<template>

	<div v-if="residencias !== undefined">

		<!-- Elementos con una estructura de control FOR -->
		<v-container wrap>
			<v-layout
				v-for="(residencia, index) in residencias"
				:key="index"
				class="my-2"
			>
				<!-- Asigno un tamaño fijo a la v-card -->
				<v-card
					v-if="residencia !== null"
					height="125"
					style="width: 100%"
					elevation-5
				>
					<v-layout row nowrap>

						<!-- Imagen a mostrar de la residencia -->
						<v-flex shrink>
							<!-- Muestro la primera imagen del arreglo de fotos de la residencia en cuestion -->
							<v-img
								v-if="residencia.fotos.length > 0"
								:src="residencia.fotos[0]"
								height="125"
								width="125"
							/>

							<!-- Si la residencia no tiene imagenes entonces muestro la imagen estandar -->
							<div v-else>
								<img src="@/assets/images/residenciaSinFotoIndex.jpg"
								height="125"
								width="125"
								>
							</div>
						</v-flex>

						<!-- Datos/Informacion de la residencia -->
						<v-layout column class="pa-2">
							<!-- Nombre de la residencia -->
							<h1 class="font-weight-bold headline sombra-texto">
								{{residencia.titulo}}
							</h1>

							<!-- Ubicacion de la residencia -->
							<p
								style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
								:title="ubicacionCompleta( residencia )"
							>
								{{ ubicacionCompleta( residencia ) }}
							</p>

							<v-layout align-end justify-end>
								<!-- Monto minimo de subasta -->
								<v-layout>
									<p class="subheading ml-3 font-weight-bold">
										Monto inicial de subasta: $ {{ residencia.montoInicialDeSubasta }}
									</p>
								</v-layout>


								<!-- Botones para interactuar con la residencia -->
								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											flat
											icon
											class="secondary--text"
											@click.stop="mostrarFormularioDeModificacion( residencia._id )"
											v-on="on"
										>
											<v-icon>edit</v-icon>
										</v-btn>
									</template>
									<span>Editar residencia</span>
								</v-tooltip>

								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											flat
											icon
											class="secondary--text"
											@click.stop="eliminarResidencia( residencia._id )"
											v-on="on"
										>
											<v-icon>delete</v-icon>
										</v-btn>
									</template>
									<span>Eliminar residencia</span>
								</v-tooltip>

								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											flat
											icon
											class="secondary--text"
											@click.stop="mostrarDetalle( residencia._id )"
										>
										<v-icon>info</v-icon>
										</v-btn>
									</template>
									<span>Detalles de Residencia</span>
								</v-tooltip>

								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											color="#E0E0E0"
											icon
											class="secondary--text"
											:to="generarRuta( residencia._id )"
											v-on="on"
										>
										<v-icon>home</v-icon>
										</v-btn>
									</template>
									<span>Informacion completa</span>
								</v-tooltip>

							</v-layout>
						</v-layout>

					</v-layout>
				</v-card>
			</v-layout>
		</v-container>

		<v-dialog persistent v-model="detalleEsVisible" max-width="40rem">
			<DetalleDeResidencia
				v-if="residenciaParaMostrar !== null"
				:residencia="residenciaParaMostrar"
				@ok="ocultarDetalle( )"
			/>
		</v-dialog>

		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDeResidencia
				v-if="residenciaParaModificar !== null"
				:residencia="residenciaParaModificar"
				@residenciaModificada="modificarResidencia( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
	</div>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { Residencia, ResidenciaParaModificar } from '@/interfaces/residencia.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';
	import ModificacionDeResidencia from './ModificacionDeResidencia.vue';
	import DetalleDeResidencia from './DetalleDeResidencia.vue';
	import router from '@/router';

	@Component({
		components: {
			ModificacionDeResidencia,
			DetalleDeResidencia
		}
	})
	export default class TablaDeResidenciasNueva extends Vue {
		/**
		 * Lista de las residencias a mostrar en la tabla
		 */
		@Prop( )
		public readonly residencias!: Residencia[ ];
		/**
		 * Flag que indica si se debe o no mostrar el formulario de modificación.
		 */
		public formularioDeModificacionEsVisible: boolean = false;
		/**
		 * Flag que indica que el detalle de una residencia es visible
		 */
		public detalleEsVisible: boolean = false;
		/**
		 * Variable que almacena una residencia mientras está siendo modificada, es _null_ en cualquier otro caso.
		 */
		public residenciaParaModificar: Residencia | null = null;
		/**
		 * Variable que almacena una residencia a ser mostrada en detalle
		 */
		public residenciaParaMostrar: Residencia | null = null;


		/**
		 * Emite el evento _residenciaModificada_.
		 */
		@Emit( 'residenciaModificada' )
		public emitirEventoResidenciaModificada( ): void { }

		/**
		 * Emite el evento _residenciaEliminada_.
		 */
		@Emit( 'residenciaEliminada' )
		public emitirEventoResidenciaEliminada( ): void { }

		/**
		 * Emite el evento _error_ con el error recibido.
		 */
		@Emit( 'error' )
		public emitirEventoError( error: Error ): Error {
			return error;
		}

		/**
		 * Oculta el formulario de modificación de residencias y emite el evento _residenciaModificada_.
		 */
		public modificarResidencia( residencia: Residencia ): void {
			this.emitirEventoResidenciaModificada( );
			this.ocultarFormularioDeModificacion( );
		}

		/**
		 * Solicita la eliminación de la residencia con el ID recibido.
		 *
		 * Al recibir la respuesta de éxito emite el evento _residenciaModificada_.
		 *
		 * Falla en caso de que no exista residencia con el ID recibido.
		 */
		public async eliminarResidencia( idResidencia: string ): Promise<void> {
			await this.$store.dispatch( 'eliminarResidencia', idResidencia );
		}
		/**
		 * Mostrar detalle de residencia con un id dado
		 */
		public  mostrarDetalle( idResidencia: string ): void {
			const residencia: Residencia | null = this.$store.getters.residenciaConId( idResidencia );

			if ( residencia === null ) {
				throw new Error( `No existe ninguna residencia con ID "${ idResidencia }"` );
			}

			this.residenciaParaMostrar = residencia;

			this.detalleEsVisible = true;
		}
		/**
		 * Oculta detalla de la residencia
		 */
		public ocultarDetalle( ): void {
			this.detalleEsVisible = false;
			this.residenciaParaMostrar = null;
		}
		/**
		 * Muestra el formulario de modificación de residencias para la residencia con un ID dado.
		 */
		public  mostrarFormularioDeModificacion( idResidencia: string ): void {
			const residencia: Residencia | null = this.$store.getters.residenciaConId( idResidencia );

			if ( residencia === null ) {
				throw new Error( `No existe ninguna residencia con ID "${ idResidencia }"` );
			}

			this.residenciaParaModificar = residencia;

			this.formularioDeModificacionEsVisible = true;
		}

		/**
		 * Oculta el formulario de modificación de residencias.
		 */
		public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
			this.residenciaParaModificar = null;
		}

		public generarRuta( idResidencia: string ): object {
			return {
				name: 'residencia con id',
				params: {
					idResidencia
				}
			};
		}

		public ubicacionCompleta( _residencia: Residencia ): string {
			return `${ _residencia.pais }, ${ _residencia.provincia }, ${ _residencia.localidad }, ${ _residencia.domicilio }`;
		}
	}
</script>