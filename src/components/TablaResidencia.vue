 <template>

	<v-data-table
		:headers="headers"
		:items="desserts"
		class="elevation-1">
		<template v-slot:items="props">
			<td>{{ props.item.name }}</td>
			<td class="text-xs-right">{{ props.item.calories }}</td>
			<td class="text-xs-right">{{ props.item.fat }}</td>
			<td class="text-xs-right">{{ props.item.carbs }}</td>
			<td class="text-xs-right">{{ props.item.protein }}</td>
			<td class="text-xs-right">{{ props.item.iron }}</td>
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
					text: 'Dessert (100g serving)',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Calories', value: 'calories' },
				{ text: 'Fat (g)', value: 'fat' },
				{ text: 'Carbs (g)', value: 'carbs' },
				{ text: 'Protein (g)', value: 'protein' },
				{ text: 'Iron (%)', value: 'iron' }
				],
			desserts: [
				{
					name: 'Frozen Yogurt',
					calories: 159,
					fat: 6,
					carbs: 24,
					protein: 4,
					iron: '1%'
				},
				{
					name: 'Ice cream sandwich',
					calories: 237,
					fat: 9,
					carbs: 37,
					protein: 4.3,
					iron: '1%'
				},
				{
					name: 'Eclair',
					calories: 262,
					fat: 16,
					carbs: 23,
					protein: 6,
					iron: '7%'
				}
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