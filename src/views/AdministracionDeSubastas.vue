<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-flex align-center justify-center>
				<v-btn flat class="success" @click.stop="mostrarFormularioDeCarga( )">
					Crear Subasta
				</v-btn>
				<v-dialog persistent v-model="formularioDeCargaEsVisible" max-width="40rem">
					<CargaDeSubasta
						@subastaCreada="agregarSubasta( $event )"
						@error="mostrarError( $event )"
						@cancelacion="ocultarFormularioDeCarga( )"
					/>
				</v-dialog>
			</v-flex>
			<v-flex xs12>
				<TablaDeSubastas
					:subastas="subastas"
					@subastaModificada="modificarSubasta( $event )"
					@subastaEliminada="eliminarSubasta( $event )"
					@error="mostrarError( $event )"
				></TablaDeSubastas>
			</v-flex>
		</v-layout>

		<v-snackbar
			v-model="alertaEsVisible"
			:color="tipoDeAlerta"
			bottom
			left
			multi-line
		>
			{{ textoDeAlerta }}
			<v-btn
				flat
				@click="ocultarAlerta( )"
			>Cerrar</v-btn>
		</v-snackbar>
	</v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import CargaDeSubasta from '@/components/CargaDeSubasta.vue';
import TablaDeSubastas from '@/components/TablaDeSubastas.vue';
import { server } from '@/utils/helper';
import { Subasta } from '@/interfaces/subasta.interface';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name.d';

@Component({
	components: {
		CargaDeSubasta,
		TablaDeSubastas
	},
})
export default class AdministracionDeSubastas extends Vue {
	/**
	 * Flag que indica si se debe o no mostrar el formulario de carga.
	 */
	public formularioDeCargaEsVisible: boolean = false;

	/**
	 * Flag que indica si se debe o no mostrar la alerta.
	 */
	public alertaEsVisible: boolean = false;

	/**
	 * Valor que indica el color con el que se muestra la alerta.
	 */
	public tipoDeAlerta: VuetifyThemeOptionName = 'info';

	/**
	 * Texto a mostrar en la alerta.
	 */
	public textoDeAlerta: string = '';

	/**
	 * Lista de todas las subastas actualmente en el sistema.
	 */
	public subastas: Subasta[ ] = [ ]; // duda

	/**
	 * Hook de ciclo de vida.
	 *
	 * Carga las subastas actualmente en el sistema al instanciar el componente.
	 */
	public created( ): void {
		this.obtenerSubastas( );
	}

	/**
	 * Solicita la lista de todas las subastas actualmente en el sistema.
	 *
	 * Al recibir una respuesta de éxito, actualiza la lista de subastas del componente con las recibidas.
	 */
	public async obtenerSubastas( ): Promise<void> {
		// TODO: Agregar bloque try para el caso donde la solicitud falle

		const respuestaSubastas = await axios.get<Subasta[ ]>( `${ server.baseURL }/subastas` );
		this.subastas = respuestaSubastas.data;
	}

	/**
	 * Agrega una subasta a la lista de subastas y oculta el formulario de carga.
	 */
	public agregarSubasta( subastaCreada: Subasta ): void {
		this.subastas.push( subastaCreada );
		this.ocultarFormularioDeCarga( );
	}

	/**
	 * Modifica una subasta de la lista de subastas.
	 */
	public modificarSubasta( subastaModificada: Subasta ): void {
		this.subastas = this.subastas.map( ( _subastaActual ) => {
			return ( _subastaActual.idResidencia === subastaModificada.idResidencia )
				? subastaModificada
				: _subastaActual;
		});
	}

	/**
	 * Elimina un subasta de la lista de subastas.
	 */
	public eliminarSubasta( subastaEliminada: Subasta ): void {
		const indiceDeSubasta: number = this.subastas.findIndex( ( subasta ) => {
			return subasta.idSubasta === subastaEliminada.idSubasta;
		});

		this.subastas.splice( indiceDeSubasta, 1 );
	}

	/**
	 * Muestra un error en la alerta.
	 */
	public mostrarError( error: Error ): void {
		this.mostrarAlerta( error.message, 'error' );
	}

	/**
	 * Muestra el formulario de carga de subastas.
	 */
	public mostrarFormularioDeCarga( ): void {
		this.formularioDeCargaEsVisible = true;
	}

	/**
	 * Oculta el formulario de carga de subastas.
	 */
	public ocultarFormularioDeCarga( ): void {
		this.formularioDeCargaEsVisible = false;
	}

	/**
	 * Muestra la alerta con el texto y tipo indicados.
	 */
	public mostrarAlerta( texto: string, tipo: VuetifyThemeOptionName ): void {
		this.textoDeAlerta = texto;
		this.tipoDeAlerta = tipo;
		this.alertaEsVisible = true;
	}

	/**
	 * Oculta la alerta.
	 */
	public ocultarAlerta( ): void {
		this.textoDeAlerta = '';
		this.tipoDeAlerta = 'info';
		this.alertaEsVisible = false;
	}
}
</script>