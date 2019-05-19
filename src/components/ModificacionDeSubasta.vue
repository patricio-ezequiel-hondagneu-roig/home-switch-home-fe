<template>
	<v-card class="pa-3">

		<v-card-title>
			<h5 class="headline">Modificar subasta</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.fechaDeInicio"
					label="Fecha de Inicio"
					:rules="validadores.fechaDeInicio"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeFin"
					label="Fecha de Fin"
					:rules="validadores.fechaDeFin"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.montoInicial"
					label="Monto Inicial"
					:rules="validadores.montoInicial"
					required
				></v-text-field>

			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarModificacion( )">
				Cancelar
			</v-btn>
			<v-btn class="success" :disabled="!formularioEsValido" @click.stop="modificarSubasta( )">
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
import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { Subasta, SubastaParaModificar } from '../interfaces/subasta.interface';

@Component
export default class ModificacionDeSubasta extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	/**
	 * Subasta para modificar
	 */
	@Prop( )
	public readonly subasta!: Subasta;

	/**
	 * Objeto que almacena el estado de la subasta para modificar de acuerdo al estado del formulario.
	 */
	public modelo: SubastaParaModificar = {
		fechaDeInicio: this.subasta.fechaDeInicio,
		fechaDeFin: this.subasta.fechaDeFin,
		montoInicial: this.subasta.montoInicial,
	};

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		montoInicial: [
			requerido( 'Monto Inicial' ),
			textoNoVacio( 'Monto Inicial' )
		],
		fechaDeFin: [
			requerido( 'Fecha de Fin' ),
			textoNoVacio( 'Fecha de Fin' )
		],
		fechaDeInicio: [
			requerido( 'Fecha de Inicio' ),
			textoNoVacio( 'Fecha de Inicio' )
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
	 * Emite el evento _subastaModificada_ con la subasta recibida.
	 */
	@Emit( 'subastaModificada' )
	public emitirEventoSubastaModificada( subastaModificada: Subasta ): Subasta {
		return subastaModificada;
	}

	/**
	 * Emite el evento _error_ con el error recibido.
	 */
	@Emit( 'error' )
	public emitirEventoError( error: Error ): Error {
		return error;
	}

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
	 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _subastaModificada_ con la
	 * subasta modificada como dato.
	 */
	public async modificarSubasta( ): Promise<void> {
		try {
			const url: string = `${ server.baseURL }/subastas/${ this.subasta.idSubasta }`;
			const respuesta = await axios.put<Subasta>( url, this.modelo );
			const subastaModificada = respuesta.data;

			this.restablecerFormulario( );
			this.emitirEventoSubastaModificada( subastaModificada );
		}
		catch ( error ) {
			this.emitirEventoError( new Error( error.response.data.message ) );
		}
	}

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.modelo.montoInicial           = this.subasta.montoInicial;
		this.modelo.fechaDeInicio          = this.subasta.fechaDeInicio;
		this.modelo.fechaDeFin             = this.subasta.fechaDeFin;

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
}
</script>
