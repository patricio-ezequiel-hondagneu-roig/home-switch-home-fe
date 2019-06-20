<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="clientes"
			no-data-text="No hay clientes registrados en el sistema ¡Intentá más tarde!"
		>
			<template #items="props">
				<td class="text-xs-right">{{ props.item._id }}</td>
				<td class="text-xs-right">{{ props.item.nombre }}</td>
				<td class="text-xs-right">{{ props.item.apellido }}</td>
				<td class="text-xs-right">{{ props.item.fechaDeNacimiento }}</td>
				<td class="text-xs-right">{{ props.item.pais }}</td>
				<td class="text-xs-right">{{ props.item.celular }}</td>
				<td class="text-xs-right">{{ props.item.email }}</td>
				<td class="text-xs-right">{{ suscripcionPorId(props.item.idSuscripcion).tipoDeSuscripcion }}</td>
				<td>
					<v-layout row>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="eliminarCliente( props.item._id )"
									v-on="on"
								>
									<v-icon>delete</v-icon>
								</v-btn>
							</template>
							<span>Eliminar Cliente</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>
	</div>

</template>


<script lang="ts">
	import axios from 'axios';
	import { Component, Vue } from 'vue-property-decorator';
	import { Suscripcion } from '@/interfaces/suscripcion.interface';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
	import router from '@/router';

	@Component
	export default class TablaDeClientes extends Vue {
		public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
			{
				text: 'Id',
				value: '_id',
				align: 'right'
			},
			{
				text: 'Nombre',
				value: 'nombre',
				align: 'right'
			},
			{
				text: 'Apellido',
				value: 'apellido',
				align: 'right'
			},
			{
				text: 'F. de nacimiento',
				value: 'fechaDeNacimiento',
				align: 'right'
			},
			{
				text: 'País',
				value: 'pais',
				align: 'right'
			},
			{
				text: 'Celular',
				value: 'celular',
				align: 'right'
			},
			{
				text: 'Email',
				value: 'email',
				align: 'right'
			},
			{
				text: 'Tipo de subscripción',
				value: 'tipo',
				align: 'right'
			},
			{
				text: '',
				value: '',
				align: 'right',
				sortable: false
			},
		];
		/** Devuelve suscripcion segun id para saber de que tipo es la sucripcion del cliente */
		public suscripcionPorId(id: String): Suscripcion {
			return this.$store.getters.suscripcionConId(id);
		}
		public get clientes( ) {
			return this.$store.getters.clientes;
		}

		/** Elimina cliente segun la id especificada */
		public eliminarCliente( idCliente: string ): void {
			this.$store.dispatch( 'eliminarCliente', idCliente );
		}
	}
</script>