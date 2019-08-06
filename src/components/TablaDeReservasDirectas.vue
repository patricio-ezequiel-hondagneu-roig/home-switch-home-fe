<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="entradasDeTabla"
			no-data-text="No hay publicaciones cargadas aún."
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item.tituloDeResidencia }}</td>
				<td class="text-xs-right">{{ props.item.paisDeResidencia }}</td>
				<td class="text-xs-right">{{ props.item.provinciaDeResidencia }}</td>
				<td class="text-xs-right">{{ props.item.localidadDeResidencia }}</td>
				<td class="text-xs-right">{{ props.item.domicilioDeResidencia }}</td>
				<td class="text-xs-right">{{ formatearFecha(props.item.fechaDeInicioDeSemana) }}</td>
				<td class="text-xs-right">{{ props.item.estaAdquirida ? 'Si' : 'No' }}</td>

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
import { Adquisicion } from '../interfaces/adquisicion.interface';
import { Residencia } from '../interfaces/residencia.interface';

@Component
export default class TablaDeReservasDirectas extends Vue {

	public get entradasDeTabla() {
		const residencias: Residencia[ ] = this.$store.getters.residencias;
		const publicaciones: Publicacion[ ] = this.$store.getters.publicaciones;
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;

		const entradas = publicaciones.map( ( _publicacion ) => {
			const residenciaDePublicacion = residencias.find( ( _residencia ) => {
				return _residencia._id === _publicacion.idResidencia;
			});
			const adquisicionDePublicacion = adquisiciones.find( ( _adquisicion ) => {
				return _adquisicion.idPublicacion === _publicacion._id;
			});

			return {
				idResidencia: _publicacion.idResidencia,
				tituloDeResidencia: residenciaDePublicacion ? residenciaDePublicacion.titulo : '',
				paisDeResidencia: residenciaDePublicacion ? residenciaDePublicacion.pais : '',
				provinciaDeResidencia: residenciaDePublicacion ? residenciaDePublicacion.provincia : '',
				localidadDeResidencia: residenciaDePublicacion ? residenciaDePublicacion.localidad : '',
				domicilioDeResidencia: residenciaDePublicacion ? residenciaDePublicacion.domicilio : '',
				fechaDeInicioDeSemana: _publicacion.fechaDeInicioDeSemana,
				estaAdquirida: adquisicionDePublicacion !== undefined,
			};
		});

		return entradas;
	}

	/**
	 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
	 */
	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Residencia',
			value: 'tituloDeResidencia',
			align: 'right'
		},
		{
			text: 'Pais',
			value: 'paisDeResidencia',
			align: 'right'
		},
		{
			text: 'Provincia',
			value: 'provinciaDeResidencia',
			align: 'right'
		},
		{
			text: 'Localidad',
			value: 'localidadDeResidencia',
			align: 'right'
		},
		{
			text: 'Domicilio',
			value: 'domicilioDeResidencia',
			align: 'right'
		},
		{
			text: 'Fecha de inicio de semana',
			value: 'fechaDeInicioDeSemana',
			align: 'right'
		},
		{
			text: 'Esta adquirida',
			value: 'estaAdquirida',
			align: 'right'
		},
		{
			text: '',
			value: '',
			align: 'right',
			sortable: false
		},
	];


	public created( ) {
		this.$store.dispatch( 'obtenerResidencias' );
		this.$store.dispatch( 'obtenerPublicaciones' );
		this.$store.dispatch( 'obtenerAdquisiciones' );
	}

	public generarRuta( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}

	public adquirida( idPublicacion: string): string {
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
		const hayAdquisiciones = adquisiciones.filter( (adquisicion) => {
			return adquisicion.idPublicacion === idPublicacion;
		});

		if (hayAdquisiciones.length > 0) {
			return 'Si';
		} else {
			return 'No';
		}
	}

	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}
}
</script>