<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Modificar Info de Cliente</h5>
		</v-card-title>
		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.nombre"
					label="Nombre/s"
					:rules="validadores.nombre"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.apellido"
					label="Apellido/s"
					:rules="validadores.apellido"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.email"
					label="Email"
					:rules="validadores.correoElectronico"
					hint="ejemplo@ejemplo.com"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.celular"
					label="Celular"
					counter="11"
					hint="Cod.Area + Número "
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.pais"
					label="País"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.tarjetaDeCredito"
					label="Nro. tarjeta de crédito"
					:rules="validadores.tarjetaDeCredito"
					counter="16"
					hint="Los guiones se insertan automáticamente"
					mask="credit-card"
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

@Component
export default class ModificacionDeDatosDeCliente extends Vue {
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

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		nombre: [
			requerido( 'Nombre' ),
			textoNoVacio( 'Nombre' ),
		],
		apellido: [
			requerido( 'Apellido' ),
			textoNoVacio( 'Apellido' ),
		],
		correoElectronico: [
			requerido( 'Email' ),
			textoNoVacio( 'Email' ),
			correoElectronico( 'Email' )
		],
		tarjetaDeCredito: [
			requerido( 'Tarjeta de crédito' ),
			textoNoVacio( 'Tarjeta de crédito'),
			tarjetaDeCredito( 'Tarjeta de crédito' )
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
	public async modificarSubasta( ): Promise<void> {
		this.esperandoModificacionDeInfo = true;
		await this.$store.dispatch( 'modificarClienteLoggedIn', {
			idCliente: this.cliente._id,
			clienteParaModificar: this.modelo,
		});
		this.esperandoModificacionDeInfo = false;
		this.restablecerFormulario( );
		this.emitirEventoInfoModificada( );
	}

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.modelo.nombre           	= this.cliente.nombre;
		this.modelo.apellido          	= this.cliente.apellido;
		this.modelo.email           	= this.cliente.email;
		this.modelo.celular             = this.cliente.celular;
		this.modelo.pais             	= this.cliente.pais;
		this.modelo.tarjetaDeCredito    = this.cliente.tarjetaDeCredito;
		this.formularioEsValido = false;
	}
}
</script>

