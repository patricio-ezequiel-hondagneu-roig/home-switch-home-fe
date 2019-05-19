<template>
	<v-card class="pa-3">

		<v-card-title>
			<h5 class="headline">Modificar residencia</h5>
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
					no-resize
				></v-textarea>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarModificacion( )">
				Cancelar
			</v-btn>
			<v-btn class="success" :disabled="!formularioEsValido" @click.stop="modificarResidencia( )">
				Modificar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { textoRequerido } from '@/helpers/validadores/texto-requerido';
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { Residencia, ResidenciaParaModificar } from '../interfaces/residencia.interface';

@Component
export default class ModificacionDeResidencia extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	/**
	 * Residencia para modificar
	 */
	@Prop( )
	public readonly residencia!: Residencia;

	/**
	 * Objeto que almacena el estado de la residencia para modificar de acuerdo al estado del formulario.
	 */
	public modelo: ResidenciaParaModificar = {
		titulo: this.residencia.titulo,
		pais: this.residencia.pais,
		provincia: this.residencia.provincia,
		localidad: this.residencia.localidad,
		domicilio: this.residencia.domicilio,
		descripcion: this.residencia.descripcion,
		fotos: this.residencia.fotos
	};

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		titulo:      [ textoRequerido( 'Título' ) ],
		pais:        [ textoRequerido( 'País' ) ],
		provincia:   [ textoRequerido( 'Provincia' ) ],
		localidad:   [ textoRequerido( 'Localidad' ) ],
		domicilio:   [ textoRequerido( 'Domicilio' ) ],
		descripcion: [ textoRequerido( 'Descripcion' ) ],
		fotos:       [ ],
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
	 * Emite el evento _residenciaModificada_ con la residencia recibida.
	 */
	@Emit( 'residenciaModificada' )
	public emitirEventoResidenciaModificada( residenciaModificada: Residencia ): Residencia {
		return residenciaModificada;
	}

	/**
	 * Restablece el formulario y emite el evento _cancelacion_.
	 */
	public cancelarModificacion( ): void {
		this.restablecerFormulario( );
		this.emitirEventoCancelacion( );
	}

	/**
	 * Solicita la modificación de una residencia de acuerdo al estado actual del modelo.
	 *
	 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _residenciaModificada_ con la
	 * residencia modificada como dato.
	 */
	public async modificarResidencia( ): Promise<void> {
		// TODO: Agregar un bloque try para el caso en el que la solicitud falle.

		const url: string = `${ server.baseURL }/residencias/${ this.residencia.idResidencia }`;
		const respuesta = await axios.put<Residencia>( url, this.modelo );
		const residenciaModificada = respuesta.data;

		this.restablecerFormulario( );
		this.emitirEventoResidenciaModificada( residenciaModificada );
	}

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.modelo.titulo      = this.residencia.titulo;
		this.modelo.pais        = this.residencia.pais;
		this.modelo.provincia   = this.residencia.provincia;
		this.modelo.localidad   = this.residencia.localidad;
		this.modelo.domicilio   = this.residencia.domicilio;
		this.modelo.descripcion = this.residencia.descripcion;
		this.modelo.fotos       = this.residencia.fotos;

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
