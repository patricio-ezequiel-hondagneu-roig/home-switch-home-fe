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
					<v-flex text-xs-right>
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
					:items="arregloVacio"
					class="elevation-1"
				>
					<template v-slot:items="props">
							<td> {{ props.item }} </td>
					</template>
				</v-data-table>
				<br>


			</v-card>

		</div>

		<!-- Contenido a mostrar si la subasta cerro -->
		<div v-else>
			La publicación en cuestión no se puede visualizar en este momento.
		</div>
	</div>
</template>


<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator';
	import VueRouter, { Route } from 'vue-router';
	import moment from 'moment';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { Credito } from '@/interfaces/credito.interface';
	import { Adquisicion } from '@/interfaces/adquisicion.interface';

	@Component
	export default class Publicacion extends Vue {

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

		public arregloVacio: number[ ] = [ ];

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
			const perfilValido = (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null);
			if (perfilValido && this.$store.getters.perfil.creditos.length > 0) {

				const creditos: Credito[ ] = this.$store.getters.perfil.creditos;
				const cantidadDeCreditosVigentes: number = creditos.filter( (_credito) => {
					const expiracion: boolean = moment( moment(_credito.fechaDeCreacion).add(1, 'years') ).isAfter( moment() );
					return _credito.activo && expiracion;
				}).length;

				if (cantidadDeCreditosVigentes > 0) {
					await this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'success',
						texto: 'Hay creditos suficientes, falta hacer la lógica xddd'
					});

					// Pido un monto para crear la adquisicion, si es menor al maximo no hago nada
					// Tengo que sacar el credito más viejo
					// Tengo que modificar el perfil luego de gastar el credito
					// Tengo que crear la adquisicion con el monto nuevo

				} else {
					await this.$store.dispatch( 'mostrarAlerta', {
						tipo: 'error',
						texto: 'No posee créditos suficientes para realizar esta acción'
					});
				}
			} else {
				await this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: 'Debe iniciar sesión para poder particiar en la subasta'
				});
			}
		}

		public get adquisiciones( ) {
			return this.$store.getters.adquisiciones;
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
						if ( moment(a.fechaDeCreacion) > moment(b.fechaDeCreacion) ) {
							return -1;
						}
						else if ( moment(a.fechaDeCreacion) < moment(b.fechaDeCreacion) ) {
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
	}
</script>