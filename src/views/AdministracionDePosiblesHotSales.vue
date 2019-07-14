<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>

			<v-flex align-center>
				<v-layout align-center justify-center>
					<p class="display-1">
						<span class="font-weight-black"> Posibles hot sales: </span>
					</p>
				</v-layout>

				<br>
				<hr>
			</v-flex>

			<v-flex xs12>

				<v-data-table
					class="elevation-1"
					:headers="encabezadosDeTabla"
					:items="publicaciones"
					no-data-text="No hay posibles hot sales por el momento."
				>
					<template #items="props">
						<td class="text-xs-right">{{ props.item._id }}</td>
						<td class="text-xs-right">{{ residenciaConId(props.item.idResidencia).titulo }}</td>
						<td class="text-xs-right">{{ formatearFecha(props.item.fechaDeInicioDeSemana) }}</td>

						<td>
							<v-layout row>
								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											v-on="on"
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

								<v-tooltip left open-delay="100" close-delay="0">
									<template v-slot:activator="{ on }">
										<v-btn
											v-on="on"
											flat
											icon
											class="secondary--text"
											:to="generarRuta( props.item.idResidencia )"
										>
										<v-icon>whatshot</v-icon>
										</v-btn>
									</template>
									<span>Crear hot sale</span>
								</v-tooltip>
							</v-layout>
						</td>
					</template>
				</v-data-table>

			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeReservasDirectas from '@/components/TablaDeReservasDirectas.vue';
	import { server } from '@/utils/helper';
	import { Publicacion } from '@/interfaces/publicacion.interface';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import moment from 'moment';

	@Component
	export default class AdministracionDePosiblesHotSales extends Vue {

		/**
		 * Lista de todas las publicaciones actualmente en el sistema.
		 */
		public get publicaciones( ): Publicacion[ ] {
			return this.$store.getters.posiblesHotSales;
		}

		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Id',
				value: '_id',
				align: 'right'
			},
			{
				text: 'Titulo',
				value: 'titulo',
				align: 'right'
			},
			{
				text: 'Fecha de inicio de semana',
				value: 'fechaDeInicioDeSemana',
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

		public formatearFecha(fecha: string): string {
			return moment(fecha).format('DD/MM/YYYY');
		}

		public created( ) {
			this.$store.dispatch( 'obtenerResidencias' );
			this.$store.dispatch( 'obtenerPublicaciones' );
			this.$store.dispatch( 'obtenerAdquisiciones' );
		}

		public residenciaConId( idResidencia: string): Residencia {
			return this.$store.getters.residenciaConId( idResidencia );
		}
	}
</script>