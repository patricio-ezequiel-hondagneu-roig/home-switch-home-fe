<template>
	<v-card
	v-if="cliente !== null"
	class="pa-3"
	>
		<v-card-title>
			<h5 class="headline">Modificar tarjeta de crédito</h5>
		</v-card-title>
		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.tarjetaDeCredito"
					label="Nro. tarjeta de crédito"
					:rules="validadores.tarjetaDeCredito"
					counter="16"
					hint="Los guiones se insertan automáticamente"
					mask="credit-card"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.codigoDeSeguridad"
					label="Cod. de seguridad"
					:rules="validadores.codigoDeSeguridad"
					counter="4"
					hint="4 digitos"
					mask="####"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.fechaDeExpiracion"
					label="Fecha de expiración"
					:rules="validadores.fechaDeExpiracion"
					hint="MM/AAAA"
					type="month"
					required
				></v-text-field>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarModificacion( )">
				Cancelar
			</v-btn>
			<v-btn
				class="success"
				:loading="esperandoModificacionDeInfo"
				:disabled="!formularioEsValido"
				@click.stop="modificarInfo( )"
			>
				Modificar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script lang="ts">
import axios from 'axios';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { requerido } from '@/helpers/validadores/requerido';
import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
import { correoElectronico } from '@/helpers/validadores/correo-electronico';
import { tarjetaDeCredito } from '@/helpers/validadores/tarjeta-de-credito';
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { Cliente, ClienteParaModificar } from '../interfaces/cliente.interface';
import moment from 'moment';
import { cuatroCaracteres } from '@/helpers/validadores/cuatro-caracteres';
import { codigoDeSeguridad } from '@/helpers/validadores/codigo-de-seguridad';

@Component
export default class ModificarDeTarjetaDeCreditoDeCliente extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;
	/**
	 * Datos de cliente para modificar.
	 */
	@Prop( )
	public readonly cliente!: Cliente;

	/**
	 * Flag que se activa mientras se espera la respuesta a una solicitud de modificación de cliente.
	 */
	public esperandoModificacionDeInfo: boolean = false;

	/**
	 * Objeto que almacena el estado del cliente para modificar de acuerdo al estado del formulario.
	 */
	public modelo: ClienteParaModificar = {
		idSuscripcion: this.cliente.idSuscripcion,
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

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		tarjetaDeCredito: [
			requerido( 'Tarjeta de crédito' ),
			textoNoVacio( 'Tarjeta de crédito'),
			tarjetaDeCredito( 'Tarjeta de crédito' )
		],
		codigoDeSeguridad: [
			requerido( 'Codigo de seguridad' ),
			textoNoVacio( 'Codigo de seguridad'),
			cuatroCaracteres( 'Codigo de seguridad' ),
		],
		fechaDeExpiracion: [
			requerido( 'Fecha de expiración' ),
			textoNoVacio( 'Fecha de expiración'),
			codigoDeSeguridad( 'Fecha de expiración' )
		],
	};

	/**
	 * Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM.
	 */
	public beforeMount( ): void {
		this.restablecerFormulario( );
	}

	/**
	 * Hook de ciclo de vida. Guarda la referencia al formulario de modificación.
	 */
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
	 * Emite el evento _infoModificada_.
	 */
	@Emit( 'infoModificada' )
	public emitirEventoInfoModificada( ): void { }

	/**
	 * Restablece el formulario y emite el evento _cancelacion_.
	 */
	public cancelarModificacion( ): void {
		this.restablecerFormulario( );
		this.emitirEventoCancelacion( );
	}

	/**
	 * Solicita la modificación de una subasta de acuerdo al estado actual del modelo.
	 *
	 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _subastaModificada_.
	 */
	public async modificarInfo( ): Promise<void> {

		const tarjetaInvalida = '2222222222222222';

		if (this.modelo.tarjetaDeCredito === tarjetaInvalida) {

			// Escenario de tarjeta no valida
			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: 'La tarjeta no es válida.'
			});

		} else {

			this.esperandoModificacionDeInfo = true;

			// Transformo las fecha de expiracion con moment js
			this.modelo.fechaDeExpiracion = moment(this.modelo.fechaDeExpiracion).utc().toISOString();

			await this.$store.dispatch( 'modificarPerfil', {
				idCliente: this.cliente._id,
				clienteParaModificar: this.modelo,
			});
			this.esperandoModificacionDeInfo = false;
			this.restablecerFormulario( );
			this.emitirEventoInfoModificada( );
			this.formularioEsValido = true;
		}
	}

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}
		this.modelo.tarjetaDeCredito    = this.cliente.tarjetaDeCredito;
		this.modelo.codigoDeSeguridad    = this.cliente.codigoDeSeguridad;
		this.modelo.fechaDeExpiracion    = this.formatearFecha(this.cliente.fechaDeExpiracion);
	}
	// modificar fecha para mostrarla
	public formatearFecha(fecha: string): string {
		return moment(fecha).format('YYYY-MM');
	}
}
</script>
