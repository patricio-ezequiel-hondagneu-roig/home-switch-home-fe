<template>
	<v-layout class="justify-center">
		<v-card class="text-xs-center texto">

			<v-card-text>
				Precio actual de la Suscripcion Premium:
				<br>
				1000 $
				<br>
				<v-btn block color="primary" dark>Modificar precio de la suscripción premium</v-btn>
			</v-card-text>

			<v-card-text>
				Precio actual de la Suscripcion Regular:
				<br>
				1000 $
				<br>
				<v-btn block color="primary" dark>Modificar precio de la suscripción regular</v-btn>
			</v-card-text>

		</v-card>
	</v-layout>
</template>

<script lang="ts">
	import { Vue, Prop } from 'vue-property-decorator';
	import { Suscripcion } from '@/interfaces/suscripcion.interface';

	export default class AdministracionDeSuscripciones extends Vue {
		@Prop( )
		public readonly suscripciones!: Suscripcion[ ];

		public async eliminarResidencia( idResidencia: string ): Promise<void> {
			await this.$store.dispatch( 'eliminarResidencia', idResidencia );
		}
	}
</script>

<style lang="stylus" scoped>
	.texto {
		font-size: 30px;
	}
</style>
