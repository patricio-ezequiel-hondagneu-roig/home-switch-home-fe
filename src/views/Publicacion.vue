<template>
	<!-- Pregunta si la publicacion no es null, solucionando el problema de renderizado -->
	<div v-if="publicacion !== null">

		<!-- Contenido a mostrar si la subasta no cerro -->
		<div style="max-width: 800px; margin: auto;">

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
					Precio minimo de oferta: ${{ this.mayorMontoOfertado }}
					<br>

					<br>
					<v-flex text-xs-right>
						<!-- Boton para cancelar la oferta si es que el cliente posee ofertas en la publicacion -->
						<v-btn
							color="#ed9702"
							large
							@click.stop="mostrarFormularioParaOfertar( )"
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


				<br>
			</v-card>

		</div>

		<!-- Formulario de oferta -->
		<v-dialog persistent v-model="formularioDeOferta" max-width="40rem" v-if="perfilValido">
			<Ofertar
				@ofertaCreada="ocultarFormularioParaOfertar( )"
				@cancelacion="ocultarFormularioParaOfertar( )"
				:idCliente="this.$store.getters.perfil._id"
				:idPublicacion="this.idPublicacion"
			/>
		</v-dialog>
	</div>
</template>


<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator';
	import VueRouter, { Route } from 'vue-router';
	import moment from 'moment';
	import { Residencia } from '@/interfaces/residencia.interface';
	import Ofertar from '@/components/Ofertar.vue';
	import { Oferta } from '@/interfaces/oferta.interface';

	@Component({
		components: {
			Ofertar,
		},
	})
	export default class Publicacion extends Vue {

		@Prop({ default: undefined })
		public idPublicacion!: string;

		public formularioDeOferta: boolean = false;

		public mostrarFormularioParaOfertar( ): void {
			if (this.perfilValido) {
				this.formularioDeOferta = true;
			} else {
				this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: 'Debe iniciar sesión para poder particiar en una subasta'
				});
			}
		}

		public ocultarFormularioParaOfertar( ): void {
			this.formularioDeOferta = false;
		}

		public get publicacion( ) {
			return this.$store.getters.publicacionConId(this.idPublicacion);
		}

		public get residencia( ): Residencia | undefined {
			return this.obtenerResidenciaConId(this.publicacion.idResidencia);
		}

		public get perfilValido( ): boolean {
			return (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null );
		}

		public get fotos( ) {
			if (this.residencia !== undefined) {
				return this.residencia.fotos;
			}
		}

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

		public formatearFecha(fecha: string): string {
			return moment(fecha).format('DD/MM/YYYY');
		}

		public get mayorMontoOfertado( ): number {
			const ofertas: Oferta[ ] = this.$store.getters.ofertas;
			const ofertasDePublicacion = ofertas.filter( (oferta) => {
				return oferta.idPublicacion === this.idPublicacion;
			});

			if (ofertasDePublicacion.length > 0) {
				const maximo = ofertasDePublicacion.sort( ( a, b ) => {
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
				return	this.$store.getters.publicacionConId( this.idPublicacion ).montoInicialDeSubasta;
			}
		}

	}
</script>