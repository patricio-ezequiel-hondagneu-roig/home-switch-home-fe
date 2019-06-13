<template>
	<div id="app">
		<v-app id="inspire">
			<v-content>
				<v-container fluid fill-height>
					<v-layout align-center justify-center>
						<v-flex xs12 sm8 md4>
							<v-card class="elevation-3">

								<v-toolbar dark color="primary">
									<v-toolbar-title>Ingresar a Home Switch Home</v-toolbar-title>
								</v-toolbar>

								<v-card-text>
									<v-form>
									<v-text-field v-model="email" prepend-icon="email" name="email" label="Email" type="text"></v-text-field>
									<v-text-field  v-model="contraseña" prepend-icon="lock" name="contraseña" label="Contraseña" id="contraseña" type="text"></v-text-field>
									</v-form>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										color="primary"
										@click.stop="ingresar( )"
									>
										Ingresar
									</v-btn>
								</v-card-actions>

							</v-card>
							<br>
							<div class="text-xs-center">
								¿Eres nuevo?
								<v-btn color="primary" @click.stop="mostrarFormularioDeCarga( )">
									Registrarse
								</v-btn>
								<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
									<CargaDeClienteRegular
										@clienteRegularCreado="ocultarFormularioDeCarga( )"
										@cancelacion="ocultarFormularioDeCarga( )"
									/>
								</v-dialog>
							</div>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
		</v-app>
	</div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CargaDeClienteRegular from '@/components/CargaDeClienteRegular.vue';
import { Cliente } from '@/interfaces/cliente.interface';

@Component({
	components: {
		CargaDeClienteRegular,
	},
})

export default class IniciarSesion extends Vue {
	public email: String = '';
	public contraseña: String = '';

	/**
	 * Flag que indica si se debe o no mostrar el formulario de carga.
	 */
	public formularioDeCargaEsVisible: boolean = false;

	private mostrarError: boolean = false;
	/**
	 * Devuelve los errores a mostrar, si los hubiera
	 */
	public get errores( ): string[ ] {
		return ( this.mostrarError )
			? [ 'El email o la contraseña ingresados no son validos' ]
			: [ ];
	}

	// Muestra el formulario de carga de un cliente regular.
	public mostrarFormularioDeCarga( ): void {
		this.formularioDeCargaEsVisible = true;
	}

	// Muestra el formulario de carga de un cliente regular.
	public ocultarFormularioDeCarga( ): void {
		this.formularioDeCargaEsVisible = false;
	}

	/**
	 * Se fija si el email y la contraseña son validos y devuelve el cliente
	 */
	public async ingresar( ): Promise<void> {
		const cliente = this.$store.getters.clienteConEmail(this.email);

		if ( cliente !== null && cliente.contraseña === this.contraseña ) {

			await this.$store.dispatch( 'iniciarSesionComoCliente', cliente );

			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'success',
				texto: `Bienvenido ${cliente.nombre} ${cliente.apellido}`
			});

		} else {

			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: 'Los datos ingresados no son validos'
			});

		}
	}
}
</script>