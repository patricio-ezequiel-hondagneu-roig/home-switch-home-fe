<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card class="pa-3" width="40rem">
				<v-card-title>
					<h5 class="headline">Ingrese su código de acceso</h5>
				</v-card-title>

				<v-card-text>
					<v-form
						v-model="formularioEsValido"
						ref="formulario"
						@submit.stop.prevent="ingresar( )"
					>
						<v-text-field
							v-model="codigo"
							label="Código"
							type="password"
							:rules="validadores.codigo"
							:error-messages="errores"
							@input="ocultarError( )"
							@blur="ocultarError( )"
							autofocus
							required
						></v-text-field>
					</v-form>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						class="success"
						:disabled="!formularioEsValido"
						:loading="esperandoValidacionDeIngreso"
						@click.stop="ingresar( )"
					>
						Ingresar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { VuetifyFormRef } from '../typings/vuetify-form-ref.d';

@Component
export default class Ingreso extends Vue {

	/** Devuelve los errores a mostrar, si los hubiera */
	public get errores( ): string[ ] {
		return ( this.mostrarError )
			? [ 'El código ingresado es inválido' ]
			: [ ];
	}
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	public codigo?: string = '';

	public validadores = {
		codigo: [
			( valor?: string ) => {
				return ( valor !== undefined && valor !== '' )
					? true
					: 'El código de acceso es un campo obligatorio';
			},
		],
	};

	/**
	 * Flag que se activa mientras se espera la respuesta a una solicitud de ingreso
	 */
	public esperandoValidacionDeIngreso: boolean = false;

	private mostrarError: boolean = false;

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

	public ocultarError( ): void {
		this.mostrarError = false;
	}

	// TODO: Reemplazar validación en componente por validación en store
	/**
	 * Solicita ingresar al sistema con el código introducido
	 */
	public async ingresar( ): Promise<void> {
		if ( this.codigo === '12345' ) {
			this.esperandoValidacionDeIngreso = true;
			// TODO: Cambiar esta espera de 3 segundos por una llamada real al servidor
			const tresSegundos = 3000;
			await new Promise( (resolve) => setTimeout( ( ) => resolve( ), tresSegundos ) );
			this.esperandoValidacionDeIngreso = false;

			await this.$store.dispatch( 'iniciarSesionComoAdmin' );
			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'success',
				texto: 'Ingresaste a Home Switch Home'
			});
			this.restablecerFormulario( );
			this.$router.push({ name: 'administracion' });
		} else {
			this.restablecerFormulario( );
			this.mostrarError = true;
		}
	}

	/** Restablece el formulario a su estado inicial */
	public restablecerFormulario( ): void {
		if (this.formulario !== null) {
			this.formulario.resetValidation( );
		}
		this.codigo = undefined;
		this.formularioEsValido = false;
	}
}
</script>