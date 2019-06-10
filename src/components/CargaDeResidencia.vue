<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Cargar residencia</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.titulo"
					label="Título"
					:rules="validadores.titulo"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.pais"
					label="País"
					:rules="validadores.pais"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.provincia"
					label="Provincia"
					:rules="validadores.provincia"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.localidad"
					label="Localidad"
					:rules="validadores.localidad"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.domicilio"
					label="Domicilio"
					:rules="validadores.domicilio"
					required
				></v-text-field>

				<v-textarea
					v-model="modelo.descripcion"
					label="Descripción"
					:rules="validadores.descripcion"
					no-resize
					required
				></v-textarea>

				<v-textarea
					:value="combinarLineas( modelo.fotos )"
					@input="modelo.fotos = extraerLineas( $event )"
					label="Fotos"
					:rules="validadores.fotos"
					hint="Introducí una URL de foto por renglón"
					no-resize
				></v-textarea>

				<v-text-field
					:value="modelo.montoInicialDeSubasta"
					@input="modelo.montoInicialDeSubasta = extraerNumero( $event, modelo.montoInicialDeSubasta )"
					label="Monto inicial de subasta"
					:rules="validadores.montoInicialDeSubasta"
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
				:loading="esperandoCreacionDeResidencia"
				:disabled="!formularioEsValido"
				@click.stop="crearResidencia( )"
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
	import { ResidenciaParaCrear, Residencia } from '../interfaces/residencia.interface';

	@Component
	export default class CargaDeResidencia extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		/**
		 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de residencia
		 */
		public esperandoCreacionDeResidencia: boolean = false;

		/**
		 * Objeto que almacena el estado de la residencia para crear de acuerdo al estado del formulario.
		 */
		public modelo: ResidenciaParaCrear = {
			titulo: '',
			pais: '',
			provincia: '',
			localidad: '',
			domicilio: '',
			descripcion: '',
			fotos: [ ],
			montoInicialDeSubasta: 0,
		};

		/**
		 * Conjunto de reglas de validación para cada campo del formulario de carga.
		 */
		public validadores = {
			titulo: [
				requerido( 'Título' ),
				textoNoVacio( 'Título' )
			],
			pais: [
				requerido( 'País' ),
				textoNoVacio( 'País' )
			],
			provincia: [
				requerido( 'Provincia' ),
				textoNoVacio( 'Provincia' )
			],
			localidad: [
				requerido( 'Localidad' ),
				textoNoVacio( 'Localidad' )
			],
			domicilio: [
				requerido( 'Domicilio' ),
				textoNoVacio( 'Domicilio' )
			],
			descripcion: [
				requerido( 'Descripción' ),
				textoNoVacio( 'Descripción' )
			],
			fotos: [ ],
			montoInicialDeSubasta: [
				requerido( 'Monto inicial de subasta' ),
				numeroNoNegativo( 'Monto inicial de subasta' )
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
		 * Emite el evento _residenciaCreada_.
		 */
		@Emit( 'residenciaCreada' )
		public emitirEventoResidenciaCreada( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		/**
		 * Solicita la creación de una residencia de acuerdo al estado actual del modelo.
		 *
		 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _residenciaCreada_.
		 */
		public async crearResidencia( ): Promise<void> {
			this.esperandoCreacionDeResidencia = true;

			// --------------------------------------------------------------------------------------------------------------
			// El elemento en la posición 0 del arreglo de fotos tiene todas las urls
			// Lo que quiero hacer ahora es que a partir de fotos[0] se cree un arreglo de fotos de manera correcta
			const unString = this.modelo.fotos[0];
			const unStringArreglo = unString.split(' ');

			unStringArreglo.forEach( (entry) =>	entry += ' ' );

			this.modelo.fotos = unStringArreglo;
			// Se puede refactorizar aun más este codigo pero no lo hago xq' no se si se utilizara a futuro
			// --------------------------------------------------------------------------------------------------------------

			await this.$store.dispatch( 'crearResidencia', this.modelo );
			this.esperandoCreacionDeResidencia = false;

			this.restablecerFormulario( );
			this.emitirEventoResidenciaCreada( );
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.titulo = '';
			this.modelo.pais = '';
			this.modelo.provincia = '';
			this.modelo.localidad = '';
			this.modelo.domicilio = '';
			this.modelo.descripcion = '';
			this.modelo.fotos = [ ];
			this.modelo.montoInicialDeSubasta = 0;

			this.formularioEsValido = false;
		}

		/**
		 * Dada una cadena de texto, retorna una lista de las lineas no vacias del texto
		 */
		public extraerLineas( texto: string ): string[ ] {
			return texto
				.split( /(?:\n|\r\n)+/ )
				.map( ( linea ) => linea.trim( ) )
				.filter( ( linea ) => linea !== '' );
		}

		/**
		 * Dada una lista de lineas, retorna un texto recombinándolas
		 */
		public combinarLineas( lineas: string[ ] ): string {
			return lineas
				.map( ( linea ) => linea.trim( ) )
				.filter( ( linea ) => linea !== '' )
				.join( '\n' );
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
