<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>

			<v-flex align-center>
				<v-layout align-center justify-center>
					<p class="display-1">
						<span class="font-weight-black"> Reservas directas en el sistema: </span>
					</p>
				</v-layout>

				<br>
				<hr>
			</v-flex>

			<v-flex xs12>
				<TablaDeReservasDirectas></TablaDeReservasDirectas>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import TablaDeReservasDirectas from '@/components/TablaDeReservasDirectas.vue';
	import { server } from '@/utils/helper';
	import { Publicacion } from '@/interfaces/publicacion.interface';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';
	import moment from 'moment';

	@Component({
		components: {
			TablaDeReservasDirectas
		},
	})
	export default class AdministracionDeReservasDirectas extends Vue {

		/**
		 * Lista de todas las publicaciones actualmente en el sistema.
		 */
		public get publicaciones( ): Publicacion[ ] {
			return this.$store.getters.publicaciones;
		}
	}
</script>