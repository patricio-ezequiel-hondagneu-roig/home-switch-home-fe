<template>
		<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card v-if='residencia!==null' class="pa-3" width="40rem">
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
			<v-card v-if='residencia===null'>
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
@Component
export default class DetalleDeResidencia extends Vue{
	@Prop()
	public readonly idResidencia!: string;

	public residencia: Residencia | '' = '';
	public alertaEsVisible: boolean = false;
	/**
	 * Valor que indica el color con el que se muestra la alerta.
	 */
	public tipoDeAlerta: VuetifyThemeOptionName = 'info';

	/**
	 * Texto a mostrar en la alerta.
	 */
	public textoDeAlerta: string = '';

	public created() {
		this.traerResidencia();
	}
	public async traerResidencia(): Promise<void> {
		try {
			const respuestaResidencia = await axios.get<Residencia>( `${ server.baseURL }/residencias/${this.idResidencia}` );
			this.residencia = respuestaResidencia.data;
		}catch (error) {
			error = new Error( error.response.data.message ) ;
			router.push({ name: '404' });
		}
	}
	public mostrarError( error: Error ): void {
			this.mostrarAlerta( error.message, 'error' );
	}
	public mostrarAlerta( texto: string, tipo: VuetifyThemeOptionName ): void {
			this.textoDeAlerta = texto;
			this.tipoDeAlerta = tipo;
			this.alertaEsVisible = true;
	}
	public ocultarAlerta( ): void {
			this.textoDeAlerta = '';
			this.tipoDeAlerta = 'info';
			this.alertaEsVisible = false;
	}
}
</script>