<template>
	<v-layout>
    	<v-flex xs12 sm6 >
			<v-card v-if="residencia!==null" width="40rem">
				<v-carousel v-if="residencia.fotos.length > 0"
					class="gray--text"
					height="200px"
					:cycle="false"
					hide-delimiters
				>
					<v-carousel-item
						v-for="(item,i) in residencia.fotos"
						:key="i"
						:src="item"
					></v-carousel-item>
				</v-carousel>
				<v-img v-if='(residencia.fotos.length === 0)'
					class="white--text"
					height="200px"
				>
					<v-layout>
						<img
							src="@/assets/images/residenciaSinFoto.jpg"
							width="560px"
							height="200px"
						>
					</v-layout>
				</v-img>
				<v-card-title>
					<div>
						<span><strong>{{residencia.pais}}, {{residencia.provincia}}, {{residencia.localidad}}, {{residencia.domicilio}}.</strong></span><br>
						<span>{{residencia.descripcion}}</span>
					</div>
				</v-card-title>
				<v-container style="position:absolute;top:0;color:white;text-shadow:0.25em 0 0.25em black" fluid>
					<v-layout fill-height>
						<v-flex xs12 align-end flexbox>
							<span class="headline"> {{residencia.titulo}} </span>
						</v-flex>
					</v-layout>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="primary" @click.stop="emitirEventoOk( )">
						Ok
					</v-btn>
				</v-card-actions>
			</v-card>
			<v-card v-if='residencia===null'>
				No hay residencia para mostrar.
			</v-card>
    	</v-flex>
	</v-layout>


</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import axios from 'axios';
import { Residencia } from '@/interfaces/residencia.interface';
import { server } from '@/utils/helper';
import router from '@/router';
import { Route } from 'vue-router';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';
@Component
export default class DetalleDeResidencia extends Vue{
	@Prop()
	public readonly residencia!: Residencia;
	@Emit( 'ok' )
	public emitirEventoOk( ): void { }
}
</script>