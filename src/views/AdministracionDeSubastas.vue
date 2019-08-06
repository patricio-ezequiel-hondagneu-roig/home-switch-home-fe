<template>
	<div>
		<v-container fluid fill-height>
			<v-layout align-center justify-center row wrap>

				<v-flex align-center>
					<v-layout align-center justify-center>
						<p class="display-1">
							<span class="font-weight-black"> Subastas: </span>
						</p>
					</v-layout>

					<hr>
					<br>
				</v-flex>

				<v-flex xs12>

					<v-data-table
						class="elevation-1"
						:headers="encabezadosDeTabla"
						:items="publicaciones"
						no-data-text="No hay posibles hot sales por el momento."
					>
						<template #items="props">
							<td class="text-xs-right">{{ residenciaConId(props.item.idResidencia).titulo }}</td>
							<td class="text-xs-right">{{ formatearFecha(props.item.fechaDeInicioDeSemana) }}</td>
							<td class="text-xs-right">{{ ofertaMaximaDeSubasta(props.item._id) }}</td>


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
												@click.stop="cerrarSubasta( props.item._id)"
											>
											<v-icon>lock</v-icon>
											</v-btn>
										</template>
										<span>Cerrar Subasta</span>
									</v-tooltip>

									<v-tooltip left open-delay="100" close-delay="0">
										<template v-slot:activator="{ on }">
											<v-btn
												color="#E0E0E0"
												icon
												class="secondary--text"
												:to="generarRutaDePublicacion( props.item._id)"
												v-on="on"
											>
											<v-icon>forward</v-icon>
											</v-btn>
										</template>
										<span>Detalles de subasta</span>
									</v-tooltip>
								</v-layout>
							</td>
						</template>
					</v-data-table>

				</v-flex>
			</v-layout>
		</v-container>

		<div>
			<v-dialog v-model="formularioDeCrearHotSale" persistent max-width="40rem">
				<v-card	class="pa-3">
					<v-card-title>
						<h5 class="headline">Ingrese el precio del hot sale</h5>
					</v-card-title>

					<v-card-text>
						<v-form ref="formulario">
							<v-text-field
								:value="modeloDeHotSale.monto"
								@input="modeloDeHotSale.monto = extraerNumero( $event, modeloDeHotSale.monto )"
								label="Precio de hot sale"
								:rules="validadores.precioDeHotSale"
								hint="No puede ser negativo"
								required
								type="number"
							></v-text-field>

							<v-text-field
								v-model="modeloDeHotSale.fechaDeInicio"
								label="Fecha de Inicio"
								:rules="validadores.fechaDeInicio"
								required
								hint="DD/MM/AAAA"
								type="date"
							></v-text-field>

							<v-text-field
								v-model="modeloDeHotSale.fechaDeFin"
								label="Fecha de Fin"
								:rules="validadores.fechaDeFin"
								required
								hint="DD/MM/AAAA"
								type="date"
							></v-text-field>
						</v-form>
					</v-card-text>

					<v-card-text>
						Comienzo de semana:
						<span class="red--text">
							{{ formatearFecha(fechaDeInisioDeSemanaDeLaPublicaccion) }}
						</span>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn flat @click.stop="cancelarCarga( )">
							Cancelar
						</v-btn>
						<v-btn
							color="primary"
							:disabled="!formularioDeCrearHotSale"
							@click.stop="cargarHotSale( )"
						>
							Crear
						</v-btn>
					</v-card-actions>

				</v-card>
			</v-dialog>
		</div>
	</div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import TablaDeReservasDirectas from '@/components/TablaDeReservasDirectas.vue';
import { server } from '@/utils/helper';
import { Publicacion } from '@/interfaces/publicacion.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { Adquisicion } from '@/interfaces/adquisicion.interface';
import { Cliente } from '@/interfaces/cliente.interface';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';
import { Hotsale, HotsaleParaCrear } from '@/interfaces/hotsale.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import moment from 'moment';
import { requerido } from '@/helpers/validadores/requerido';
import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
import { fechaEsFutura } from '@/helpers/validadores/fecha-es-futura';

