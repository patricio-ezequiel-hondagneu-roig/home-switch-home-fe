<template>
	<v-snackbar
		v-model="alerta.esVisible"
		:color="alerta.tipo"
		bottom
		left
		multi-line
	>
		{{ alerta.texto }}
		<v-btn flat @click="ocultarAlerta( )">
			Cerrar
		</v-btn>
	</v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { InformacionDeAlerta } from '@/interfaces/informacion-de-alerta.interface';

@Component
export default class Alerta extends Vue {
	/**
	 * Retorna la información actual de la alerta
	 */
	public get alerta( ): InformacionDeAlerta {
		return this.$store.getters.alerta;
	}

	/**
	 * Oculta la alerta
	 */
	public async ocultarAlerta( ): Promise<void> {
		await this.$store.dispatch( 'ocultarAlerta' );
	}
}
</script>
