<template>
	<div>
		<v-container fluid fill-height>
			<v-layout column align-center justify-center>
				<h1 class="display-2 mb-5">Administración de Publicaciones</h1>
				<section>
					<v-layout row>

						<v-hover>
							<v-card
								slot-scope="{ hover }"
								class="tarjeta-de-enlace"
								:class="`elevation-${ hover ? 12 : 2 }`"
								:to="{ name: 'administracion de publicaciones' }"
							>
								<v-layout fill-height column>
									<v-layout justify-center class="primary pa-2">
										<v-icon class="icono-grande">fast_forward</v-icon>
									</v-layout>
									<v-layout column class="verticalmente-desbordable">
										<v-card-title primary-title>
											<h1 class="headline mb-0">Reservas Directas</h1>
										</v-card-title>
										<v-card-text>
											Ver, crear, modificar y eliminar reservas directas.
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
								:to="{ name: 'administracion de subastas' }"
							>
							<v-layout fill-height column>
								<v-layout justify-center class="primary pa-2">
									<v-icon class="icono-grande">gavel</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Subastas</h1>
									</v-card-title>
									<v-card-text>
										Ver, crear, modificar y eliminar subastas.
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
								:to="{ name: 'administracion de publicaciones' }"
							>
							<v-layout fill-height column>
								<v-layout justify-center class="grey pa-2">
									<v-icon class="icono-grande">alarm_add</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Posibles Hot Sales</h1>
									</v-card-title>
									<v-card-text>
										Ver, aprobar, modificar y eliminar posibles hot sales.
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
								:to="{ name: 'administracion de publicaciones' }"
							>
							<v-layout fill-height column>
								<v-layout justify-center class="grey pa-2">
									<v-icon class="icono-grande">whatshot</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Hot Sales Activos</h1>
									</v-card-title>
									<v-card-text>
										Ver, crear, modificar y eliminar hot sales activos.
									</v-card-text>
								</v-layout>
							</v-layout>
							</v-card>
						</v-hover>

					</v-layout>
				</section>
			</v-layout>
		</v-container>

		<br>
		<br>
		<hr>
		<br>
		<br>

		<v-container fluid fill-height>
			<v-layout align-center row wrap>
				<v-flex align-center justify-center>
					<v-btn flat class="primary" @click.stop="mostrarFormularioDeCarga( )">
						Cargar una publicacion
					</v-btn>
					<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
						<CargaDePublicacion
							@subastaCreada="ocultarFormularioDeCarga( )"
							@cancelacion="ocultarFormularioDeCarga( )"
						/>
					</v-dialog>
				</v-flex>
				<v-flex xs12>
					<TablaDePublicaciones :publicaciones="publicaciones"></TablaDePublicaciones>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import { Publicacion } from '@/interfaces/publicacion.interface';
	import TablaDePublicaciones from '@/components/TablaDePublicaciones.vue';
	import CargaDePublicacion from '@/components/CargaDePublicacion.vue';

	@Component({
		components: {
			TablaDePublicaciones,
			CargaDePublicacion
		},
	})
	export default class Administracion extends Vue {
		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaEsVisible: boolean = false;

		/**
		 * Lista de todas las subastas actualmente en el sistema.
		 */
		public get publicaciones( ): Publicacion[ ] {
			return this.$store.getters.publicaciones;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga las Publicaciones actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerPublicaciones( );
		}

		/**
		 * Solicita al store que actualice la lista local de Publicaciones.
		 */
		public obtenerPublicaciones( ): void {
			this.$store.dispatch( 'obtenerPublicaciones' );
		}

		/**
		 * Muestra el formulario de carga de Publicaciones.
		 */
		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = true;
		}

		/**
		 * Oculta el formulario de carga de Publicaciones.
		 */
		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = false;
		}
	}
</script>

<style lang="stylus" scoped>
	.tarjeta-de-enlace {
		height: 20rem;
		width: 20rem;
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
