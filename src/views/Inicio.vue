<template>
	<div class="pa-5">
		<div class="text-md-center display-3">
			Bienvenid@ a
			<span class="font-weight-light darken-2 primary--text text--lighten-1">
				Home<span class="font-weight-bold">Switch</span> Home
			</span>
		</div>
		<img src="https://i.imgur.com/3ZY7s2y.png" class="center"/>
		<br>
		<hr>
		<br>
		<p class="text-xs-center display-2">Subastas:</p>

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
									@click.stop="mostrarFormularioDeModificacion( props.item.idSubasta )"
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
									@click.stop="mostrarFormularioDeModificacion( props.item.idSubasta )"
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


	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeSubastas from '@/components/TablaDeSubastas.vue';
	import { server } from '@/utils/helper';
	import { Subasta } from '@/interfaces/subasta.interface';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import axios from 'axios';

	@Component
	export default class Inicio extends Vue {
		public subastas: Subasta[ ] = [ ]; // duda

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

		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Id',
				value: 'idSubasta',
				align: 'right'
			},
			{
				text: 'idResidencia',
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