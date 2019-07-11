<template>
	<v-container fluid fill-height>
		<v-layout column align-center justify-center>
			<h1 class="display-2 mb-5">Administración</h1>
			<section>
				<v-layout row>

					<v-hover>
						<v-card
							slot-scope="{ hover }"
							class="tarjeta-de-enlace"
							:class="`elevation-${ hover ? 12 : 2 }`"
							:to="{ name: 'administracion de residencias' }"
						>
							<v-layout fill-height column>
								<v-layout justify-center class="primary pa-2">
									<v-icon class="icono-grande">home</v-icon>
								</v-layout>
								<v-layout column class="verticalmente-desbordable">
									<v-card-title primary-title>
										<h1 class="headline mb-0">Residencias</h1>
									</v-card-title>
									<v-card-text>
										Ver, crear, modificar y eliminar residencias.
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
							:to="{ name: 'administracion de suscripciones' }"
						>
						<v-layout fill-height column>
							<v-layout justify-center class="primary pa-2">
								<v-icon class="icono-grande">update</v-icon>
							</v-layout>
							<v-layout column class="verticalmente-desbordable">
								<v-card-title primary-title>
									<h1 class="headline mb-0">Suscripciones</h1>
								</v-card-title>
								<v-card-text>
									Ver, crear, modificar y eliminar suscripciones.
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
							<v-layout justify-center class="primary pa-2">
								<v-icon class="icono-grande">event</v-icon>
							</v-layout>
							<v-layout column class="verticalmente-desbordable">
								<v-card-title primary-title>
									<h1 class="headline mb-0">Publicaciones</h1>
								</v-card-title>
								<v-card-text>
									Ver, crear, modificar y eliminar publicaciones.
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
								<v-icon class="icono-grande">person</v-icon>
							</v-layout>
							<v-layout column class="verticalmente-desbordable">
								<v-card-title primary-title>
									<h1 class="headline mb-0">Clientes</h1>
								</v-card-title>
								<v-card-text>
									Ver, crear, modificar y eliminar clientes.
								</v-card-text>
							</v-layout>
						</v-layout>
						</v-card>
					</v-hover>

				</v-layout>

				<br>

				<!-- Administración de créditos -->
				<v-hover>
					<v-card
						slot-scope="{ hover }"
						class="tarjeta-de-enlace"
						:class="`elevation-${ hover ? 12 : 2 }`"
						:to="{ name: 'administracion de creditos' }"
					>
					<v-layout fill-height column>
						<v-layout justify-center class="primary pa-2">
							<v-icon class="icono-grande">monetization_on</v-icon>
						</v-layout>
						<v-layout column class="verticalmente-desbordable">
							<v-card-title primary-title>
								<h1 class="headline mb-0">Créditos</h1>
							</v-card-title>
							<v-card-text>
								Ver y modificar el precio de los créditos.
							</v-card-text>
						</v-layout>
					</v-layout>
					</v-card>
				</v-hover>

			</section>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Administracion extends Vue {

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
