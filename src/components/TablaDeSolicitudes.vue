<template>

	<div>
		<v-data-table
			class="elevation-1"
			:headers="encabezadosDeTabla"
			:items="solicitudes"
			no-data-text="No hay clientes registrados en el sistema ¡Intentá más tarde!"
		>
			<template #items="props">
				<template v-if="clienteConId(props.item.idCliente) && suscripcionPorId(clienteConId(props.item.idCliente).idSuscripcion)">
					<td >
						{{ clienteConId(props.item.idCliente).nombre }} {{ clienteConId(props.item.idCliente).apellido }}
					</td>
					<td>
						{{ suscripcionPorId(clienteConId(props.item.idCliente).idSuscripcion).tipoDeSuscripcion }}
					</td>
					<td>
						{{ suscripcionPorId(clienteConId(props.item.idCliente).idSuscripcion).monto }}
					</td>
					<td>
						<v-layout row>
							<v-tooltip left open-delay="100" close-delay="0">
								<template v-slot:activator="{ on }">
									<v-btn
										flat
										icon
										class="secondary--text"
										@click.stop="confirmar(props.item)"
										v-on="on"
									>
									<v-icon>thumb_up_alt</v-icon>
									</v-btn>
								</template>
								<span>Confirmar</span>
							</v-tooltip>
							<v-tooltip left open-delay="100" close-delay="0">
								<template v-slot:activator="{ on }">
									<v-btn
										flat
										icon
										class="secondary--text"
										@click.stop="denegar(props.item)"
										v-on="on"
									>
									<v-icon>thumb_down_alt</v-icon>
									</v-btn>
								</template>
								<span>Denegar</span>
							</v-tooltip>
						</v-layout>
					</td>
				</template>
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
import moment from 'moment';
import { Cliente, ClienteParaModificar } from '../interfaces/cliente.interface';
import { Solicitud } from '../interfaces/solicitud.interface';

@Component
export default class TablaDeSolicitudes extends Vue {
	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Nombre',
			value: 'nombre',
			align: 'left',
		},
		{
			text: 'Plan',
			value: 'plan',
			align: 'left',
		},
		{
			text: 'Paga',
			value: 'paga',
			align: 'left',
			sortable: false
		},
		{
			text: '',
			value: '',
			align: 'left',
			sortable: false
		},
	];
	/** Devuelve suscripcion segun id para saber de que tipo es la sucripcion del cliente */
	public suscripcionPorId(id: String): Suscripcion {
		return this.$store.getters.suscripcionConId(id);
	}
	/** obtener solicitudes */
	public get solicitudes(): Solicitud[ ] {
		return this.$store.getters.solicitudes;
	}
	public clienteConId( idCliente: string) {
		return this.$store.getters.clienteConId(idCliente);
	}
	public async confirmar( solicitud: Solicitud ) {
		const cliente: Cliente = this.clienteConId(solicitud.idCliente);
		if ( this.suscripcionPorId(cliente.idSuscripcion).tipoDeSuscripcion === 'Premium' ) {
			cliente.idSuscripcion = this.$store.getters.obtenerSuscripcionRegular;
		} else {
			cliente.idSuscripcion = this.$store.getters.obtenerSuscripcionPremium;
		}
		await this.$store.dispatch( 'modificarCliente' , {
			_id: cliente._id ,
			cliente });
		await this.$store.dispatch( 'eliminarSolicitud' , solicitud._id );
	}
	public denegar( solicitud: Solicitud ) {
		this.$store.dispatch( 'eliminarSolicitud' , solicitud._id );
	}
}
</script>