<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-flex align-center justify-center>
				<v-btn flat class="success" @click.stop="mostrarFormularioDeCarga( )">
					Cargar residencia
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargarResidencia
						@cargar="ocultarFormularioDeCarga( )"
						@cancelar="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaResidencia> </TablaResidencia>
			</v-flex>
		</v-layout>

	</v-container>

</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import CargarResidencia from '@/components/CargarResidencia.vue';
	import TablaResidencia from '@/components/TablaResidencia.vue';
	@Component({
		components: {
			CargarResidencia,
			TablaResidencia,
		},
	})
	export default class VistaAdministrador extends Vue {
		public formularioDeCargaEsVisible: boolean = false;

		/** Muestra el formulario de carga de residencias */
		public mostrarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = true;
		}

		/** Oculta el formulario de carga de residencias */
		public ocultarFormularioDeCarga( ): void {
			this.formularioDeCargaEsVisible = false;
		}
	}
</script>