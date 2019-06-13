<template>
	<v-container fluid fill-height>
		<v-layout column align-center justify-center>
			<h1 class="display-2 mb-5">Administración de Clientes</h1>
			<section>
				<v-layout row>

					<v-hover>
						<v-card
							slot-scope="{ hover }"
							class="tarjeta-de-enlace"
							:class="`elevation-${ hover ? 12 : 2 }`"
							:to="{ name: 'administracion de clientes' }"
						>
							<v-layout fill-height column>
								<v-layout justify-center class="primary pa-2">
									<v-icon class="icono-grande">person_add</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Solicitudes</h1>
									</v-card-title>
									<v-card-text>
										Ver, rechazar y aceptar solicitudes de mejora de plan regular a plan premium de clientes.
									</v-card-text>
								</v-layout>
							</v-layout>
						</v-card>
					</v-hover>

					<v-hover>
						<v-card
							slot-scope="{ hover }"
							class="tarjeta-de-enlace"
							:class="`elevation-${ hover ? 12 : 2 }`"
							:to="{ name: 'administracion de clientes' }"
						>
							<v-layout fill-height column>
								<v-layout justify-center class="primary pa-2">
									<v-icon class="icono-grande">group</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Clientes</h1>
									</v-card-title>
									<v-card-text>
										Ver y eliminar clientes.
									</v-card-text>
								</v-layout>
							</v-layout>
						</v-card>
					</v-hover>

				</v-layout>
			</section>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeClienteRegular from '@/components/CargaDeClienteRegular.vue';
	import { Cliente } from '@/interfaces/cliente.interface';

	@Component({
		components: {
			CargaDeClienteRegular,
		},
	})
	export default class Administracion extends Vue {

		/**
		 * Lista de todos los clientes actualmente en el sistema.
		 */
		public get clientes( ): Cliente[ ] {
			return this.$store.getters.clientes;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga los clientes actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerClientes( );
		}

		/**
		 * Solicita la lista de todos los clientes actualmente en el sistema.
		 *
		 * Al recibir una respuesta de éxito, actualiza la lista de clientes del componente con las recibidas.
		 */
		public obtenerClientes( ): void {
			this.$store.dispatch( 'obtenerClientes' );
		}

	}
</script>

<style lang="stylus" scoped>
	.tarjeta-de-enlace {
		height: 25rem;
		width: 25rem;
		margin-left: 2rem;
		margin-right: 2rem;
	}

	.icono-grande {
		font-size: 8rem;
	}

	.verticalmente-desbordable {
		overflow-y: auto;
	}
</style>
