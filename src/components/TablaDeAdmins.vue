<template>
	<v-container>
		<v-data-table
			width="500"
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="clientes"
			no-data-text="No hay clientes registrados en el sistema ¡Intentá más tarde!"
		>
			<template #items="props">
				<td class="text-xs-right">
					<v-tooltip v-if="props.item.esAdmin" left open-delay="100" close-delay="0">
						<template v-slot:activator="{ on }">
							<v-btn
							flat
							icon
							v-on="on"
							>
								<v-icon large color="orange darken-2">supervisor_account</v-icon>
							</v-btn>
						</template>
						<span>Admin</span>
					</v-tooltip>
					<v-tooltip v-if="!props.item.esAdmin" left open-delay="100" close-delay="0">
						<template v-slot:activator="{ on }">
							<v-btn
							flat
							icon
							v-on="on"
							>
								<v-icon>person</v-icon>
							</v-btn>
						</template>
						<span>Cliente</span>
					</v-tooltip>
				</td>
				<td class="text-xs-left">{{ props.item.nombre }} {{ props.item.apellido }}</td>
				<td class="text-xs-left">{{ props.item.email }}</td>
				<td>
					<v-layout row>
						<v-tooltip left open-delay="100" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-btn
									flat
									icon
									class="secondary--text"
									@click.stop="modificarPermisos( props.item )"
									v-on="on"
								>
									<v-icon>{{ props.item.esAdmin ? 'person_add_disabled' : 'person_add' }}</v-icon>
								</v-btn>
							</template>
							<span>{{ props.item.esAdmin ? 'Quitar' : 'Dar' }} permisos</span>
						</v-tooltip>
					</v-layout>
				</td>
			</template>
		</v-data-table>
	</v-container>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import router from '@/router';
import moment from 'moment';
import { Cliente } from '../interfaces/cliente.interface';

@Component
export default class TablaDeClientes extends Vue {
	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: '',
			value: '',
			align: 'right'
		},
		{
			text: 'Nombre y apellido',
			value: 'nombre completo',
			align: 'left'
		},
		{
			text: 'Email',
			value: 'email',
			align: 'left'
		},
		{
			text: 'Permisos',
			value: '',
			sortable: false
		},
	];
	public created( ) {
		this.actualizarClientes();
	}
	// actualizar clientes de la base de datos
	public actualizarClientes( ) {
		this.$store.dispatch( 'obtenerClientes' );
	}
	/** Dar permisos de admin */
	public async modificarPermisos( cliente: Cliente  ): Promise<void> {
		cliente = { ...cliente, esAdmin: !cliente.esAdmin };
		await this.$store.dispatch( 'modificarPerfil', {
			idCliente: cliente._id,
			clienteParaModificar: { ...cliente , _id: undefined }
		});
	}
	/** obtener clientes */
	public get clientes(): Cliente[ ] {
		return this.$store.getters.clientes;
	}
}
</script>