<template>

	<v-data-table
		class="elevation-1"
		:headers="encabezadosDeTabla"
		:items="residencias"
	>
		<template #items="props">
			<td>{{ props.item.idResidencia }}</td>
			<td>{{ props.item.titulo }}</td>
			<td>{{ props.item.pais }}</td>
			<td>{{ props.item.provincia }}</td>
			<td>{{ props.item.localidad }}</td>
			<td>{{ props.item.domicilio }}</td>
			<td>{{ props.item.descripcion }}</td>
			<td>
				{{ props.item.fotos.length }} {{ props.item.fotos.length === 1 ? 'foto' : 'fotos' }}
			</td>
			<td>
				<v-layout row>
					<v-tooltip left open-delay="100" close-delay="0">
						<template v-slot:activator="{ on }">
							<v-btn
								flat
								icon
								class="secondary--text"
								@click.stop="modificar( props.item.id )"
								v-on="on"
							>
								<v-icon>edit</v-icon>
							</v-btn>
						</template>
						<span>Editar residencia</span>
					</v-tooltip>
					<v-tooltip left open-delay="100" close-delay="0">
						<template v-slot:activator="{ on }">
							<v-btn
								flat
								icon
								class="secondary--text"
								@click.stop="borrar( props.item.id )"
								v-on="on"
							>
								<v-icon>delete</v-icon>
							</v-btn>
						</template>
						<span>Eliminar residencia</span>
					</v-tooltip>
				</v-layout>
			</td>
		</template>
	</v-data-table>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { Residencia } from '@/interfaces/residencia.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import { server } from '@/utils/helper';

	@Component
	export default class TablaDeResidencias extends Vue {
		/**
		 * Lista de las residencias a mostrar en la tabla
		 */
		@Prop( )
		public readonly residencias!: Residencia[ ];

		/**
		 * Lista con los encabezados a mostrar en la tabla, indicado la etiqueta y el nombre del campo a mostrar
		 */
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Id',
				value: 'idResidencia'
			},
			{
				text: 'Título',
				value: 'titulo'
			},
			{
				text: 'País',
				value: 'pais'
			},
			{
				text: 'Provincia',
				value: 'provincia'
			},
			{
				text: 'Localidad',
				value: 'localidad'
			},
			{
				text: 'Domicilio',
				value: 'domicilio'
			},
			{
				text: 'Descripción',
				value: 'descripcion'
			},
			{
				text: 'Fotos',
				value: 'fotos'
			},
			{
				text: '',
				value: '',
				sortable: false
			},
		];

		@Emit( 'modificar' )
		public modificar( name: string ): void {
			// console.log('Modificar: ', name);
		}

		@Emit( 'borrar' )
		public borrar( name: string ): void {
			// console.log('Borre: ', name);
		}
	}
</script>