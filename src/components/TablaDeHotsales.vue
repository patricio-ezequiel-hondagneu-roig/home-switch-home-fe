<template>
	<v-card>
		<v-data-table
			id="tabla"
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="hotsales"
			no-data-text="No hay nada que mostrar :("
		>
			<template #items="props">
				<template>
					<td class="text-xs-right">{{ nombreDeResidenciaDePublicacionId(props.item.idPublicacion) }}</td>
					<td class="text-xs-right">
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									color="#E0E0E0"
									icon
									class="secondary--text"
									@click.stop="mostrarDetallesResidencia( obtenerResidenciaConPublicacionId( props.item.idPublicacion) )"
									v-on="on"
								>
								<v-icon>info</v-icon>
								</v-btn>
							</template>
							<span>Detalles</span>
						</v-tooltip>
					</td>
					<td class="text-xs-right">{{ fechaDeSemanaDePublicacionId(props.item.idPublicacion) }}</td>
					<td class="text-xs-right">{{ (formatearFecha(props.item.fechaDeInicio)) }}</td>
					<td class="text-xs-right">{{ (formatearFecha(props.item.fechaDeFin)) }}</td>
					<td class="text-xs-right">{{ (props.item.monto) }}</td>
					<td>
						<v-layout row>
							<v-tooltip left open-delay="100" close-delay="0">
								<template v-slot:activator="{ on }">
									<v-btn
										flat
										icon
										class="secondary--text"
										@click.stop="terminarHotsale( props.item._id )"
										v-on="on"
									>
										<v-icon>delete</v-icon>
									</v-btn>
								</template>
								<span>Terminar hotsale</span>
							</v-tooltip>
						</v-layout>
					</td>
				</template>
			</template>
		</v-data-table>
		<v-dialog persistent v-model="detalleDeResidenciaEsVisible" max-width="40rem">
			<DetalleDeResidencia
				v-if="residenciaParaMostrar !== null"
				:residencia="residenciaParaMostrar"
				@ok="ocultarDetalleDeResidencia( )"
			/>
		</v-dialog>
	</v-card>
</template>


<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import moment from 'moment';
import DetalleDeResidencia from './DetalleDeResidencia.vue';
import { Residencia } from '@/interfaces/residencia.interface';
import { Publicacion } from '../interfaces/publicacion.interface';
import { Hotsale } from '@/interfaces/hotsale.interface';

@Component({
	components: {
		DetalleDeResidencia
	}
})
export default class TablaDeHotsales extends Vue {
	// se activa cuando alguien desea ver el detalle de una residencia
	public detalleDeResidenciaEsVisible: boolean = false;
	// utilizado para la comunicacion con el componente detalleDeResidencia
	public residenciaParaMostrar: Residencia = {
		_id: '',
		titulo: '',
		pais: '',
		provincia: '',
		localidad: '',
		domicilio: '',
		descripcion: '',
		fotos: [ ],
		montoInicialDeSubasta: 0
	};
	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Residencia',
			value: 'residencia',
			align: 'right'
		},
		{
			text: '',
			value: '',
			align: 'right',
			sortable: false
		},
		{
			text: 'Fecha de semana',
			value: 'fechaSemana',
			align: 'right'
		},
		{
			text: 'Fecha de comienzo',
			value: 'fechaComienzo',
			align: 'right'
		},
		{
			text: 'Fecha de fin',
			value: 'fechaFin',
			align: 'right'
		},
		{
			text: 'Precio',
			value: 'precio',
			align: 'right',
			sortable: false
		},
		{
			text: '',
			value: '',
			align: 'right',
			sortable: false
		},
	];
	// al crearse componente se actualizan todos los arreglos a utilizar
	public created( ) {
		this.$store.dispatch('obtenerPublicaciones');
		this.$store.dispatch('obtenerResidencias');
		this.$store.dispatch('obtenerHotsales');
	}
	// formatea fecha para poder ser mostrada
	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}
	/** obtener adquisiciones del cliente logeado */
	public get hotsales(): Hotsale[ ] {
		return this.$store.getters.hotsales;
	}
	// obtiene publicacion por idPublicacion
	public publicacionId( idPublicacion: string ): Publicacion {
		return this.$store.getters.publicacionConId( idPublicacion );
	}
	// obtiene residencia de una idPublicacion que posee idResidencia
	public obtenerResidenciaConPublicacionId( idPublicacion: string ): Residencia {
		const publicacion = this.publicacionId( idPublicacion );
		return this.$store.getters.residenciaConId(publicacion.idResidencia);
	}
	// obtiene nombre de residencia dada un idPublicacion
	public nombreDeResidenciaDePublicacionId( idPublicacion: string ): string | undefined {
		const residencia = this.obtenerResidenciaConPublicacionId( idPublicacion );
		if ( residencia !== null ) {
			return residencia.titulo;
		}
	}
	// obtiene fecha de semana de publicacion dada un idPublicacion
	public fechaDeSemanaDePublicacionId( idPublicacion: string ): string {
		const publicacion = this.publicacionId( idPublicacion );
		return this.formatearFecha(publicacion.fechaDeInicioDeSemana);
	}
	// sistema de ocultamiento de detalle de residencia
	public mostrarDetallesResidencia( residencia: Residencia ): void {
		this.residenciaParaMostrar = residencia;
		this.detalleDeResidenciaEsVisible = true;
	}
	public ocultarDetalleDeResidencia( ): void {
		this.detalleDeResidenciaEsVisible = false;
	}
	// borrar hotsale
	public terminarHotsale( hotsaleId: string ) {
		this.$store.dispatch( 'eliminarHotsale' , hotsaleId );
	}
	// the end is nigh
}
</script>