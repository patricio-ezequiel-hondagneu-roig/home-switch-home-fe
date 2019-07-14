<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="publicaciones"
			no-data-text="No hay publicaciones cargadas aún."
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item._id }}</td>
				<td class="text-xs-right">{{ props.item.idResidencia }}</td>
				<td class="text-xs-right">{{ formatearFecha(props.item.fechaDeInicioDeSemana) }}</td>
				<td class="text-xs-right">{{ adquirida(props.item._id) }}</td>

				<td>
					<v-layout row>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									:to="generarRuta( props.item.idResidencia )"
								>
								<v-icon>home</v-icon>
								</v-btn>
							</template>
							<span>Informacion de Residencia Completa</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>
	</div>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { Publicacion } from '@/interfaces/publicacion.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';
	import moment from 'moment';

	@Component
	export default class TablaDeReservasDirectas extends Vue {


		/**
		 * Lista de todas las publicaciones actualmente en el sistema.
		 */
		public get publicaciones( ): Publicacion[ ] {
			return this.$store.getters.publicaciones;
		}

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
				text: 'Fecha de inicio de semana',
				value: 'fechaDeInicioDeSemana',
				align: 'right'
			},
			{
				text: 'Esta adquirida',
				value: '',
				align: 'right'
			},
			{
				text: '',
				value: '',
				align: 'right',
				sortable: false
			},
		];

		public generarRuta( idResidencia: string ): object {
			return {
				name: 'residencia con id',
				params: {
					idResidencia
				}
			};
		}

		public adquirida( idPublicacion: string): string {
			// Fijarse si esta adquirida la publicacion o no
			return 'No';
		}

		public formatearFecha(fecha: string): string {
			return moment(fecha).format('DD/MM/YYYY');
		}
	}
</script>