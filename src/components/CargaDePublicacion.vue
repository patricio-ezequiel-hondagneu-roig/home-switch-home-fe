<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Cargar publicaciones</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-select
					v-model="modelo.idResidencia"
					:items="residencias"
					item-value="_id"
					label="Residencia"
					no-data-text="No hay residencias para mostrar"
					:rules="validadores.residencia"
					required
				>
					<template #selection="{ item }">
						{{ item.titulo }}
					</template>
					<template #item="{ item }">
						{{ item.titulo }}
						<span class="ml-1 caption font-italic">&mdash; {{ ubicacionDeResidencia( item ) }}</span>
					</template>
				</v-select>

				<v-text-field
					:value="modelo.montoInicialDeSubasta"
					@input="modelo.montoInicialDeSubasta = extraerNumero( $event, modelo.montoInicialDeSubasta )"
					label="Monto inicial de subasta"
					:rules="validadores.montoInicialDeSubasta"
					hint="El monto no puede ser negativo"
					prefix="$"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeInicioDeSemana"
					label="Fecha comienzo de reserva"
					:rules="validadores.fechaDeInicioDeSemana"
					type="date"
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
				color="success"
				:loading="esperandoCreacionDePublicacion"
				:disabled="!formularioEsValido"
				@click.stop="crearPublicacion( )"
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
	import router from '@/router';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { server } from '@/utils/helper';
	import { Publicacion, PublicacionParaCrear } from '../interfaces/publicacion.interface';
	import { numeroNoNegativo } from '../helpers/validadores/numero-no-negativo';
	import { fechaDeSemana } from '../helpers/validadores/fecha-de-semana';
	import { Residencia } from '../interfaces/residencia.interface';
	import moment from 'moment';

	// TODO: Validar que las fechas de inicio y fin estén ordenadas y no sean fechas pasadas

	@Component
	export default class CargaDePublicacion extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		/**
		 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de Publicacion
		 */
		public esperandoCreacionDePublicacion: boolean = false;

		/**
		 * Objeto que almacena el estado de la Publicacion para crear de acuerdo al estado del formulario.
		 */
		public modelo: PublicacionParaCrear = {
			idResidencia: '',
			montoInicialDeSubasta: 0,
			fechaDeInicioDeSemana: '',
			cerroSubasta: false,
		};

		/**
		 * Conjunto de reglas de validación para cada campo del formulario de carga.
		 */
		public validadores = {
			residencia: [
				requerido( 'Residencia' )
			],
			montoInicialDeSubasta: [
				requerido( 'Monto inicial de subasta' ),
				numeroNoNegativo( 'Monto inicial de subasta' )
			],
			fechaDeInicioDeSemana: [
				requerido( 'Fecha comienzo de reserva' ),
				fechaDeSemana( 'Fecha comienzo de reserva' )
			],
		};

		/**
		 * Retorna un texto con la localidad, provincia y país de una residencia dada.
		 */
		public ubicacionDeResidencia = ( residencia: Residencia ): string => {
			const { domicilio, localidad, provincia, pais } = residencia;
			return `${ domicilio }, ${ localidad }, ${ provincia }, ${ pais }`;
		}

		/**
		 * Retorna las residencias existentes
		 */
		public get residencias( ): Residencia[ ] {
			return this.$store.getters.residencias;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Solicita las residencias para seleccionar en el formulario de carga
		 */
		public created( ): void {
			this.obtenerResidencias( );
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
		 * Solicita las residencias existentes para que sean seleccionables al crear una publicacion.
		 */
		public async obtenerResidencias( ): Promise<void> {
			await this.$store.dispatch( 'obtenerResidencias' );
		}

		/**
		 * Emite el evento _cancelacion_.
		 */
		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		/**
		 * Emite el evento _publicacionCreada_.
		 */
		@Emit( 'publicacionCreada' )
		public emitirEventoPublicacionCreada( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarCarga( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		/**
		 * Solicita la creación de una Publicacion de acuerdo al estado actual del modelo.
		 *
		 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _publicacionCreada_.
		 */
		public async crearPublicacion( ): Promise<void> {
			this.esperandoCreacionDePublicacion = true;

			// Transformo la fecha de comienzo de semana con moment js
			this.modelo.fechaDeInicioDeSemana = moment(this.modelo.fechaDeInicioDeSemana).utc().toISOString();

			await this.$store.dispatch( 'crearPublicacion', this.modelo );
			this.esperandoCreacionDePublicacion = false;

			this.restablecerFormulario( );
			this.emitirEventoPublicacionCreada( );
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.idResidencia = '';
			this.modelo.montoInicialDeSubasta = 0;
			this.modelo.fechaDeInicioDeSemana = '';
			this.modelo.cerroSubasta = false;

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