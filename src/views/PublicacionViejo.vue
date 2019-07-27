<template>
	<!-- Pregunta si la publicacion no es null, solucionando el problema de renderizado -->
	<div v-if="publicacion !== null">
		<!-- Contenido a mostrar si la subasta no cerro -->
		<div
			v-if="esUnaSubastaActiva"
			style="max-width: 800px; margin: auto;"
		>

			<br>

			<v-card>
				<!-- Cabecera de la v-card -->
				<v-toolbar
					color="primary"
					height="45px"
				>
					<v-layout justify-center>
						<v-toolbar-title class="font-weight-black display-1">
							<span class="white--text">
								Residencia en subasta:
							</span>
						</v-toolbar-title>
					</v-layout>
				</v-toolbar>

				<span class="headline font-weight-medium">
					<!-- Imagenes/fotos acerca de la residencia -->
					<v-carousel
						style="height: 200px"
						v-if="residencia.fotos.length > 0"
					>
						<v-carousel-item
							v-for="(foto,i) in fotos"
							:key="i"
							style="background-color: #111111; max-height=100vh"
						>
							<v-layout row justify-center>
								<img
									:src="foto"
									style="height: 200px"
								>
							</v-layout>
						</v-carousel-item>
					</v-carousel>

					<!-- Caso de que la residencia referencia no tenga fotos -->
					<v-carousel
						style="height: 200px"
						v-else
					>
						<v-carousel-item
							v-for="(number,i) in 1"
							:key="i"
							style="background-color: #111111; max-height=100vh"
						>
							<v-layout row justify-center>
								<img
									style="height: 200px"
									src="@/assets/images/residenciaSinFoto.jpg"
								>
							</v-layout>
						</v-carousel-item>
					</v-carousel>

					<br>

					<!-- Nombre/titulo de la residencia -->
					<h1 class="font-weight-bold headline sombra-texto text-xs-center" style="padding-left: 20px">
						{{ obtenerResidenciaConId(publicacion.idResidencia).titulo }}
					</h1>
					<v-flex text-xs-right>
						<v-btn
							color="primary"
							:to="generarRutaDeResidencia( publicacion.idResidencia )"
							outline
						>
							Más información
						</v-btn>
					</v-flex>
				</span>

				<v-spacer></v-spacer>
				<br>
				<v-divider></v-divider>
				<br>

				<!-- Contenido de la v-card -->
				<h1 class="font-weight-bold headline sombra-texto text-xs-center" style="padding-left: 20px">
					Monto inicial de subasta: ${{ publicacion.montoInicialDeSubasta }}
				</h1>

				<br>

				<h1 class="font-weight-regular headline sombra-texto" style="padding-left: 20px">
					Precio minimo de oferta:

					<!-- Tengo que llamar a un metodo que junte todas las ofertas y agarre la mayor -->
					${{ ofertaMaxima }}

					<br>

					<span v-if="noHayOfertasDelCliente( publicacion._id )" class="font-weight-bold">
						<br>
						Tu oferta:
						$ {{ ofertaDelCliente( publicacion._id ) }}
					</span>

					<br>
					<v-flex text-xs-right>
						<!-- Boton para cancelar la oferta si es que el cliente posee ofertas en la publicacion -->
						<v-btn
							text-xs-right v-if="noHayOfertasDelCliente( publicacion._id )"
							outline
							large
							@click.stop="cancelarOferta( publicacion._id )"
						>
							Cancelar oferta
						</v-btn>

						<v-btn
							color="#ed9702"
							large
							@click.stop="ofertar( publicacion._id )"
						>
							Ofertar
						</v-btn>
					</v-flex>

				</h1>

				<v-spacer></v-spacer>
				<br>

				<v-divider></v-divider>
				<br>

				<!-- Tabla que contiene el historial de las ofertas -->
				<h1 class="font-weight-bold headline sombra-texto" style="padding-left: 20px">
				Historial:
				</h1>
				<v-data-table
					:headers="encabezadosDeTabla"
					:items="adquisicionesDePublicacion"
					class="elevation-1"
					no-data-text="No hay ofertas."
				>
					<template v-slot:items="props">
							<td> {{ props.item.monto }} </td>
							<td> {{ formatearFecha(props.item.fechaDeCreacion) }} </td>
					</template>
				</v-data-table>
				<br>


			</v-card>

		</div>

		<!-- Contenido a mostrar si la subasta cerro -->
		<div v-else>
			La publicación en cuestión no se puede visualizar en este momento.
		</div>

		<v-dialog v-model="formularioDeOferta" persistent max-width="40rem">
			<v-card	class="pa-3">
				<span style="font-weight:bold">Monto minimo de oferta :</span>
				$ {{ this.ofertaMaxima }}
				<br>

				<v-card-title>
					<h5 class="headline">Ingrese el monto a ofertar</h5>
				</v-card-title>

				<v-card-text>
					<v-form ref="formulario">
						<v-text-field
							:value="montoDeOferta"
							@input="montoDeOferta = extraerNumero( $event, montoDeOferta )"
							label="Monto de oferta"
							:rules="validadores.montoDeOferta"
							hint="No puede ser negativo"
							required
						></v-text-field>
					</v-form>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn flat @click.stop="cancelarCarga( )">
						Cancelar
					</v-btn>
					<v-btn
						color="#ed9702"
						:disabled="!formularioDeOferta"
						@click.stop="realizarOferta( )"
					>
						Ofertar
					</v-btn>
				</v-card-actions>

			</v-card>
		</v-dialog>
	</div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';
