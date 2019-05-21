<template>
	<v-card class="pa-3" width="40rem">
		<v-card-title>
			<h5 class="headline">Ofertar en subasta</h5>
		</v-card-title>
		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.email"
					label="Correo electrónico"
					:rules="validadores.email"
					validate-on-blur
					hint="ejemplo@ejemplo.com"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.tarjeta"
					label="Número de tarjeta de crédito"
					:rules="validadores.tarjeta"
					validate-on-blur
					counter="16"
					hint="Los guiones se insertan automáticamente"
					mask="credit-card"
					required
				></v-text-field>
				<v-text-field
					v-model="modelo.monto"
					label="Monto"
					:rules="validadores.monto"
					:hint="'El monto no puede ser menor que ' + subasta.montoInicial"
					prefix="$"
					required
				></v-text-field>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarOferta( )">
				Cancelar
			</v-btn>
			<v-btn
				class="success"
				:disabled="!formularioEsValido"
				:loading="esperandoCreacionDeOferta"
				@click.stop="crearOferta( )"
			>
				Ofertar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import axios from 'axios';
import { Subasta } from '@/interfaces/subasta.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { Oferta, OfertaParaCrear } from '@/interfaces/oferta.interface';
import { requerido } from '@/helpers/validadores/requerido';
import { numeroNoMenorQue } from '@/helpers/validadores/numero-no-menor-que';
import { tarjetaDeCredito } from '@/helpers/validadores/tarjeta-de-credito';
import { correoElectronico } from '@/helpers/validadores/correo-electronico';
import { server } from '@/utils/helper';
import router from '@/router';
import { Route } from 'vue-router';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref';

@Component
export default class CargaDeOfertaDeSubasta extends Vue {
	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;

	/**
	 * Subasta para la que crear la oferta
	 */
	@Prop( )
	public readonly subasta!: Subasta;

	/**
	 * Flag que se activa mientras se espera la respuesta a una solicitud de creación de oferta
	 */
	public esperandoCreacionDeOferta: boolean = false;

	/**
	 * Objeto que almacena el estado de la oferta para crear de acuerdo al estado del formulario.
	 */
	public modelo: OfertaParaCrear = {
		email: '',
		tarjeta: '',
		monto: this.subasta.montoInicial
	};

	/**
	 * Conjunto de reglas de validación para cada campo del formulario de carga.
	 */
	public validadores = {
		email: [
			requerido( 'Correo electrónico' ),
			correoElectronico( 'Correo electrónico' )
		],
		tarjeta: [
			requerido( 'Número de tarjeta de crédito' ),
			tarjetaDeCredito( 'Número de tarjeta de crédito' )
		],
		monto: [
			requerido( 'Monto' ),
			numeroNoMenorQue( 'Monto', this.subasta.montoInicial )
		]
	};

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
	 * Emite el evento _ofertaCreada_ con la oferta recibida.
	 */
	@Emit( 'ofertaCreada' )
	public emitirEventoOfertaCreada( ofertaCreada: Oferta ): Oferta {
		return ofertaCreada;
	}

	/**
	 * Restablece el formulario y emite el evento _cancelacion_.
	 */
	public cancelarOferta( ): void {
		this.restablecerFormulario( );
		this.emitirEventoCancelacion( );
	}

	/**
	 * Solicita la creación de una oferta de acuerdo al estado actual del modelo.
	 *
	 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _ofertaCreada_ con la
	 * oferta creada como dato.
	 */
	public async crearOferta( ): Promise<void> {
		try {
			const url: string = `${ server.baseURL }/subastas/${ this.subasta.idSubasta }/ofertas`;
			this.esperandoCreacionDeOferta = true;
			const respuesta = await axios.post<Oferta>( url, this.modelo );
			this.esperandoCreacionDeOferta = false;
			const ofertaCreada = respuesta.data;

			this.restablecerFormulario( );
			this.emitirEventoOfertaCreada( ofertaCreada );
		}
		catch ( error ) {
			this.esperandoCreacionDeOferta = false;
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

		this.modelo.email = '';
		this.modelo.tarjeta = '';
		this.modelo.monto = this.subasta.montoInicial;

		this.formularioEsValido = false;
	}
}
</script>