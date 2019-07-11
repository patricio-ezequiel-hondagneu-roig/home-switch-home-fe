<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Modificar precio del crédito</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					:value="modelo.monto"
					@input="modelo.monto = extraerNumero( $event, modelo.monto )"
					label="Monto nuevo a cobrar para los créditos"
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
				:loading="esperandoCreacionDeCredito"
				:disabled="!formularioEsValido"
				@click.stop="crearCredito( )"
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
	import { CreditoBD } from '../interfaces/creditoBD.interface';
	import * as moment from 'moment';

	@Component
	export default class CargaDeCredito extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		public esperandoCreacionDeCredito: boolean = false;

		public modelo: CreditoBD = {
			fechaDeCreacion: '',
			monto: 0,
		};

		public validadores = {
			fechaDeCreacion: [
				requerido( 'Fecha de creacion' ),
				textoNoVacio( 'Fecha de creacion' )
			],
			monto: [
				requerido( 'Monto de credito' ),
				numeroNoNegativo( 'Monto de credito' )
			]
		};

		public beforeMount( ): void {
			this.restablecerFormulario( );
		}

		public beforeUpdate( ): void {
			if ( this.formulario === null ) {
				this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
			}
		}

		/**
		 * Emite el evento _cancelacion_.
		 */
		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		/**
		 * Emite el evento _creditoCreada_.
		 */
		@Emit( 'creditoCreado' )
		public emitirEventoCreditoCreado( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}


		public async crearCredito( ): Promise<void> {
			this.esperandoCreacionDeCredito = true;

			this.modelo.fechaDeCreacion = moment.utc().toISOString();
			await this.$store.dispatch( 'crearCredito', this.modelo );

			this.esperandoCreacionDeCredito = false;

			this.restablecerFormulario( );
			this.emitirEventoCreditoCreado( );
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.fechaDeCreacion = '';
			this.modelo.monto = 0;

			this.formularioEsValido = false;
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
