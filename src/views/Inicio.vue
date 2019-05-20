<template>
	<div class="pa-5">
		<div class="text-md-center display-3">
			Bienvenid@ a
			<span class="font-weight-light darken-2 primary--text text--lighten-1">
				Home<span class="font-weight-bold">Switch</span> Home
			</span>
		</div>
		<img src="@/assets/images/logo-imagen.svg" class="center"/>
		<hr class="my-4">
		<p class="display-1">Subastas</p>

		<!-- Tabla de subastas para que los visitantes puedan visualizarla y ofertar -->
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="subastas"
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item.idSubasta }}</td>
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
									@click.stop="mostrarOfertarSubasta()"
									v-on="on"
								>
									<v-icon color="green darken-2">attach_money</v-icon>
								</v-btn>
								<v-dialog persistent v-model="ofertarDeSubastaEsVisible" max-width="40rem">
									<OfertarSubasta
										:subasta="props.item"
										@ofertaCreada="ocultarOfertarSubasta()"
										@cancelacion="ocultarOfertarSubasta()"
									/>
								</v-dialog>
							</template>
							<span>Ofertar</span>
						</v-tooltip>

						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="mostrarDetalleDeSubasta( )"
									v-on="on"
								>
									<v-icon>info</v-icon>
								</v-btn>
								<v-dialog persistent v-model="detalleDeSubastaEsVisible" max-width="40rem">
									<DetalleDeSubasta
										:idSubasta="props.item.idSubasta"
										@ok="ocultarDetalleDeSubasta( )"
									/>
								</v-dialog>
							</template>
							<span>Mostrar detalles</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>


	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeSubastas from '@/components/TablaDeSubastas.vue';
	import { server } from '@/utils/helper';
	import { Subasta } from '@/interfaces/subasta.interface';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import axios from 'axios';
	import DetalleDeSubasta from '@/components/DetalleDeSubasta.vue';
	import OfertarSubasta from '@/components/OfertarSubasta.vue';

	@Component({
		components: {
			DetalleDeSubasta,
			OfertarSubasta
		},
	})
	export default class Inicio extends Vue {
		/**
		 * Lista de todas las subastas actualmente en el sistema.
		 */
		public subastas: Subasta[ ] = [ ];
		public detalleDeSubastaEsVisible: boolean = false;
		public ofertarDeSubastaEsVisible: boolean = false;

		/**
		 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
		 */
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'ID',
				value: 'idSubasta',
				align: 'right'
			},
			{
				text: 'ID de residencia',
				value: 'idResidencia',
				align: 'right'
			},
			{
				text: 'Fecha de fin',
				value: 'fechaDeFin',
				align: 'right'
			},
			{
				text: 'Fecha de inicio',
				value: 'fechaDeInicio',
				align: 'right'
			},
			{
				text: 'Monto inicial',
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
		 * Hook de ciclo de vida.
		 *
		 * Carga las subastas actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerSubastas( );
		}

		/**
		 * Solicita la lista de todas las subastas actualmente en el sistema.
		 *
		 * Al recibir una respuesta de éxito, actualiza la lista de subastas del componente con las recibidas.
		 */
		public async obtenerSubastas( ): Promise<void> {
			// TODO: Agregar bloque try para el caso donde la solicitud falle

			const respuestaSubastas = await axios.get<Subasta[ ]>( `${ server.baseURL }/subastas` );
			this.subastas = respuestaSubastas.data;
		}
		public mostrarDetalleDeSubasta( ): void {
			this.detalleDeSubastaEsVisible = true;
		}
		public ocultarDetalleDeSubasta( ): void {
			this.detalleDeSubastaEsVisible = false;
		}
		public mostrarOfertarSubasta( ): void {
			this.ofertarDeSubastaEsVisible = true;
		}
		public ocultarOfertarSubasta( ): void {
			this.ofertarDeSubastaEsVisible = false;
		}
	}
</script>

<style>
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 20%;
	}
</style>