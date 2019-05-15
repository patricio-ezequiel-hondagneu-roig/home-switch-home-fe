<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Cargar residencia</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="nombre"
					label="Nombre"
					:rules="validadores.nombre"
					required
				></v-text-field>

				<v-text-field
					v-model="direccion"
					label="Dirección"
					:rules="validadores.direccion"
					required
				></v-text-field>

				<v-textarea
					v-model="descripcion"
					label="Descripción"
					:rules="validadores.descripcion"
					no-resize
					required
				></v-textarea>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelar( )">
				Cancelar
			</v-btn>
			<v-btn class="success" :disabled="!formularioEsValido" @click.stop="cargar( )">
				Cargar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { VuetifyFormRef } from '../typings/vuetify-form-ref.d';

@Component
export default class CargarResidencia extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	public nombre?: string = '';
	public direccion?: string = '';
	public descripcion?: string = '';

	public validadores = {
		nombre: [
			( valor?: string ) => {
				return ( valor !== undefined && valor.trim( ) !== '' )
					? true
					: 'El nombre es un campo obligatorio';
			},
		],
		direccion: [
			( valor?: string ) => {
				return ( valor !== undefined && valor.trim( ) !== '' )
					? true
					: 'La dirección es un campo obligatorio';
			},
		],
		descripcion: [
			( valor?: string ) => {
				return ( valor !== undefined && valor.trim( ) !== '' )
					? true
					: 'La descripción es un campo obligatorio';
			},
		]
	};

	/** Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM. */
	public beforeMount( ): void {
		this.restablecerFormulario( );
	}

	/** Hook de ciclo de vida. Guarda la referencia al formulario de carga. */
	public beforeUpdate( ): void {
		if ( this.formulario === null ) {
			this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
		}
	}

	/** Emite el evento "cancelar" y restablece el formulario */
	@Emit( 'cancelar' )
	public cancelar( ): void {
		this.restablecerFormulario( );
	}

	/** Emite el evento "cargar" y restablece el formulario */
	@Emit( 'cargar' )
	public cargar( ): void {
		this.restablecerFormulario( );
	}

	/** Restablece el formulario a su estado inicial */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}
		this.nombre = undefined;
		this.direccion = undefined;
		this.descripcion = undefined;
		this.formularioEsValido = false;
	}
}
</script>