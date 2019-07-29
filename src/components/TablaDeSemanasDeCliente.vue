<template>
	<v-card>
		<v-data-table
			id="tabla"
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="adquisiciones"
			:rows-per-page-items="[8]"
			no-data-text="No has adquirido semanas aún"
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
					<td class="text-xs-right">{{ (formatearFecha(props.item.fechaDeCreacion)) }}</td>
					<td class="text-xs-right">{{ (props.item.tipoDeAdquisicion) }}</td>
					<td class="text-xs-right">{{ (props.item.monto) }}</td>
					<td>
						<v-layout row>
							<v-tooltip left open-delay="100" close-delay="0">
								<template v-slot:activator="{ on }">
									<v-btn
										flat
										icon
										class="secondary--text"
										@click.stop="cancelarAdquisicion( props.item._id )"
										v-on="on"
									>
										<v-icon>delete</v-icon>
									</v-btn>
								</template>
								<span>Cancelar adquisicion</span>
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Adquisicion } from '@/interfaces/adquisicion.interface';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import moment from 'moment';
import DetalleDeResidencia from './DetalleDeResidencia.vue';
import { Residencia } from '@/interfaces/residencia.interface';
import { Publicacion } from '../interfaces/publicacion.interface';
import { Cliente, ClienteParaModificar } from '@/interfaces/cliente.interface';

@Component({
	components: {
		DetalleDeResidencia
	}
})
export default class TablaDeSemanasDeCliente extends Vue {
	// prop necesario para el funcionamiento del componente
	// hace referencia a la idCliente del cliente logeado actualmente
	@Prop()
	public readonly idCliente!: string;
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

	// La unica razon por la que hay un modelo de ClienteParaModificar es porque en la reserva directa ...
	// ... al cancelarla te devuelve un credito
	public modelo: ClienteParaModificar = {
		idSuscripcion: this.cliente.idSuscripcion ,
		esAdmin: this.cliente.esAdmin,
		nombre: this.cliente.nombre ,
		apellido: this.cliente.apellido ,
		email: this.cliente.email ,
		contraseña: this.cliente.contraseña ,
		fechaDeNacimiento: this.cliente.fechaDeNacimiento ,
		celular: this.cliente.celular ,
		pais: this.cliente.pais ,
		tarjetaDeCredito: this.cliente.tarjetaDeCredito ,
		codigoDeSeguridad: this.cliente.codigoDeSeguridad,
		fechaDeExpiracion: this.cliente.fechaDeExpiracion,
		creditos: this.cliente.creditos
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
			text: 'Fecha de adquisición',
			value: 'fechaAdquisicion',
			align: 'right'
		},
		{
			text: 'Tipo',
			value: 'tipo',
			align: 'right'
		},
		{
			text: 'Pagaste',
			value: 'pagado',
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
		this.$store.dispatch('adquisicionesDeClienteId', this.idCliente);
		this.$store.dispatch('obtenerPublicaciones');
		this.$store.dispatch('obtenerResidencias');
	}

	// formatea fecha para poder ser mostrada
	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}

	/** obtener adquisiciones del cliente logeado */
	public get adquisiciones(): Adquisicion[ ] {
		return this.$store.getters.adquisiciones;
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

	// cancelacion de adquisicion segun idAdquisicion
	public async cancelarAdquisicion( idAdquisicion: string ) {
		const adquisicion = this.$store.getters.adquisicionConId(idAdquisicion);
		switch ( adquisicion.tipoDeAdquisicion ) {
			case 'reserva directa': {
				// Primero elimino la reserva directa
				await this.$store.dispatch( 'eliminarAdquisicion', adquisicion._id );
				// Segundo me fijo el comienzo de la semana ya.
				// En el caso que ya paso la semana no devuelvo un credito.
				// En el caso de que se cancele una reserva directa y no haya ...
				// ... comenzado la semana se devuelve un credito.
				const publicacion: Publicacion = this.$store.getters.publicacionConId( adquisicion.idPublicacion );
				if ( moment(publicacion.fechaDeInicioDeSemana).isAfter( moment() ) ) {
					// Agrego el credito a retornar por la cancelacion de la reserva directa
					this.modelo.creditos.push({
						fechaDeCreacion: moment().utc().toISOString(),
						activo: true
					});

					await this.$store.dispatch( 'modificarPerfil', {
						idCliente: this.cliente._id,
						clienteParaModificar: this.modelo,
					});
				}

				break;
			}
			case 'hot sale': {
				// statements;
				break;
			}
			case 'subasta': {
				// statements;
				break;
			}
			default: {
				// statements;
				break;
			}
		}
	}
	// the end is nigh

	public get cliente(): Cliente {
		return this.$store.getters.perfil;
	}
}
</script>