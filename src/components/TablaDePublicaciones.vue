<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="publicaciones"
			no-data-text="No hay publicaciones cargadas aún."
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item.montoInicialDeSubasta }}</td>
				<td class="text-xs-right">{{ formatearFecha(props.item.fechaDeInicioDeSemana) }}</td>
				<td class="text-xs-right">{{ formatearBooleano(props.item.cerroSubasta) }}</td>

				<td>
					<v-layout row>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="mostrarFormularioDeModificacion( props.item._id )"
									v-on="on"
								>
									<v-icon>edit</v-icon>
								</v-btn>
							</template>
							<span>Editar publicacion</span>
						</v-tooltip>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="eliminarPublicacion( props.item._id )"
									v-on="on"
								>
									<v-icon>delete</v-icon>
								</v-btn>
							</template>
							<span>Eliminar publicacion</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>

		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDePublicacion
				v-if="publicacionParaModificar !== null"
				:publicacion="publicacionParaModificar"
				@publicacionModificada="modificarPublicacion( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
	</div>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { Publicacion, PublicacionParaModificar } from '@/interfaces/publicacion.interface';
	import { Adquisicion } from '@/interfaces/adquisicion.interface';
	import { Hotsale } from '@/interfaces/hotsale.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';
	import ModificacionDePublicacion from './ModificacionDePublicacion.vue';
	import moment from 'moment';
import { TipoDeAdquisicion } from '../utils/tipoDeAdquisicion.enum';

	@Component({
		components: {
			ModificacionDePublicacion
		}
	})
	export default class TablaDePublicaciones extends Vue {

		/**
		 * Lista de las publicaciones a mostrar en la tabla
		 */
		@Prop( )
		public readonly publicaciones!: Publicacion[ ];

		/**
		 * Flag que indica si se debe o no mostrar el formulario de modificación.
		 */
		public formularioDeModificacionEsVisible: boolean = false;

		/**
		 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
		 */
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Monto inicial de subasta',
				value: 'montoInicialDeSubasta',
				align: 'right'
			},
			{
				text: 'Fecha de inicio de semana',
				value: 'fechaDeInicioDeSemana',
				align: 'right'
			},
			{
				text: 'Cerro subasta',
				value: 'cerroSubasta',
				align: 'right'
			},
		];

		/**
		 * Variable que almacena una publicacion mientras está siendo modificada, es _null_ en cualquier otro caso.
		 */
		public publicacionParaModificar: Publicacion | null = null;

		/**
		 * Emite el evento _publicacionModificada_.
		 */
		@Emit( 'publicacionModificada' )
		public emitirEventoPublicacionModificada( ): void { }

		/**
		 * Emite el evento _publicacionEliminada_.
		 */
		@Emit( 'publicacionEliminada' )
		public emitirEventoPublicacionEliminada( ): void { }

		/**
		 * Oculta el formulario de modificación de publicaciones y emite el evento _publicacionModificada_.
		 */
		public modificarPublicacion( publicacion: Publicacion ): void {
			this.emitirEventoPublicacionModificada( );
			this.ocultarFormularioDeModificacion( );
		}

		/**
		 * Solicita la eliminación de la publicacion con el ID recibido.
		 *
		 * Al recibir la respuesta de éxito emite el evento _publicacionModificada_.
		 *
		 * Falla en caso de que no exista publicacion con el ID recibido.
		 */
		public eliminarPublicacion( idPublicacion: string ): void {
			// Me fijo si tiene hot sales que referencian a la publicacion
			const hotsales: Hotsale[ ] = this.$store.getters.hotsales;
			const hotsalesDePublicacion = hotsales.filter( (hotsale) => {
				return hotsale.idPublicacion === idPublicacion;
			});

			// Me tengo que fijar que no hayan adquisiciones que referencien a la publicacion
			const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
			const adquisicionesDePublicacion = adquisiciones.filter( (adquisicion) => {
				return adquisicion.idPublicacion === idPublicacion;
			});

			if (hotsalesDePublicacion.length > 0) {
				// Caso de hot sale
				this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: 'Hay un Hot Sale asociado a la publicacion'
				});
			} else if (adquisicionesDePublicacion.length > 0)  {
				// Me fijo si tiene ofertas
				const ofertas: Adquisicion[ ] = adquisicionesDePublicacion.filter( (adquisicion) => {
					return adquisicion.tipoDeAdquisicion === TipoDeAdquisicion.Subasta;
				});

				if (ofertas.length > 0) {
					this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'error',
						texto: 'Hay ofertas asociadas a la publicacion'
					});
				} else {
					// Me fijo si tiene una reserva directa
					const reservaDirecta: Adquisicion[ ] = adquisicionesDePublicacion.filter( (adquisicion) => {
						return adquisicion.tipoDeAdquisicion === TipoDeAdquisicion.ReservaDirecta;
					});

					if (reservaDirecta.length > 0) {
						this.$store.dispatch( 'mostrarAlerta', {
							tipo: 'error',
							texto: 'Hay una reserva directa asociada a la publicacion'
						});
					} else {
						// Esto no es necesario pero lo agrego por si las moscas
						this.$store.dispatch( 'mostrarAlerta', {
							tipo: 'error',
							texto: 'Puede haber una reserva directa, ofertas o un hot sale que referencien a esta publicacion'
						});
					}
				}
			} else {
				this.$store.dispatch( 'eliminarPublicacion', idPublicacion );
			}
		}

		public created( ) {
			this.$store.dispatch( 'obtenerResidencias' );
			this.$store.dispatch( 'obtenerPublicaciones' );
			this.$store.dispatch( 'obtenerAdquisiciones' );
			this.$store.dispatch( 'obtenerHotsales' );
		}

		/**
		 * Muestra el formulario de modificación de publicaciones para la publicacion con un ID dado.
		 */
		public mostrarFormularioDeModificacion( idPublicacion: string ): void {
			const publicacion: Publicacion | undefined = this.publicaciones.find( ( _publicacion ) => {
				return _publicacion._id === idPublicacion;
			});

			if ( publicacion === undefined ) {
				throw new Error( `No existe ninguna publicacion con ID "${ idPublicacion }"` );
			}

			this.publicacionParaModificar = publicacion;

			this.formularioDeModificacionEsVisible = true;
		}

		/**
		 * Oculta el formulario de modificación de publicaciones.
		 */
		public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
			this.publicacionParaModificar = null;
		}

		public formatearFecha(fecha: string): string {
			return moment(fecha).format('DD/MM/YYYY');
		}

		public formatearBooleano(booleano: boolean): string {
			return (booleano)
				? 'Si'
				: 'No';
		}
	}
</script>