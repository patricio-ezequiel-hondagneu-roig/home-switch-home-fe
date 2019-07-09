<template>
	<div>
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:header>
					<div class="font-weight-bold headline sombra-texto">Reservas Directas</div>
				</template>
				<v-card>
					<v-card-text>
						<v-data-table
							:headers="encabezadosDeTabla"
							:items="publicaciones"
							class="elevation-1"
							no-data-text="No hay publicaciones en el sistema."
						>
							<template #items="props">
								<td class="text-xs-right">{{ props.item._id }}</td>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Publicacion } from '@/interfaces/publicacion.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';

@Component
export default class ReservasDirectasActivas extends Vue {
	public get publicaciones( ): Publicacion[ ] {
		return this.$store.getters.publicaciones;
	}

	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Id',
			value: '_id',
			align: 'right'
		},
	];

	public created( ): void {
		this.actualizarPublicaciones( );
	}

	public async actualizarPublicaciones( ): Promise<void> {
		await this.$store.dispatch( 'obtenerPublicaciones' );
	}
}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
