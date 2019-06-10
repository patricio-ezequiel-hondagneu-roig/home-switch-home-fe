<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Crear una cuenta</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.nombre"
					label="Nombre"
					:rules="validadores.nombre"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.apellido"
					label="Apellido"
					:rules="validadores.apellido"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.contraseña"
					label="Contraseña"
					:rules="validadores.contraseña"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeNacimiento"
					label="Fecha de Nacimiento"
					:rules="validadores.fechaDeNacimiento"
					required
					type="date"
				></v-text-field>

				<v-text-field
					v-model="modelo.celular"
					label="Celular"
					:rules="validadores.celular"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.ciudad"
					label="Ciudad"
					:rules="validadores.ciudad"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.email"
					label="Email"
					:rules="validadores.email"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.tarjetaDeCredito"
					label="Tarjeta de Crédito"
					:rules="validadores.tarjetaDeCredito"
					required
					mask="credit-card"
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
				:loading="esperandoCreacionDeCliente"
				:disabled="!formularioEsValido"
				@click.stop="crearClienteRegular( )"
			>
				Crear
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
	import { Component, Vue, Emit } from 'vue-property-decorator';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { ClienteParaCrear } from '../interfaces/cliente.interface';
	import { requerido } from '@/helpers/validadores/requerido';
	import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
	import { tarjetaDeCredito } from '@/helpers/validadores/tarjeta-de-credito';
	import { correoElectronico } from '@/helpers/validadores/correo-electronico';
	import { mayorDeDieciocho } from '@/helpers/validadores/mayor-de-dieciocho';


	@Component
	export default class CargaDeClienteRegular extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		/**
		 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de un cliente regular
		 */
		public esperandoCreacionDeCliente: boolean = false;

		/**
		 * Objeto que almacena el estado del cliente regular para crear de acuerdo al estado del formulario.
		 */
		public modelo: ClienteParaCrear = {
			idSuscripcion: '',
			nombre: '',
			apellido: '',
			contraseña: '',
			fechaDeNacimiento: '',
			celular: '',
			ciudad: '',
			email: '',
			tarjetaDeCredito: '',
			creditos: [ ],
		};

		/**
		 * Conjunto de reglas de validación para cada campo del formulario de carga.
		 */
		public validadores = {
			nombre: [
				requerido( 'Nombre' ),
				textoNoVacio( 'Nombre' )
			],
			apellido: [
				requerido( 'Apellido' ),
				textoNoVacio( 'Apellido' )
			],
			contraseña: [
				requerido( 'Contraseña' ),
				textoNoVacio( 'Contraseña' )
			],
			fechaDeNacimiento: [
				requerido( 'Fecha de nacimiento' ),
				textoNoVacio( 'Fecha de nacimiento' ),
				mayorDeDieciocho( 'Fecha de nacimiento' )
			],
			celular: [
				requerido( 'Celular' ),
				textoNoVacio( 'Celular' )
			],
			ciudad: [
				requerido( 'Ciudad' ),
				textoNoVacio( 'Ciudad' )
			],
			email: [
				requerido( 'Email' ),
				textoNoVacio( 'Email' ),
				correoElectronico( 'Email' )
			],
			tarjetaDeCredito: [
				requerido( 'Tarjeta de crédito' ),
				textoNoVacio( 'Tarjeta de crédito' ),
				tarjetaDeCredito( 'Tarjeta de crédito' )
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

		/**
		 * Emite el evento _cancelacion_.
		 */
		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		/**
		 * Emite el evento _clienteRegularCreado_.
		 */
		@Emit( 'clienteRegularCreado' )
		public emitirEventoClienteRegularCreado( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		/**
		 * Solicita la creación de un cliente regular de acuerdo al estado actual del modelo.
		 *
		 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _clienteCreado_.
		 */
		public async crearClienteRegular( ): Promise<void> {
			this.esperandoCreacionDeCliente = true;
			// this.modelo.fechaDeCreacion = moment.utc().toISOString();
			// await this.$store.dispatch( 'crearSuscripcion', this.modelo );
			this.esperandoCreacionDeCliente = false;

			this.restablecerFormulario( );
			this.emitirEventoClienteRegularCreado( );
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.idSuscripcion = '';
			this.modelo.nombre = '';
			this.modelo.apellido = '';
			this.modelo.contraseña = '';
			this.modelo.fechaDeNacimiento = '';
			this.modelo.celular = '';
			this.modelo.ciudad = '';
			this.modelo.email = '';
			this.modelo.tarjetaDeCredito = '';
			this.modelo.creditos = [ ];

			this.formularioEsValido = false;
		}
	}
</script>