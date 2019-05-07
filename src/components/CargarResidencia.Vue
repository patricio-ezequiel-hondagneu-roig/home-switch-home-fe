<template>
	<v-card>
		<v-card-tittle>Cargar Residencia</v-card-tittle>
		<v-form class="px-3">
			<v-text-field label="Nombre" v-model="tittle" required></v-text-field>
			<v-text-field label="Dirección" v-model="tittle" required></v-text-field>
			<v-textarea label="Descripción" v-model="content" required prepend-icon="edit"></v-textarea>
			<v-btn flat class="success mx-0 mt-3" @click="submit">Cargar</v-btn>
		<v-form>
	</v-card>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	export default class CargarResidencia extends Vue{
		data(){
			return{
				Nombre:'',
				Dirección:'',
				Descripción:''
			}
		},
		methods:{
			submit(){
				console.log(this.Nombre, this.Dirección,this.Descripción)
			}
		}
	}
</script>