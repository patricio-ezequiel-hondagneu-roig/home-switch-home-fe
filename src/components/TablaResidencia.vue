 <template>

	<v-data-table
		:headers="headers"
		:items="residencias"
		class="elevation-1">
		<template v-slot:items="props">
			<td>{{ props.item.id }}</td>
			<td class="text-xs-right">{{ props.item.nombre }}</td>
			<td class="text-xs-right">{{ props.item.direccion }}</td>
			<td class="text-xs-right">{{ props.item.descripcion }}</td>
			<td class="text-xs-right">{{ props.item.imagenes.length }}</td>
			<td class="text-xs-right">
				<v-btn  color="yellow" @click.stop="modificar(props.item.name)">
					Modificar
				</v-btn>
				<v-btn color="red" @click.stop="borrar(props.item.name)">
					Borrar
				</v-btn>
			</td>
		</template>
	</v-data-table>
  </template>


<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { VuetifyFormRef } from '../typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import axios from 'axios';

@Component
export default class TablaResidencia extends Vue {
	public residencias: object[] = [];
	public data() {
		return {
			headers: [
				{
					text: 'ID',
					align: 'left',
					sortable: false,
					value: 'id'
				},
				{ text: 'Nombre', value: 'nombre' },
				{ text: 'Dirección', value: 'direccion' },
				{ text: 'Descripción', value: 'descripcion' },
				{ text: 'Imagenes', value: 'imagenes' }
				]
		};
	}
	public created() {
			this.fetchPosts();
	}
	public fetchPosts() {
	axios
		.get(`${server.baseURL}/residencias`)
		.then((data) => (this.residencias = data.data));
	}


	@Emit( 'modificar' )
	public modificar(name: string): void {
		// console.log('Modificar: ', name);
	}
	@Emit( 'borrar' )
	public borrar(name: string): void {
		// console.log('Borre: ', name);
	}
}
</script>