<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Cargar Residencia</h5>
		</v-card-title>
		<v-card-text>
			<v-form>
				<v-text-field label="Nombre" v-model="nombre" required></v-text-field>
				<v-text-field label="Dirección" v-model="direccion" required></v-text-field>
				<v-textarea label="Descripción" v-model="descripcion" no-resize required></v-textarea>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat class="success" @click="cargar()">Cargar</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
	import { Component, Vue, Emit } from 'vue-property-decorator';

	@Component
	export default class CargarResidencia extends Vue{
		public nombre: string = '';
		public direccion: string = '';
		public descripcion: string = '';

		public cargar( ): void {

		}
	}
</script>