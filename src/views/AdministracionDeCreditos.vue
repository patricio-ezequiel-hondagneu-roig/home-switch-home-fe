<template>
	<v-layout class="justify-center" row wrap>

		<v-container>
			<v-card class="text-xs-center texto">
				Precio actual de un <span style="font-weight:bold">Crédito</span>
				<br>
				$ {{ (this.creditoActual)? this.creditoActual.monto : '¿Primera vez aqui? Intenta modificar el precio de los créditos!' }}
				<br>
				<v-btn block color="primary" dark @click.stop="mostrarFormularioDeCarga( )" >
					Modificar precio de los créditos
				</v-btn>
				<v-dialog persistent v-model="formularioDeCarga" max-width="40rem">
					<CargaDeCredito
						@creditoCreado="ocultarFormularioDeCarga( )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-card>
		</v-container>

	</v-layout>
</template>

<script lang="ts">
	import { CreditoBD } from '@/interfaces/creditoBD.interface';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeCredito from '@/components/CargaDeCredito.vue';

	@Component({
		components: {
			CargaDeCredito,
		},
	})

	export default class AdministracionDeCreditos extends Vue {

		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCarga: boolean = false;

		public created( ) {
			this.obtenerCreditos();
		}

		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCarga = true;
		}

		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCarga = false;
		}

		public get creditoActual( ): CreditoBD | undefined {
			return this.$store.getters.obtenerCreditoActual;
		}

		public async obtenerCreditos( ): Promise<void> {
			await this.$store.dispatch( 'obtenerCreditos' );
		}
	}
</script>

<style lang="stylus" scoped>
	.texto {
		font-size: 30px;
	}
</style>