import moment from 'moment';
import { Residencia } from '@/interfaces/residencia.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import { Credito } from '@/interfaces/credito.interface';
import { Adquisicion, AdquisicionParaCrear, AdquisicionParaModificar } from '@/interfaces/adquisicion.interface';
import { requerido } from '@/helpers/validadores/requerido';
import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
import { numeroNoMenorQue } from '@/helpers/validadores/numero-no-menor-que';
import { TipoDeAdquisicion } from '@/enums/tipoDeAdquisicion.enum';

@Component
export default class Publicacion extends Vue {

	// Variables para manejar el formulario ---------------------------------
	public formularioDeOferta: boolean = false;
	public montoDeOferta: number = 0;

	public validadores = {
		montoDeOferta: [
			requerido( 'Monto de oferta' ),
			numeroNoNegativo( 'Monto de oferta' ),
			numeroNoMenorQue( 'Monto de oferta', (this.ofertaMaxima) )
		]
	};

	public modeloDeAdquisicion: AdquisicionParaCrear = {
		idCliente: '',
		idPublicacion: '',
		monto: 0,
		fechaDeCreacion: '',
		tipoDeAdquisicion: TipoDeAdquisicion.Subasta,
	};

	public modeloParaModificar: AdquisicionParaModificar = {
		monto: 0,
	};
	// ----------------------------------------------------------------------

	public get publicacion( ) {
		return this.$store.getters.publicacionConId(this.idPublicacion);
	}

	public get residencia( ): Residencia | undefined {
		return this.obtenerResidenciaConId(this.publicacion.idResidencia);
	}

	public get esUnaSubastaActiva( ) {
		// 1° No esta cerrada
		const noCerroSubasta: boolean = !(this.publicacion.cerroSubasta);

		// 2° Me fijo el intervalo de fechas de una subasta
		const dias: number = 3;
		const meses: number = 6;

		const comienzoDeSubasta = moment(this.publicacion.fechaDeInicioDeSemana).subtract(meses, 'M');
		const finDeSubasta = moment(this.publicacion.fechaDeInicioDeSemana).subtract(meses, 'M').add(dias, 'days');

		const fechaDeSubastaValida = moment( moment( ) ).isBetween(comienzoDeSubasta, finDeSubasta);

		// 3° No hay ganador, pero supongo que si hay ganador no esta cerrada
		// ?????

		return noCerroSubasta && fechaDeSubastaValida;
	}

	public get fotos( ) {
		if (this.residencia !== undefined) {
			return this.residencia.fotos;
		}
	}

