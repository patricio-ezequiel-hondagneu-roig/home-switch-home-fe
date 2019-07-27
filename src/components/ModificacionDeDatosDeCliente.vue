<template>
	<v-card
	v-if="cliente !== null"
	class="pa-3"
	>
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
					v-model="modelo.fechaDeNacimiento"
					label="Fecha de nacimiento"
					:rules="validadores.fechaDeNacimiento"
					hint="DD/MM/YYYY"
					type="date"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.pais"
					label="País"
					:rules="validadores.pais"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.celular"
					label="Celular"
					:rules="validadores.celular"
					hint="Cod.Area + Número "
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.email"
					label="Email"
					:rules="validadores.correoElectronico"
					hint="ejemplo@ejemplo.com"
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
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { Cliente, ClienteParaModificar } from '../interfaces/cliente.interface';
import moment from 'moment';
import { mayorDeDieciocho } from '../helpers/validadores/mayor-de-dieciocho';

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
		fechaDeNacimiento: this.formatearFecha(this.cliente.fechaDeNacimiento) ,
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
		celular: [
			requerido( 'Celular' ),
			textoNoVacio( 'Celular'),
		],
		pais: [
			requerido( 'País' ),
			textoNoVacio( 'País'),
		],
		fechaDeNacimiento: [
			requerido( 'Fecha de nacimiento' ),
			mayorDeDieciocho( 'Fecha de nacimiento'),
		],
	};

	/**
	 * Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM.
	 */
	public beforeMount( ) {
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

		this.esperandoModificacionDeInfo = true;

		// Transformo las fecha de nacimiento con moment js
		this.modelo.fechaDeNacimiento = moment(this.modelo.fechaDeNacimiento).utc().toISOString();

		await this.$store.dispatch( 'modificarPerfil', {
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
		this.modelo.fechaDeNacimiento   = this.formatearFecha(this.cliente.fechaDeNacimiento);
		this.formularioEsValido = false;
	}

	// modificar fecha para mostrarla

	public formatearFecha(fecha: string): string {
		return moment(fecha).format('YYYY-MM-DD');
	}
}
</script>

