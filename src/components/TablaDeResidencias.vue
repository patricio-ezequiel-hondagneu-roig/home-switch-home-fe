<template>

	<div>
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
									@click.stop="mostrarFormularioDeModificacion( props.item.idResidencia )"
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
									@click.stop="eliminarResidencia( props.item.idResidencia )"
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

		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDeResidencia
				v-if="residenciaParaModificar !== null"
				:residencia="residenciaParaModificar"
				@residenciaModificada="modificarResidencia( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
	</div>

</template>


<script lang="ts">
import axios from 'axios';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Residencia, ResidenciaParaModificar } from '@/interfaces/residencia.interface';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import { server } from '@/utils/helper';
import ModificacionDeResidencia from './ModificacionDeResidencia.vue';

@Component({
	components: {
		ModificacionDeResidencia
	}
})
export default class TablaDeResidencias extends Vue {
	/**
	 * Lista de las residencias a mostrar en la tabla
	 */
	@Prop( )
	public readonly residencias!: Residencia[ ];

	/**
	 * Flag que indica si se debe o no mostrar el formulario de modificación.
	 */
	public formularioDeModificacionEsVisible: boolean = false;

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

	/**
	 * Variable que almacena una residencia mientras está siendo modificada, es _null_ en cualquier otro caso.
	 */
	public residenciaParaModificar: Residencia | null = null;

	/**
	 * Emite el evento _residenciaModificada_ con la residencia recibida.
	 */
	@Emit( 'residenciaModificada' )
	public emitirEventoResidenciaModificada( residenciaModificada: Residencia ): Residencia {
		return residenciaModificada;
	}

	/**
	 * Emite el evento _residenciaEliminada_ con la residencia recibida.
	 */
	@Emit( 'residenciaEliminada' )
	public emitirEventoResidenciaEliminada( residenciaEliminada: Residencia ): Residencia {
		return residenciaEliminada;
	}

	/**
	 * Oculta el formulario de modificación de residencias y emite el evento _residenciaModificada_ con la
	 * residencia modificada como dato.
	 */
	public modificarResidencia( residencia: Residencia ): void {
		this.emitirEventoResidenciaModificada( residencia );
		this.ocultarFormularioDeModificacion( );
	}

	/**
	 * Solicita la eliminación de la residencia con el ID recibido.
	 *
	 * Al recibir la respuesta de éxito emite el evento _residenciaModificada_ con la residencia eliminada como dato.
	 *
	 * Falla en caso de que no exista residencia con el ID recibido.
	 */
	public async eliminarResidencia( idResidencia: string ): Promise<void> {
		const residencia: Residencia | undefined = this.residencias.find( ( _residencia ) => {
			return _residencia.idResidencia === idResidencia;
		});

		if ( residencia === undefined ) {
			throw new Error( `No existe ninguna residencia con ID "${ idResidencia }"` );
		}

		// TODO: Agregar un bloque try para el caso en el que la solicitud falle.

		const url: string = `${ server.baseURL }/residencias/${ residencia.idResidencia }`;
		await axios.delete( url );

		this.emitirEventoResidenciaEliminada( residencia );
	}

	/**
	 * Muestra el formulario de modificación de residencias para la residencia con un ID dado.
	 */
	public mostrarFormularioDeModificacion( idResidencia: string ): void {
		const residencia: Residencia | undefined = this.residencias.find( ( _residencia ) => {
			return _residencia.idResidencia === idResidencia;
		});

		if ( residencia === undefined ) {
			throw new Error( `No existe ninguna residencia con ID "${ idResidencia }"` );
		}

		this.residenciaParaModificar = residencia;

		this.formularioDeModificacionEsVisible = true;
	}

	/**
	 * Oculta el formulario de modificación de residencias.
	 */
	public ocultarFormularioDeModificacion( ): void {
		this.formularioDeModificacionEsVisible = false;
		this.residenciaParaModificar = null;
	}
}
</script>