	@Prop({ default: undefined })
	public idPublicacion!: string;

	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Monto de oferta',
			value: 'monto',
			align: 'right'
		},
		{
			text: 'Día que se oferto',
			value: 'fechaDeCreacion',
			align: 'right'
		},
	];

	public created( ) {
		this.$store.dispatch( 'obtenerResidencias' );
		this.$store.dispatch( 'obtenerPublicaciones' );
		this.$store.dispatch( 'obtenerAdquisiciones' );
	}

	public obtenerResidenciaConId( idResidencia: String ): Residencia | undefined {
		return this.$store.getters.residenciaConId( idResidencia );
	}

	public generarRutaDeResidencia( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}

	public async ofertar( idPublicacion: string ) {
		const perfilValido = (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null );
		if (perfilValido && this.$store.getters.perfil.creditos.length > 0) {
			if ( this.$store.getters.perfil.tarjetaDeCredito !== '9999999999999999' ) {
				const creditos: Credito[ ] = this.$store.getters.perfil.creditos;
				const cantidadDeCreditosVigentes: number = creditos.filter( (_credito) => {
					const expiracion: boolean = moment( moment(_credito.fechaDeCreacion).add(1, 'years') ).isAfter( moment() );
					return _credito.activo && expiracion;
				}).length;

				if (cantidadDeCreditosVigentes > 0) {
					// Pido un monto para crear la adquisicion, si es menor al maximo no hago nada
					// Tengo que sacar el credito más viejo
					// Tengo que modificar el perfil luego de gastar el credito
					// Tengo que crear la adquisicion con el monto nuevo

					this.formularioDeOferta = true;
				} else {
					await this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'error',
						texto: 'No posee créditos suficientes para realizar esta acción'
					});
				}
			} else {
				await this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'error',
						texto: 'La tarjeta de crédito es invalida'
					});
			}
		} else {
			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: 'Debe iniciar sesión para poder particiar en la subasta'
			});
		}
	}

	public async cancelarOferta( idPublicacion: string ) {
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
		const ofertasDeClietneEnLaPublicacion = adquisiciones.filter( ( adquisicion ) => {
			const igualPublicacion = adquisicion.idPublicacion === idPublicacion;
			const igualPerfil = adquisicion.idCliente === this.$store.getters.perfil._id;
			const esOferta = adquisicion.tipoDeAdquisicion === TipoDeAdquisicion.Subasta;
			return igualPublicacion && igualPerfil && esOferta;
		});

		await this.$store.dispatch( 'eliminarAdquisicion', ofertasDeClietneEnLaPublicacion[0]._id );

		await this.$store.dispatch( 'mostrarAlerta', {
			tipo: 'success',
			texto: 'Se retiro la oferta de la subasta'
		});
	}

	public get adquisiciones( ) {
		return this.$store.getters.adquisiciones;
	}

	public get adquisicionesDePerfil( ): Adquisicion[ ] {
		const perfilValido = (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null);

		if (perfilValido) {
			const adquisiciones: Adquisicion[ ] = this.adquisiciones;

			const adquisicionesDelPerfil = adquisiciones.filter( (adquisicion) => {

				const igualPublicacion: boolean = (adquisicion.idPublicacion === this.idPublicacion);
				const igualCliente: boolean = (adquisicion.idCliente === this.$store.getters.perfil._id);

				return (igualPublicacion && igualCliente);
			});

			return adquisicionesDelPerfil;

		} else {
			const arregloDeAdquisicionesVacio: Adquisicion[ ] = [ ];
			return arregloDeAdquisicionesVacio;
		}
	}

	public get ofertaMaxima( ): number {
		// Junto todas las adquisiciones
		const adquisiciones: Adquisicion[ ] = this.adquisiciones;

		// Junto todas las adquisiciones que referencian a esta publicacion
		const adquisicionesDeSubasta = adquisiciones.filter( (adquisicion) => {
			return adquisicion.idPublicacion === this.idPublicacion;
		});

		// Junto todas las ofertas de esta publicacion
		const ofertasDeSubasta = adquisicionesDeSubasta.filter( (adquisicion) => {
			return adquisicion.tipoDeAdquisicion === 'subasta';
		});

		// Pregunto si hay adquisiciones
		if (ofertasDeSubasta.length > 0) {
			const maximo = ofertasDeSubasta
				.sort( ( a, b ) => {
					if ( moment(a.monto) > moment(b.monto) ) {
						return -1;
					}
					else if ( moment(a.monto) < moment(b.monto) ) {
						return +1;
					}
					else {
						return 0;
					}
				});
			return maximo[0].monto;
		} else {
			return this.publicacion.montoInicialDeSubasta;
		}
	}

	public get adquisicionesDePublicacion( ): Adquisicion[ ] {
		const adquisicionesDePublicacion: Adquisicion[ ] = this.$store.getters.adquisiciones;

		return adquisicionesDePublicacion.filter( (adquisicion) => {
			const igualPublicacion: boolean = adquisicion.idPublicacion === this.idPublicacion;
			const esSubasta: boolean = adquisicion.tipoDeAdquisicion === TipoDeAdquisicion.Subasta;
			return igualPublicacion && esSubasta;
		});
	}

	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}

	public noHayOfertasDelCliente( idPublicacion: string ): boolean {
		const perfilValido = (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null );
		if (perfilValido) {
			const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
			const ofertasDeClietneEnLaPublicacion = adquisiciones.filter( ( adquisicion ) => {
				const igualPublicacion = adquisicion.idPublicacion === idPublicacion;
				const igualPerfil = adquisicion.idCliente === this.$store.getters.perfil._id;
				return igualPublicacion && igualPerfil;
			});

			if (ofertasDeClietneEnLaPublicacion.length > 0 ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public ofertaDelCliente( idPublicacion: string ): number {
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
		const ofertasDeClietneEnLaPublicacion = adquisiciones.filter( ( adquisicion ) => {
			const igualPublicacion = adquisicion.idPublicacion === idPublicacion;
			const igualPerfil = adquisicion.idCliente === this.$store.getters.perfil._id;
			return igualPublicacion && igualPerfil;
		});

		if (ofertasDeClietneEnLaPublicacion.length > 0 ) {
			return ofertasDeClietneEnLaPublicacion[0].monto;
		} else {
			return 0;
		}
	}

	/*
	* +-----------------------------------------------------------------+
	* |	Desde aca va todo lo relacionado con el formulario de ofertar	|
	* +-----------------------------------------------------------------+
	*/

	public extraerNumero( texto: string, predeterminado: number ): number {
		const valorNumerico: number = Number.parseFloat( texto );

		return ( isNaN( valorNumerico ) )
			? predeterminado
			: valorNumerico;
	}

	public cancelarCarga( ): void {
		this.restablecerFormulario( );
	}

	public restablecerFormulario( ): void {
		this.montoDeOferta = 0;
		this.formularioDeOferta = false;
	}

	public async realizarOferta( ) {
		// Creo la adquisicion cargando los datos del modelo
		this.modeloDeAdquisicion.idCliente = this.$store.getters.perfil._id;
		this.modeloDeAdquisicion.idPublicacion = this.idPublicacion;
		this.modeloDeAdquisicion.monto = this.montoDeOferta;
		this.modeloDeAdquisicion.fechaDeCreacion = moment( moment() ).utc().toISOString();
		// this.modeloDeAdquisicion.tipoDeAdquisicion no es necesario el tipo, ya que esta en el modelo

		// Me fijo si ya había ofertado anteriormente, en caso de que si busco la adquisicion y la modifico
		if (this.adquisicionesDePerfil.length > 0) {
			// Hay ofertas, modifico la nueva
			this.modeloParaModificar.monto = this.montoDeOferta;

			await this.$store.dispatch( 'modificarAdquisicion', {
				_id: this.adquisicionesDePerfil[0]._id,
				adquisicionParaModificar: this.modeloParaModificar,
			});
		} else {
			// No hay ofertas, cargo una nueva
			await this.$store.dispatch( 'crearAdquisicion', this.modeloDeAdquisicion );
		}

		// Para terminar oculto el formulario
		this.formularioDeOferta = false;
		// Vuelvo a tener las adquisiciones
		this.$store.dispatch( 'obtenerAdquisiciones' );
	}
}
</script>