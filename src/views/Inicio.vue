<template>
	<v-layout column wrap align-center>
		<v-layout column align-center>
			<v-flex>
				<img  src="@/assets/images/logo-imagen.svg" height="300" width="350"/>
			</v-flex>
			<v-flex class="text-md-center display-3">
				Bienvenid@ a
				<span class="font-weight-light darken-2 primary--text text--lighten-1">
					Home<span class="font-weight-bold">Switch</span> Home
				</span>
				<hr class="my-4">
			</v-flex>
		</v-layout>
		<BuscadorDeInicio />
	</v-layout>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { Subasta } from '@/interfaces/subasta.interface';
	import { server } from '@/utils/helper';
	import SubastasActivasViejo from '@/components/SubastasActivasViejo.vue';
	import ReservasDirectasActivas from '@/components/ReservasDirectasActivas.vue';
	import SubastasActivas from '@/components/SubastasActivas.vue';
	import HotsalesActivos from '@/components/HotsalesActivos.vue';
	import BuscadorDeInicio from '@/components/BuscadorDeInicio.vue';

	@Component({
		components: {
			BuscadorDeInicio,
			SubastasActivasViejo,
			SubastasActivas,
			ReservasDirectasActivas,
			HotsalesActivos
		},
	})

	export default class Inicio extends Vue {

		public created( ): void {
			this.actualizarPublicaciones( );
			this.actualizarResidencias( );
			this.actualizarSuscripciones( );
			this.actualizarCreditos( );
		}

		public async actualizarPublicaciones( ): Promise<void> {
			await this.$store.dispatch( 'obtenerPublicaciones' );
		}

		public async actualizarResidencias( ): Promise<void> {
			await this.$store.dispatch( 'obtenerResidencias' );
		}

		public async actualizarSuscripciones( ): Promise<void> {
			await this.$store.dispatch( 'obtenerSuscripciones' );
		}

		public async actualizarCreditos( ): Promise<void> {
			await this.$store.dispatch( 'obtenerCreditos' );
		}

	}
</script>