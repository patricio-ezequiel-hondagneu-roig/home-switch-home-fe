<template>
	<v-card class="pa-3">
		<v-card-title>
			<h5 class="headline">Cargar subasta</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-select
					v-model="modelo.idResidencia"
					:items="residencias"
					item-value="idResidencia"
					label="Residencia"
					no-data-text="No hay residencias para mostrar"
					:rules="validadores.residencia"
					required
				>
					<template #selection="{ item }">
						{{ item.titulo }}
					</template>
					<template #item="{ item }">
						{{ item.titulo }}
						<span class="ml-1 caption font-italic">&mdash; {{ ubicacionDeResidencia( item ) }}</span>
					</template>
				</v-select>

				<v-text-field
					v-model="modelo.montoInicial"
					label="Monto inicial"
					:rules="validadores.montoInicial"
					hint="El monto no puede ser negativo"
					prefix="$"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeInicio"
					label="Fecha de comienzo de reserva"
					:rules="validadores.fechaDeInicio"
					type="date"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeFin"
					label="Fecha de fin de reserva"
					:rules="validadores.fechaDeFin"
					type="date"
					required
				></v-text-field>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarCarga( )">
				Cancelar
			</v-btn>
			<v-btn
				color="success"
				:loading="esperandoCreacionDeSubasta"
				:disabled="!formularioEsValido"
				@click.stop="crearSubasta( )"
			>
				Cargar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue, Emit } from 'vue-property-decorator';
import { requerido } from '@/helpers/validadores/requerido';
import router from '@/router';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
import { server } from '@/utils/helper';
import { Subasta, SubastaParaCrear } from '../interfaces/subasta.interface';
import { numeroNoNegativo } from '../helpers/validadores/numero-no-negativo';
import { Residencia } from '../interfaces/residencia.interface';

@Component
export default class CargaDeSubasta extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	/**
	 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de subasta
	 */
	public esperandoCreacionDeSubasta: boolean = false;

	/**
	 * Contiene las residencias existentes
	 */
	public residencias: Residencia[ ] = [ ];

	/**
	 * Objeto que almacena el estado de la subasta para crear de acuerdo al estado del formulario.
	 */
	public modelo: SubastaParaCrear = {
		idResidencia: '',
		montoInicial: 0,
		fechaDeInicio: '',
		fechaDeFin: ''
	};

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		residencia: [
			requerido( 'Residencia' )
		],
		montoInicial: [
			requerido( 'Monto inicial' ),
			numeroNoNegativo( 'Monto inicial' )
		],
		fechaDeInicio: [
			requerido( 'Fecha comienzo de reserva' )
		],
		fechaDeFin: [
			requerido( 'Fecha de fin de reserva' )
		],
	};

	/**
	 * Retorna un texto con la localidad, provincia y país de una residencia dada.
	 */
	public ubicacionDeResidencia = ( residencia: Residencia ): string => {
		const { domicilio, localidad, provincia, pais } = residencia;
		return `${ domicilio }, ${ localidad }, ${ provincia }, ${ pais }`;
	}

	/**
	 * Hook de ciclo de vida.
	 *
	 * Solicita las residencias para seleccionar en el formulario de carga
	 */
	public created( ): void {
		this.obtenerResidencias( );
	}

	/**
	 * Solicita las residencias existentes para que sean seleccionables al crear una subasta.
	 */
	public async obtenerResidencias( ): Promise<void> {
		try {
			const respuestaResidencias = await axios.get<Residencia[ ]>( `${ server.baseURL }/residencias` );
			this.residencias = respuestaResidencias.data;
		}
		catch ( error ) {
			this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: ( error.response !== undefined )
					? error.response.data.message
					: 'Ocurrió un error al conectarse al servidor'
			});
		}
	}

	/**
	 * Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM.
	 */
	public beforeMount( ): void {
		this.restablecerFormulario( );
	}

	/**
	 * Hook de ciclo de vida. Guarda la referencia al formulario de carga.
	 */
	public beforeUpdate( ): void {
		if ( this.formulario === null ) {
			this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
		}
	}

	/**
	 * Emite el evento cancelacion.
	 */
	@Emit( 'cancelacion' )
	public emitirEventoCancelacion( ): void { }

	/**
	 * Emite el evento _subastaCreada_ con la subasta recibida.
	 */
	@Emit( 'subastaCreada' )
	public emitirEventoSubastaCreada( subastaCreada: Subasta ): Subasta {
		return subastaCreada;
	}

	/**
	 * Emite el evento _error_ con el error recibido.
	 */
	@Emit( 'error' )
	public emitirEventoError( error: Error ): Error {
		return error;
	}

	/**
	 * Restablece el formulario y emite el evento _cancelar_.
	 */
	public cancelarCarga( ): void {
		this.restablecerFormulario( );
		this.emitirEventoCancelacion( );
	}

	/**
	 * Solicita la creación de una subasta de acuerdo al estado actual del modelo.
	 *
	 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _subastaCreada_ con la
	 * subasta creada como dato.
	 */
	public async crearSubasta( ): Promise<void> {
		try {
			const url: string = `${ server.baseURL }/subastas`;
			this.esperandoCreacionDeSubasta = true;
			const respuesta = await axios.post<Subasta>( url, this.modelo );
			this.esperandoCreacionDeSubasta = false;
			const subastaCreada = respuesta.data;

			this.restablecerFormulario( );
			this.emitirEventoSubastaCreada( subastaCreada );
		}
		catch ( error ) {
			this.esperandoCreacionDeSubasta = false;
			this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: ( error.response !== undefined )
					? error.response.data.message
					: 'Ocurrió un error al conectarse al servidor'
			});
		}
	}

	/**
	 * Restablece el formulario a su estado inicial.
	 */
	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.modelo.idResidencia  = '';
		this.modelo.montoInicial  = 0;
		this.modelo.fechaDeInicio = '';
		this.modelo.fechaDeFin    = '';

		this.formularioEsValido = false;
	}
}
</script>