<template>
	<v-layout class="justify-center" row wrap>

		<v-container>
			<v-card class="text-xs-center texto">
				Precio actual de la Suscripcion <span style="font-weight:bold">Premium:</span>
				<br>
				$ {{ this.suscripcionPremiumActual ? this.suscripcionPremiumActual.monto : '¿Primera vez aqui? Intenta modificar el precio de suscripcion!' }}
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
			</v-card>
		</v-container>

		<v-container>
			<v-card class="text-xs-center texto">
				Precio actual de la Suscripcion <span style="font-weight:bold">Regular</span>:
				<br>
				$ {{ this.suscripcionRegularActual ? this.suscripcionRegularActual.monto : '¿Primera vez aqui? Intenta modificar el precio de suscripcion!' }}
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
			</v-card>
		</v-container>

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

		public created( ) {
			this.obtenerSuscripciones();
		}

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

		public get suscripcionPremiumActual( ): Suscripcion | undefined {
			return this.$store.getters.obtenerSuscripcionPremium;
		}

		public get suscripcionRegularActual( ): Suscripcion | undefined {
			return this.$store.getters.obtenerSuscripcionRegular;
		}

		/**
		 * Solicita al store que actualice la lista local de suscripciones.
		 */
		public async obtenerSuscripciones( ): Promise<void> {
			await this.$store.dispatch( 'obtenerSuscripciones' );
		}
	}
</script>

<style lang="stylus" scoped>
	.texto {
		font-size: 30px;
	}
</style>
