<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="subastas"
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item._id }}</td>
				<td class="text-xs-right">{{ props.item.idResidencia }}</td>
				<td class="text-xs-right">{{ props.item.fechaDeInicio }}</td>
				<td class="text-xs-right">{{ props.item.fechaDeFin }}</td>
				<td class="text-xs-right">{{ props.item.montoInicial }}</td>
				<td class="text-xs-right">
					{{ props.item.ofertas.length }} {{ props.item.ofertas.length === 1 ? 'oferta' : 'ofertas' }}
				</td>

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
							<span>Editar subasta</span>
						</v-tooltip>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="eliminarSubasta( props.item._id )"
									v-on="on"
								>
									<v-icon>delete</v-icon>
								</v-btn>
							</template>
							<span>Eliminar subasta</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>

		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDeSubasta
				v-if="subastaParaModificar !== null"
				:subasta="subastaParaModificar"
				@subastaModificada="modificarSubasta( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
	</div>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { Subasta, SubastaParaModificar } from '@/interfaces/subasta.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';
	import ModificacionDeSubasta from './ModificacionDeSubasta.vue';

	@Component({
		components: {
			ModificacionDeSubasta
		}
	})
	export default class TablaDeSubasta extends Vue {
		/**
		 * Lista de las subastas a mostrar en la tabla
		 */
		@Prop( )
		public readonly subastas!: Subasta[ ];

		/**
		 * Flag que indica si se debe o no mostrar el formulario de modificación.
		 */
		public formularioDeModificacionEsVisible: boolean = false;

		/**
		 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
		 */
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Id',
				value: '_id',
				align: 'right'
			},
			{
				text: 'idResidencia',
				value: 'idResidencia',
				align: 'right'
			},
			{
				text: 'Fecha de inicio',
				value: 'fechaDeInicio',
				align: 'right'
			},
			{
				text: 'Fecha de fin',
				value: 'fechaDeFin',
				align: 'right'
			},
			{
				text: 'Monto Inicial',
				value: 'montoInicial',
				align: 'right'
			},
			{
				text: 'Ofertas',
				value: 'ofertas',
				align: 'right'
			},
			{
				text: '',
				value: '',
				align: 'right',
				sortable: false
			},
		];

		/**
		 * Variable que almacena una subasta mientras está siendo modificada, es _null_ en cualquier otro caso.
		 */
		public subastaParaModificar: Subasta | null = null;

		/**
		 * Emite el evento _subastaModificada_.
		 */
		@Emit( 'subastaModificada' )
		public emitirEventoSubastaModificada( ): void { }

		/**
		 * Emite el evento _subastaEliminada_.
		 */
		@Emit( 'subastaEliminada' )
		public emitirEventoSubastaEliminada( ): void { }

		/**
		 * Oculta el formulario de modificación de subastas y emite el evento _subastaModificada_.
		 */
		public modificarSubasta( subasta: Subasta ): void {
			this.emitirEventoSubastaModificada( );
			this.ocultarFormularioDeModificacion( );
		}

		/**
		 * Solicita la eliminación de la subasta con el ID recibido.
		 *
		 * Al recibir la respuesta de éxito emite el evento _subastaModificada_.
		 *
		 * Falla en caso de que no exista subasta con el ID recibido.
		 */
		public eliminarSubasta( idSubasta: string ): void {
			this.$store.dispatch( 'eliminarSubasta', idSubasta );
		}

		/**
		 * Muestra el formulario de modificación de subastas para la subasta con un ID dado.
		 */
		public mostrarFormularioDeModificacion( idSubasta: string ): void {
			const subasta: Subasta | undefined = this.subastas.find( ( _subasta ) => {
				return _subasta._id === idSubasta;
			});

			if ( subasta === undefined ) {
				throw new Error( `No existe ninguna subasta con ID "${ idSubasta }"` );
			}

			this.subastaParaModificar = subasta;

			this.formularioDeModificacionEsVisible = true;
		}

		/**
		 * Oculta el formulario de modificación de subastas.
		 */
		public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
			this.subastaParaModificar = null;
		}
	}
</script>