@Component
export default class AdministracionDeSubastasNuevo extends Vue {


	// Variables para manejar el formulario ---------------------------------
	public formularioDeCrearHotSale: boolean = false;
	public fechaDeInicio!: string;
	public fechaDeFin!: string;
	public idDePublicacionSeleccionada: string | undefined;
	public fechaDeInisioDeSemanaDeLaPublicaccion: string = '';

	public modeloDeHotSale: HotsaleParaCrear = {
		idPublicacion: '',
		fechaDeInicio: '',
		fechaDeFin: '',
		monto: 0,
	};

	public validadores = {
		precioDeHotSale: [
			requerido( 'Precio de hot sale' ),
			numeroNoNegativo( 'Precio de hot sale' )
		],
		fechaDeInicio: [
			requerido( 'Fecha de Inicio' ),
			fechaEsFutura( 'Fecha de Inicio' )
		],
		fechaDeFin: [
			requerido( 'Fecha de Fin' ),
			fechaEsFutura( 'Fecha de Fin' )
		]
	};
	// ----------------------------------------------------------------------

	/**
	 * Lista de todas las publicaciones actualmente en el sistema.
	 */
	public get publicaciones( ): Publicacion[ ] {
		return this.$store.getters.subastasActivas;
	}

	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
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
			text: 'Precio',
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

	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}

	public created( ) {
		this.$store.dispatch( 'obtenerResidencias' );
		this.$store.dispatch( 'obtenerPublicaciones' );
		this.$store.dispatch( 'obtenerAdquisiciones' );
		this.$store.dispatch( 'obtenerClientes' );
	}

	public residenciaConId( idResidencia: string): Residencia {
		return this.$store.getters.residenciaConId( idResidencia );
	}

	public get hotsales( ): Hotsale[ ] {
		return this.$store.getters.hotsales;
	}

	/*
	* +-------------------------------------------------------------------------+
	* |	Desde aca va todo lo relacionado con el formulario de crear hot sale	|
	* +-------------------------------------------------------------------------+
	*/

	public crearHotSale( idPublicacion: string, fechaDeInicioDeSemana: string ) {
		this.idDePublicacionSeleccionada = idPublicacion;
		this.fechaDeInisioDeSemanaDeLaPublicaccion = fechaDeInicioDeSemana;
		this.formularioDeCrearHotSale = true;
	}

	public cancelarCarga( ): void {
		this.idDePublicacionSeleccionada = undefined;
		this.restablecerFormulario( );
	}

	public restablecerFormulario( ): void {
		this.modeloDeHotSale.idPublicacion = '';
		this.modeloDeHotSale.fechaDeInicio = '';
		this.modeloDeHotSale.fechaDeFin = '';
		this.modeloDeHotSale.monto = 0;

		this.formularioDeCrearHotSale = false;
	}

	public async cargarHotSale( ) {
		// Asigno la id de la publicacion y transformo las fechas
		if ( this.idDePublicacionSeleccionada !== undefined ) {
			this.modeloDeHotSale.idPublicacion = this.idDePublicacionSeleccionada;
			this.modeloDeHotSale.fechaDeInicio = moment( this.modeloDeHotSale.fechaDeInicio ).utc().toISOString();
			this.modeloDeHotSale.fechaDeFin = moment( this.modeloDeHotSale.fechaDeFin ).utc().toISOString();

			// Me fijo que no haya un hot sale que referencie a la misma id de publicacion
			const hayHotsaleQueReferenciaEstaPublicacion = this.hotsales.filter ( (hotsale) => {
				return hotsale.idPublicacion === this.idDePublicacionSeleccionada;
			});

			// Me fijo si ya había ofertado anteriormente, en caso de que si busco la adquisicion y la modifico
			if (hayHotsaleQueReferenciaEstaPublicacion.length > 0) {
				// Hay un hotsale, aviso que se tiene que eliminar
				await this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: 'Ya hay un hot sale para esta publicacion, eliminelo si quiere crear uno nuevo'
				});
			} else {
				// No existe un hot sale para esta publicacion, cargo uno nuevo. Antes me fijo que esten bien las fechas
				const publicacionQueSeReferencia = this.$store.getters.publicacionConId(this.modeloDeHotSale.idPublicacion);
				const inicioDeSemana = moment(publicacionQueSeReferencia.fechaDeInicioDeSemana);
				const fechaDeInicioValida: boolean = inicioDeSemana > moment(this.modeloDeHotSale.fechaDeInicio);
				const fechaDeFinValida: boolean = inicioDeSemana > moment(this.modeloDeHotSale.fechaDeFin);
				const fechasValidas: boolean = fechaDeInicioValida && fechaDeFinValida;
				if (fechasValidas) {
					await this.$store.dispatch( 'crearHotsale', this.modeloDeHotSale );
				} else {
					await this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'error',
						texto: 'Alguna de las fechas ingresadas es mayor a la fecha de comienzo de la semana'
					});
				}
			}

			// Vuelvo a tener las adquisiciones
			this.$store.dispatch( 'obtenerHotsales' );

			this.idDePublicacionSeleccionada = undefined;
			this.formularioDeCrearHotSale = false;
		}
	}

	public extraerNumero( texto: string, predeterminado: number ): number {
		const valorNumerico: number = Number.parseFloat( texto );

		return ( isNaN( valorNumerico ) )
			? predeterminado
			: valorNumerico;
	}

	public ofertaMaximaDeSubasta( idPublicacion: string ): number {
		// Junto todas las adquisiciones
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;

		// Junto todas las adquisiciones que referencian a esta publicacion
		const adquisicionesDeSubasta = adquisiciones.filter( (adquisicion) => {
			return adquisicion.idPublicacion === idPublicacion;
		});

		// Junto todas las ofertas de esta publicacion, igual es poco necesario este paso ...
		// ... ya que se sabe que es una subasta
		const ofertasDeSubasta = adquisicionesDeSubasta.filter( (adquisicion) => {
			return adquisicion.tipoDeAdquisicion === 'subasta';
		});

		// Pregunto si hay adquisiciones de tipo subasta, osea ofertas, utilizando el tamaño del arreglo
		if (ofertasDeSubasta.length > 0) {
			const maximo = ofertasDeSubasta
				.sort( ( a, b ) => {
					if ( a.monto > b.monto ) {
						return -1;
					}
					else if ( a.monto < b.monto ) {
						return +1;
					}
					else {
						return 0;
					}
				});
			return maximo[0].monto;
		} else {
			return this.$store.getters.publicacionConId(idPublicacion).montoInicialDeSubasta;
		}
	}


	public cantidadDeOfertas( idPublicacion: string ): number {
		// Junto todas las adquisiciones
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;

		// Junto todas las adquisiciones que referencian a esta publicacion
		const adquisicionesDeSubasta = adquisiciones.filter( (adquisicion) => {
			return adquisicion.idPublicacion === idPublicacion;
		});

		// Junto todas las ofertas de esta publicacion, igual es poco necesario este paso ...
		// ... ya que se sabe que es una subasta
		const ofertasDeSubasta = adquisicionesDeSubasta.filter( (adquisicion) => {
			return adquisicion.tipoDeAdquisicion === 'subasta';
		});

		// Pregunto si hay adquisiciones de tipo subasta, osea ofertas, utilizando el tamaño del arreglo
		if (ofertasDeSubasta.length > 0) {
			return ofertasDeSubasta.length;
		} else {
			return 0;
		}
	}

	public generarRutaDePublicacion( idPublicacion: string ): object {
		return {
			name: 'publicacion con id',
			params: {
				idPublicacion
			}
		};
	}

	public cerrarSubasta( idSubasta: string){
		this.$store.dispatch('terminarSubasta',idSubasta);
	}
}
</script>