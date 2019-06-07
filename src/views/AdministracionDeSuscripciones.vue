<template>
	<v-layout class="justify-center">
		<v-card class="text-xs-center texto">

			<v-card-text>
				Precio actual de la Suscripcion Premium:
				<br>
				1000 $
				<br>
				<v-btn block color="primary" dark @click.stop="mostrarFormularioDeCargaPremium( )" >
					Modificar precio de la suscripción premium
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaPremiumEsVisible" max-width="40rem">
					<CargaDeSuscripcionPremium
						@suscripcionCreada="ocultarFormularioDeCargaPremium( )"
						@cancelacion="ocultarFormularioDeCargaPremium( )"
					/>
				</v-dialog>
			</v-card-text>

			<v-card-text>
				Precio actual de la Suscripcion Regular:
				<br>
				1000 $
				<br>
				<v-btn block color="primary" dark @click.stop="mostrarFormularioDeCargaRegular( )" >
					Modificar precio de la suscripción regular
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaRegularEsVisible" max-width="40rem">
					<CargaDeSuscripcionRegular
						@suscripcionCreada="ocultarFormularioDeCargaRegular( )"
						@cancelacion="ocultarFormularioDeCargaRegular( )"
					/>
				</v-dialog>
			</v-card-text>

		</v-card>
	</v-layout>
</template>

<script lang="ts">
	import { Suscripcion } from '@/interfaces/suscripcion.interface';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeSuscripcionPremium from '@/components/CargaDeSuscripcionPremium.vue';
	import CargaDeSuscripcionRegular from '@/components/CargaDeSuscripcionRegular.vue';

	@Component({
		components: {
			CargaDeSuscripcionPremium,
			CargaDeSuscripcionRegular,
		},
	})

	export default class AdministracionDeSuscripciones extends Vue {

		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaPremiumEsVisible: boolean = false;
		public formularioDeCargaRegularEsVisible: boolean = false;

		// Muestra el formulario de carga de una suscripcion premium.
		public mostrarFormularioDeCargaPremium( ): void {
			this.formularioDeCargaPremiumEsVisible = true;
		}

		// Muestra el formulario de carga de una suscripcion regular.
		public mostrarFormularioDeCargaRegular( ): void {
			this.formularioDeCargaRegularEsVisible = true;
		}

		// Oculta el formulario de carga de una suscripcion premium.
		public ocultarFormularioDeCargaPremium( ): void {
			this.formularioDeCargaPremiumEsVisible = false;
		}

		// Oculta el formulario de carga de una suscripcion regular.
		public ocultarFormularioDeCargaRegular( ): void {
			this.formularioDeCargaRegularEsVisible = false;
		}

	}
</script>

<style lang="stylus" scoped>
	.texto {
		font-size: 30px;
	}
</style>
