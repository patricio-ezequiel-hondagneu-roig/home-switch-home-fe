<template>
		<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card v-if='subasta!==null' class="pa-3" width="40rem">
				<v-card-title>
					<h5 class="headline">Detalles de subasta</h5>
				</v-card-title>
				<v-card-text>
					Fecha de reservacion: Del <strong>{{subasta.fechaDeInicio}}</strong> al <strong>{{subasta.fechaDeFin}}</strong>
				</v-card-text>
				<v-card-text>
					Monto min. para poder ofertar:
					<strong>$ {{subasta.montoInicial}}</strong>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="success" flat @click.stop="emitirEventoOk( )">
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
		montoInicial: 0,
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