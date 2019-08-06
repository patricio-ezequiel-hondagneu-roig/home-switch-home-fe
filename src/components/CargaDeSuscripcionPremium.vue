<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Modificar precio de suscripcion Premium</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.tipoDeSuscripcion"
					label="Tipo de suscripcion"
					:rules="validadores.tipoDeSuscripcion"
					required
					readonly
				></v-text-field>

				<v-text-field
					:value="modelo.monto"
					@input="modelo.monto = extraerNumero( $event, modelo.monto )"
					label="Monto nuevo a cobrar para la suscripcion premium"
					:rules="validadores.monto"
					hint="El monto no puede ser negativo"
					prefix="$"
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
				class="success"
				:loading="esperandoCreacionDeSuscripcionPremium"
				:disabled="!formularioEsValido"
				@click.stop="crearSuscripcionPremium( )"
			>
				Cargar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit } from 'vue-property-decorator';
	import { requerido } from '@/helpers/validadores/requerido';
	import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
	import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
	import router from '@/router';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { server } from '@/utils/helper';
	import { SuscripcionParaCrear, Suscripcion } from '../interfaces/suscripcion.interface';
	import * as moment from 'moment';

	@Component
	export default class CargaDeSuscripcion extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		/**
		 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de suscripcion
		 */
		public esperandoCreacionDeSuscripcionPremium: boolean = false;

		/**
		 * Objeto que almacena el estado de la suscripcion para crear de acuerdo al estado del formulario.
		 */
		public modelo: SuscripcionParaCrear = {
			tipoDeSuscripcion: '',
			fechaDeCreacion: '',
			monto: this.$store.getters.obtenerSuscripcionPremium.monto || 0,
		};

		/**
		 * Conjunto de reglas de validación para cada campo del formulario de carga.
		 */
		public validadores = {
			tipoDeSuscripcion: [
				requerido( 'Tipo de suscripcion' ),
				textoNoVacio( 'Tipo de suscripcion' )
			],
			fechaDeCreacion: [
				requerido( 'Fecha de creacion' ),
				textoNoVacio( 'Fecha de creacion' )
			],
			monto: [
				requerido( 'Monto de suscripcion' ),
				numeroNoNegativo( 'Monto de suscripcion' )
			]
		};

		/**
		 * Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM.
		 */
		public beforeMount( ): void {
			this.restablecerFormulario( );
		}

		/**
		 * Hook de ciclo de vida. Guarda la referencia al formulario de carga.
		 */
		public beforeUpdate( ): void {
			if ( this.formulario === null ) {
				this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
			}
		}

		public created( ): void {
			this.$store.dispatch( 'obtenerSuscripciones' );
		}

		/**
		 * Emite el evento _cancelacion_.
		 */
		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		/**
		 * Emite el evento _suscripcionCreada_.
		 */
		@Emit( 'suscripcionCreada' )
		public emitirEventoSuscripcionCreada( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		/**
		 * Solicita la creación de una suscripcion de acuerdo al estado actual del modelo.
		 *
		 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _suscripcionCreada_.
		 */
		public async crearSuscripcionPremium( ): Promise<void> {
			this.esperandoCreacionDeSuscripcionPremium = true;
			this.modelo.fechaDeCreacion = moment.utc().toISOString();
			await this.$store.dispatch( 'crearSuscripcion', this.modelo );
			this.esperandoCreacionDeSuscripcionPremium = false;

			this.restablecerFormulario( );
			this.emitirEventoSuscripcionCreada( );

			this.formularioEsValido = true;
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.tipoDeSuscripcion = 'Premium';
			this.modelo.fechaDeCreacion = '';
			this.modelo.monto = this.$store.getters.obtenerSuscripcionPremium.monto || 0;
		}

		/**
		 * Dada una cadena de texto y un número predeterminado, si la cadena de texto representa un número retorna ese
		 * número, en caso contrario retorna el número predeterminado.
		 *
		 * @param texto cadena de texto de la cual extraer su valor numérico
		 * @param predeterminado valor numérico a retornar en caso de que la cadena de texto no represente un número
		 */
		public extraerNumero( texto: string, predeterminado: number ): number {
			const valorNumerico: number = Number.parseFloat( texto );

			return ( isNaN( valorNumerico ) )
				? predeterminado
				: valorNumerico;
		}
	}
</script>
