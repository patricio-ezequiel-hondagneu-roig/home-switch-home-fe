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
	import SubastasActivas from '@/components/SubastasActivas.vue';
	import ReservasDirectasActivas from '@/components/ReservasDirectasActivas.vue';
	import HotsalesActivas from '@/components/HotsalesActivas.vue';
	import BuscadorDeInicio from '@/components/BuscadorDeInicio.vue';
	@Component({
		components: {
			BuscadorDeInicio,
			SubastasActivas,
			ReservasDirectasActivas,
			HotsalesActivas
		},
	})
	export default class Inicio extends Vue {
		/**
		 * Lista de todas las subastas actualmente en el sistema.
		 */
		public get subastas( ): Subasta[ ] {
			return this.$store.getters.subastas;
		}
	}
</script>