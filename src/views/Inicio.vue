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
			no-data-text="No hay subastas activas por el momento ¡Intentalo más tarde!"
		>
			<template #items="props">
				<td class="text-xs-left" v-if="obtenerResidenciaPorId(props.item.idResidencia) !== null">
					{{
						obtenerResidenciaPorId(props.item.idResidencia).pais + ', ' +
						obtenerResidenciaPorId(props.item.idResidencia).provincia + ', ' +
						obtenerResidenciaPorId(props.item.idResidencia).localidad + ', ' +
						obtenerResidenciaPorId(props.item.idResidencia).domicilio
					}}
				</td>
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
									@click.stop="mostrarOfertar(props.item)"
									v-on="on"
								>
									<v-icon color="green darken-2">attach_money</v-icon>
								</v-btn>
							</template>
							<span>Ofertar</span>
						</v-tooltip>

						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="mostrarDetalles( props.item )"
									v-on="on"
								>
									<v-icon>info</v-icon>
								</v-btn>

							</template>
							<span>Mostrar detalles</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
	</v-data-table>
	<v-dialog persistent v-model="detalleDeSubastaEsVisible" max-width="40rem">
		<DetalleDeSubasta
			:subasta="subasta"
			@ok="ocultarDetalleDeSubasta( )"
		/>
	</v-dialog>
	<v-dialog persistent v-model="ofertarDeSubastaEsVisible" max-width="40rem">
		<CargaDeOfertaDeSubasta
			v-if="ofertarDeSubastaEsVisible"
			:subasta="subasta"
			@ofertaCreada="ocultarOfertarSubasta()"
			@cancelacion="ocultarOfertarSubasta()"
		/>
	</v-dialog>
	</div>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeOfertaDeSubasta from '@/components/CargaDeOfertaDeSubasta.vue';
	import DetalleDeSubasta from '@/components/DetalleDeSubasta.vue';
	import TablaDeSubastas from '@/components/TablaDeSubastas.vue';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { Subasta } from '@/interfaces/subasta.interface';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';

	@Component({
		components: {
			CargaDeOfertaDeSubasta,
			DetalleDeSubasta
		},
	})
	export default class Inicio extends Vue {
		public detalleDeSubastaEsVisible: boolean = false;
		public ofertarDeSubastaEsVisible: boolean = false;

		public subasta: Subasta = {
			_id: '',
			idResidencia: '',
			montoInicial: 0,
			fechaDeInicio: '',
			fechaDeFin: '',
			ofertas: [ ],
		};

		/**
		 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
		 */
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Direccion completa',
				value: '', // Aca no sé que iria
				align: 'center'
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
		 * Lista de todas las residencias actualmente en el sistema.
		 */
		public get residencias( ): Residencia[ ] {
			return this.$store.getters.residencias;
		}

		/**
		 * Lista de todas las subastas actualmente en el sistema.
		 */
		public get subastas( ): Subasta[ ] {
			return this.$store.getters.subastas;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Obtiene las listas de residencias y de subastas.
		 */
		public created( ): void {
			this.obtenerSubastas( );
			this.obtenerResidencias( );
		}

		/**
		 * Solicita al store que actualice la lista local de residencias.
		 */
		public async obtenerResidencias( ): Promise<void> {
			await this.$store.dispatch( 'obtenerResidencias' );
		}

		/**
		 * Solicita al store que actualice la lista local de subastas.
		 */
		public async obtenerSubastas( ): Promise<void> {
			await this.$store.dispatch( 'obtenerSubastas' );
		}

	// -----------------------------------------------------Comportamiento de ventana emergente
		public mostrarDetalles( subastaParaDetallar: Subasta ): void {
			this.subasta = subastaParaDetallar;
			this.mostrarDetalleDeSubasta();
		}
		public mostrarOfertar( subastaParaOfertar: Subasta ): void {
			this.subasta = subastaParaOfertar;
			this.mostrarOfertarSubasta();
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
	// ----------------------------------------------------------------------------------------------

		public obtenerResidenciaPorId( idResidencia: String ): Residencia | null {
			return this.$store.getters.residenciaConId( idResidencia );
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