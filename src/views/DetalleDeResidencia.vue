<template>
		<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card v-if="residencia !== null" class="pa-3" width="40rem">
				<v-card-title>
					<h5 class="headline">Residencia ID {{idResidencia}} - {{residencia.titulo}}</h5>
				</v-card-title>
				<v-card-text>
					Dirección: {{residencia.pais}}, {{residencia.provincia}}, {{residencia.localidad}}, {{residencia.domicilio}}
				</v-card-text>
				<v-card-text>
					Descripción:
					{{residencia.descripcion}}
				</v-card-text>
				<v-card-text>
					Monto inicial de subasta: ${{residencia.montoInicialDeSubasta}}
				</v-card-text>
			</v-card>
			<v-card v-if="residencia === null">
				No hay residencia para mostrar.
			</v-card>
		</v-layout>
		<v-snackbar
			v-model="alertaEsVisible"
			:color="tipoDeAlerta"
			bottom
			left
			multi-line
		>
			{{ textoDeAlerta }}
			<v-btn flat @click="ocultarAlerta( )">
				Cerrar
			</v-btn>
		</v-snackbar>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import axios from 'axios';
import { Residencia } from '@/interfaces/residencia.interface';
import { server } from '@/utils/helper';
import router from '@/router';
import { Route } from 'vue-router';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';

// TODO: Refactorizar y agregar comentarios JSDoc

@Component
export default class DetalleDeResidencia extends Vue{
	@Prop( )
	public readonly idResidencia!: string;

	public get residencia( ): Residencia | null {
		return this.$store.getters.residenciaConId( this.idResidencia );
	}

	public created( ) {
		this.obtenerResidencia( );
	}

	public async obtenerResidencia( ): Promise<void> {
		await this.$store.dispatch( 'obtenerResidencias' );

		if ( this.residencia === null ) {
			this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: `No existe ninguna residencia con el ID provisto (${ this.idResidencia })`
			});
			router.push({ name: '404' });
		}
	}
}
</script>