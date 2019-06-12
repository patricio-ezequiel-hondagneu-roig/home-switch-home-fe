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
					v-model="modelo.pais"
					label="Pais"
					:rules="validadores.pais"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.email"
					label="Email"
					:rules="validadores.email"
					required
				></v-text-field>

				<v-container>
					<v-layout>
						<v-flex
							xs12
							md7>
							<v-text-field
								v-model="modelo.tarjetaDeCredito"
								label="Tarjeta de Crédito"
								:rules="validadores.tarjetaDeCredito"
								required
								mask="credit-card"
								counter="16"
							></v-text-field>
						</v-flex>

						<v-flex
							xs12
							md5>
							<v-text-field
								v-model="modelo.codigoDeSeguridad"
								label="Código de seguridad"
								:rules="validadores.codigoDeSeguridad"
								required
								mask="####"
								counter="4"
							></v-text-field>
						</v-flex>

						<v-flex
							xs12
							md5>
							<v-text-field
								v-model="modelo.fechaDeExpiracion"
								label="Fecha de expiración"
								:rules="validadores.fechaDeExpiracion"
								required
								type="date"
							></v-text-field>
						</v-flex>
					</v-layout>
				</v-container>
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
	import { codigoDeSeguridad } from '@/helpers/validadores/codigo-de-seguridad';
	import { Credito } from '../interfaces/credito.interface';
	import moment from 'moment';
	import { Suscripcion } from '@/interfaces/suscripcion.interface';

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
			pais: '',
			email: '',
			tarjetaDeCredito: '',
			codigoDeSeguridad: '',
			fechaDeExpiracion: '',
			creditos: <Credito[]> [],
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
			pais: [
				requerido( 'Pais' ),
				textoNoVacio( 'Pais' )
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
			],
			codigoDeSeguridad: [
				requerido( 'Codigo de seguridad' ),
				textoNoVacio( 'Codigo de seguridad' )
			],
			fechaDeExpiracion: [
				requerido( 'Fecha de expiración' ),
				textoNoVacio( 'Fecha de expiración' ),
				codigoDeSeguridad( 'Fecha de expiración' )
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

			// Transformo las fechas con la moment js
			this.modelo.fechaDeNacimiento = moment(this.modelo.fechaDeNacimiento).utc().toISOString();
			this.modelo.fechaDeExpiracion = moment(this.modelo.fechaDeExpiracion).utc().toISOString();

			// Agrego dos creditos nuevos al cliente
			this.modelo.creditos.push({
				fechaDeCreacion: moment().utc().toISOString(),
				activo: true
			});

			this.modelo.creditos.push({
				fechaDeCreacion: moment().utc().toISOString(),
				activo: true
			});

			// Se le asigna la suscripcion regular al cliente
			this.modelo.idSuscripcion = this.suscripcionRegularActual._id;

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
			this.modelo.pais = '';
			this.modelo.email = '';
			this.modelo.tarjetaDeCredito = '';
			this.modelo.fechaDeExpiracion = '';
			this.modelo.codigoDeSeguridad = '';
			this.modelo.creditos = <Credito[]> [];

			this.formularioEsValido = false;
		}

		/**
		 * Solicita al store que actualice la lista local de suscripciones.
		 */
		public async obtenerSuscripciones( ): Promise<void> {
			await this.$store.dispatch( 'obtenerSuscripciones' );
		}

		public created( ) {
			this.obtenerSuscripciones();
		}

		public get suscripcionRegularActual( ): Suscripcion {
			return this.$store.getters.obtenerSuscripcionRegular;
		}
	}
</script>