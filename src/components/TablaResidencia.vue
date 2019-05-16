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

@Component
export default class TablaResidencia extends Vue {
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
				],
			residencias: [
				{
					id: 0,
					nombre: 'Hotel 1',
					direccion: 'Calle falsa, 123',
					descripcion: 'Un hotel',
					imagenes: ['unaImagen', 'unaImagen', 'unaImagen']
				},
				{
					id: 1,
					nombre: 'Hotel 2',
					direccion: 'Calle falsa, 124',
					descripcion: 'Un hotel 2',
					imagenes: ['unaImagen', 'unaImagen']
				},
				{
					id: 2,
					nombre: 'Hotel 3',
					direccion: 'Calle falsa, 126',
					descripcion: 'Un hotel 3 y su descripcion execivamente larga para testear la tabla, ok?',
					imagenes: ['unaImagen']
				},
		]
		};
	}
	@Emit( 'modificar' )
	public modificar(name: string): void {
	}
	@Emit( 'borrar' )
	public borrar(name: string): void {
	}
}
</script>