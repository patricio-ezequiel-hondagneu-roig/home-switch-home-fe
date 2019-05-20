<template>
		<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card v-if='subasta!==null' class="pa-3" width="40rem">
				<v-card-text>
					Fechas: Del {{subasta.fechaDeInicio}} al {{subasta.fechaDeFin}}
				</v-card-text>
				<v-card-text>
					Monto min. de oferta:
					{{subasta.montoInicial}}
				</v-card-text>
				<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click.stop="emitirEventoOk( )">
					Ok
				</v-btn>
				</v-card-actions>
			</v-card>
			<v-card v-if='subasta===null'>
				No hay residencia para mostrar.
			</v-card>
		</v-layout>

	</v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import axios from 'axios';
import { Subasta } from '@/interfaces/subasta.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { server } from '@/utils/helper';
import router from '@/router';
import { Route } from 'vue-router';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';
@Component
export default class DetalleDeResidencia extends Vue{
	@Prop()
	public readonly idSubasta!: string;

	public subasta: Subasta = {
		idSubasta: '',
		idResidencia: '',
		montoInicial: '',
		fechaDeInicio: '',
		fechaDeFin: '',
		ofertas: [ ]
	};

	@Emit( 'ok' )
	public emitirEventoOk( ): void { }

	public created() {
		this.traerSubasta();
	}
	public async traerSubasta(): Promise<void> {
		try {
			const respuestaSubasta = await axios.get<Subasta>( `${ server.baseURL }/subastas/${this.idSubasta}` );
			this.subasta = respuestaSubasta.data;
		}catch (error) {
			router.push({ name: '404' });
		}
	}

}
</script>