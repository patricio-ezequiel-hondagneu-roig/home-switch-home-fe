<template>
	<v-card class="pa-3">
		<h5 class="headline">Ingrese código de acceso fijo</h5>

		<!-- Campo de ingreso de código de acceso fijo -->
		<v-form v-model="formularioEsValido" ref="formulario">
			<v-text-field
				v-model="codigo"
				label="Codigo"
				:rules="validadores.codigo"
				required
			></v-text-field>
		</v-form>

		<!-- Mensaje de error si el código de acceso es invalido -->
		<p v-if="codigoErroneo" text-color="error" class="red--text">
			El código ingresado es invalido
		</p>

		<v-btn flat @click.stop="cancelar( )">
			Cancelar
		</v-btn>
		<v-btn class="success" :disabled="!formularioEsValido" @click.stop="Ingresar( )">
			Ingresar
		</v-btn>
	</v-card>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { VuetifyFormRef } from '../typings/vuetify-form-ref.d';

@Component
export default class CodigoDeAccesoFijo extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;
	public codigoErroneo: boolean = false;

	public codigo?: string = '';

	public validadores = {
		codigo: [
			( valor?: string ) => {
				return ( valor !== undefined && valor.trim( ) !== '')
					? true
					: 'El código de acceso es un campo obligatorio';
			},
		],
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

	/** Emite el evento "Ingresar" y restablece el formulario */
	@Emit( 'Ingresar' )
	public Ingresar( ): void {
		if (this.codigo === '12345') {
			this.$router.push( '/' );
		} else {
			this.restablecerFormulario( );
			this.codigoErroneo = true;
		}
	}

	/** Restablece el formulario a su estado inicial */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}
		this.codigo = undefined;
		this.formularioEsValido = false;
	}
}
</script>