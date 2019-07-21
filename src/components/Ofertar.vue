<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Ofertar</h5>
		</v-card-title>

		<v-card-title>
			<h5 class="subheading">El monto a ofertar tiene que ser mayor a ${{ this.mayorMontoOfertado }}</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
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
				:loading="esperandoCreacionDeOferta"
				:disabled="!formularioEsValido"
				@click.stop="ofertar( )"
			>
				Cargar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import router from '@/router';
	import { server } from '@/utils/helper';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { OfertaParaCrear, OfertaParaModificar, Oferta } from '@/interfaces/oferta.interface';
	import { requerido } from '@/helpers/validadores/requerido';
	import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
	import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
	import { numeroNoMenorQue } from '@/helpers/validadores/numero-no-menor-que';
	import moment from 'moment';

	@Component
	export default class Ofertar extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;
		public esperandoCreacionDeOferta: boolean = false;

		public montoDeOferta: number = 0;

		public modelo: OfertaParaCrear = {
			idCliente: '',
			idPublicacion: '',
			monto: 0,
			fechaDeCreacion: '',
		};

		public validadores = {
			montoDeOferta: [
				requerido( 'Monto de oferta' ),
				numeroNoNegativo( 'Monto de oferta' ),
				numeroNoMenorQue( 'Monto de oferta', (this.mayorMontoOfertado) )
			]
		};

		public modeloParaModificar: OfertaParaModificar = {
			monto: 0,
		};

		@Prop( )
		public readonly idCliente!: string;

		@Prop( )
		public readonly idPublicacion!: string;

		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		@Emit( 'ofertaCreada' )
		public emitirEventoOfertaCreada( ): void { }

		public beforeMount( ): void {
			this.restablecerFormulario( );
		}

		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.idCliente = '';
			this.modelo.idPublicacion = '';
			this.modelo.monto = 0;
			this.modelo.fechaDeCreacion = '';
			this.montoDeOferta = 0;

			this.formularioEsValido = false;
		}

		public created( ): void {
			this.$store.dispatch( 'obtenerOfertas' );
			this.$store.dispatch( 'obtenerClientes' );
			this.$store.dispatch( 'obtenerPublicaciones' );
		}

		public extraerNumero( texto: string, predeterminado: number ): number {
			const valorNumerico: number = Number.parseFloat( texto );

			return ( isNaN( valorNumerico ) )
				? predeterminado
				: valorNumerico;
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

		public get perfilValido( ): boolean {
			return (this.$store.getters.perfil !== undefined && this.$store.getters.perfil !== null );
		}

		public get obtenerOfertasDeLaSubasta( ): Oferta[ ] {
			const ofertas: Oferta[ ] = this.$store.getters.ofertas;
			const ofertasDeSubasta = ofertas.filter( (oferta) => {
				return oferta.idPublicacion === this.idPublicacion;
			});
			return ofertasDeSubasta;
		}

		public get hayOfertaDeCliente( ): boolean {
			if (this.perfilValido) {
				const ofertaDelCliente = this.obtenerOfertasDeLaSubasta.filter( (oferta) => {
					return oferta.idCliente === this.$store.getters.perfil._id;
				});

				if (ofertaDelCliente.length > 0) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		public get ofertasDelPerfil( ): Oferta[ ] {
			if (this.perfilValido) {
				const ofertas: Oferta[ ] = this.$store.getters.ofertas;

				const ofertasDelPerfil = ofertas.filter( (oferta) => {

					const igualPublicacion: boolean = (oferta.idPublicacion === this.idPublicacion);
					const igualCliente: boolean = (oferta.idCliente === this.$store.getters.perfil._id);

					return (igualPublicacion && igualCliente);
				});

				return ofertasDelPerfil;

			} else {
				const arregloDeOfertasVacio: Oferta[ ] = [ ];
				return arregloDeOfertasVacio;
			}
		}

		public async ofertar( ): Promise<void> {
			if (this.ofertasDelPerfil.length > 0) {
				// Si el cliente ya oferto, modifico su oferta por un nuevo monto.
				this.esperandoCreacionDeOferta = true;

				this.modeloParaModificar.monto = this.montoDeOferta;

				// Hay ofertas, modifico la que ya existe
				this.modeloParaModificar.monto = this.montoDeOferta;

				await this.$store.dispatch( 'modificarOferta', {
					_id: this.ofertasDelPerfil[0]._id,
					ofertaParaModificar: this.modeloParaModificar,
				});

				this.esperandoCreacionDeOferta = false;

				this.restablecerFormulario( );
				this.emitirEventoOfertaCreada( );
			} else {
				// Si el cliente nunca oferto, creo una nueva oferta.
				this.esperandoCreacionDeOferta = true;

				this.modelo.idCliente = this.idCliente;
				this.modelo.idPublicacion = this.idPublicacion;
				this.modelo.monto = this.montoDeOferta;
				this.modelo.fechaDeCreacion = moment().utc().toISOString();

				await this.$store.dispatch( 'crearOferta', this.modelo );
				this.$store.dispatch( 'obtenerOfertas' );

				this.esperandoCreacionDeOferta = false;

				this.restablecerFormulario( );
				this.emitirEventoOfertaCreada( );
			}
		}
	}
</script>