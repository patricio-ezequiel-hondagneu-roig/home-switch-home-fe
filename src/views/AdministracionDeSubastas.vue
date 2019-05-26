<template>
	<v-container fluid fill-height>
		<v-layout align-center row wrap>
			<v-flex align-center justify-center>
				<v-btn flat class="success" @click.stop="mostrarFormularioDeCarga( )">
					Cargar subasta
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargaDeSubasta
						@subastaCreada="ocultarFormularioDeCarga( )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaDeSubastas :subastas="subastas"></TablaDeSubastas>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import CargaDeSubasta from '@/components/CargaDeSubasta.vue';
	import TablaDeSubastas from '@/components/TablaDeSubastas.vue';
	import { server } from '@/utils/helper';
	import { Subasta } from '@/interfaces/subasta.interface';
	import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

	@Component({
		components: {
			CargaDeSubasta,
			TablaDeSubastas
		},
	})
	export default class AdministracionDeSubastas extends Vue {
		/**
		 * Flag que indica si se debe o no mostrar el formulario de carga.
		 */
		public formularioDeCargaEsVisible: boolean = false;

		/**
		 * Lista de todas las subastas actualmente en el sistema.
		 */
		public get subastas( ): Subasta[ ] {
			return this.$store.getters.subastas;
		}

		/**
		 * Hook de ciclo de vida.
		 *
		 * Carga las subastas actualmente en el sistema al instanciar el componente.
		 */
		public created( ): void {
			this.obtenerSubastas( );
		}

		/**
		 * Solicita al store que actualice la lista local de subastas.
		 */
		public obtenerSubastas( ): void {
			this.$store.dispatch( 'obtenerSubastas' );
		}

		/**
		 * Muestra el formulario de carga de subastas.
		 */
		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = true;
		}

		/**
		 * Oculta el formulario de carga de subastas.
		 */
		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = false;
		}
	}
</script>