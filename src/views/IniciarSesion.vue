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
									<v-text-field prepend-icon="email" name="email" label="Email" type="text"></v-text-field>
									<v-text-field prepend-icon="lock" name="contraseña" label="Contraseña" id="contraseña" type="password"></v-text-field>
									</v-form>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary">Ingresar</v-btn>
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

	@Component({
		components: {
			CargaDeClienteRegular,
		},
	})

	export default class IniciarSesion extends Vue {

		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaEsVisible: boolean = false;

		// Muestra el formulario de carga de un cliente regular.
		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = true;
		}

		// Muestra el formulario de carga de un cliente regular.
		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = false;
		}
	}
</script>