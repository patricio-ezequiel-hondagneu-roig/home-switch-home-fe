<template>
	<v-card
		v-if="cliente !== null"
		class="pa-3"
	>
		Precio actual de un <span style="font-weight:bold">Crédito</span>
		$ {{ (this.creditoActual)? this.creditoActual.monto : 'No se cargo ningun precio para los creditos' }}
		<br>
		<v-card-title>
			<h5 class="headline">Ingrese la cantidad de créditos que deseé comprar</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					:value="cantidad"
					@input="cantidad = extraerNumero( $event, cantidad )"
					label="Cantidad de creditos"
					:rules="validadores.cantidad"
					hint="No puede ser negativo"
					required
				></v-text-field>
			</v-form>
		</v-card-text>

		Total: $ {{ this.calcularTotal( cantidad ) }}

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarCarga( )">
				Cancelar
			</v-btn>
			<v-btn
				class="success"
				:loading="esperandoModificacionDeInfo"
				:disabled="!formularioEsValido"
				@click.stop="agregarCreditos( )"
			>
				Comprar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { requerido } from '@/helpers/validadores/requerido';
import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { CreditoBD } from '@/interfaces/creditoBD.interface';
import { Cliente, ClienteParaModificar } from '../interfaces/cliente.interface';
import moment from 'moment';

@Component
export default class CompraDeCreditos extends Vue {

	public get creditoActual( ): CreditoBD | undefined {
		return this.$store.getters.obtenerCreditoActual;
	}
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	@Prop( )
	public readonly cliente!: Cliente;

	public modelo: ClienteParaModificar = {
		idSuscripcion: this.cliente.idSuscripcion ,
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

	public esperandoModificacionDeInfo: boolean = false;

	public cantidad: number = 0;

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		cantidad: [
			requerido( 'Cantidad de creditos' ),
			numeroNoNegativo( 'Cantidad de creditos' )
		]
	};

	public created( ) {
		this.obtenerCreditos();
	}

	public async obtenerCreditos( ): Promise<void> {
		await this.$store.dispatch( 'obtenerCreditos' );
	}

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

	/**
	 * Emite el evento _infoModificada_.
	 */
	@Emit( 'infoModificada' )
	public emitirEventoInfoModificada( ): void { }

	/**
	 * Emite el evento _cancelacion_.
	 */
	@Emit( 'cancelacion' )
	public emitirEventoCancelacion( ): void { }

	/**
	 * Emite el evento _creditoCreado_.
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

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.cantidad = 0;

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

	public calcularTotal( cantidad: number): number {
		const precioDeCredito = this.$store.getters.obtenerCreditoActual;
		if ( precioDeCredito !== undefined ) {
			return precioDeCredito.monto * cantidad;
		} else {
			return 0;
		}
	}

	public async agregarCreditos( ) {
		this.esperandoModificacionDeInfo = true;

		// 1° - Agregar créditos al perfil actual
		// For 1 to Cantidad
		// | Agrego un crédito al perfil

		let i: number = 0;
		for (; i < this.cantidad; i++) {
			this.$store.getters.perfil.creditos.push({
				fechaDeCreacion: moment().utc().toISOString(),
				activo: true
			});
		}

		// 2° - A partir del perfil actualizado, modifico el cliente que referencia el perfil._id
		// Obtengo el cliente y lo modifico con el perfil actual, asi le actualizo los nuevos créditos

		await this.$store.dispatch( 'modificarPerfil', {
			idCliente: this.cliente._id,
			clienteParaModificar: this.modelo,
		});

		this.esperandoModificacionDeInfo = false;
		this.restablecerFormulario( );
		this.emitirEventoInfoModificada( );
	}
}
</script>
