 <template>

	<v-data-table
		:headers="headers"
		:items="residencias"
		class="elevation-1">
		<template v-slot:items="props">
			<td  class="text-xs-right">{{ props.item.idResidencia }}</td>
			<td class="text-xs-right">{{ props.item.nombre }}</td>
			<td class="text-xs-right">{{ props.item.direccion }}</td>
			<td class="text-xs-right">{{ props.item.descripcion }}</td>
			<td class="text-xs-right">{{ props.item.imagenes.length }}</td>
			<td class="text-xs-right">
				<v-btn color="yellow" @click.stop="mostrarFormularioDeModificacion( )">
					Modificar
				</v-btn>
				<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
					<CargarResidencia props.item.idResidencia props.item.nombre props.item.direccion props.item.descripcion props.item.imagenes
						@cargar="ocultarFormularioDeModificacion( )"
						@cancelar="ocultarFormularioDeModificacion( )"
					/>
				</v-dialog>
				<v-btn color="red" @click.stop="borrar(props.item.idResidencia)">
					Borrar
				</v-btn>
			</td>
		</template>
	</v-data-table>
  </template>


<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { VuetifyFormRef } from '../typings/vuetify-form-ref.d';
import CargarResidencia from '@/components/CargarResidencia.vue';
import { server } from '@/utils/helper';
import axios from 'axios';
@Component({
		components: {
			CargarResidencia
		},
})
export default class TablaResidencia extends Vue {
	public formularioDeModificacionEsVisible = false;
	public residencias: object[] = [];
	public data() {
		return {
			headers: [
				{
					text: 'ID',
					align: 'left',
					// sortable: false,
					value: 'idResidencia'
				},
				{ text: 'Nombre', value: 'nombre' },
				{ text: 'Dirección', value: 'direccion' },
				{ text: 'Descripción', value: 'descripcion' },
				{ text: 'Imagenes', value: 'imagenes' },
				{
					text: 'Acciones',
					align: 'right',
					sortable: false,
				},
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

	public modificar(name: string): void {
		// console.log('Modificar: ', name);
	}
	public borrar(id: string): void {
		// console.log('Borre: ', id);
		axios.delete(`${server.baseURL}/residencias/${id}`).then((data) => {
			// console.log(data);
			window.location.reload();
		});
	}
	/** Muestra el formulario de carga de residencias */
		public mostrarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = true;
		}

		/** Oculta el formulario de carga de residencias */
		public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
		}
}
</script>