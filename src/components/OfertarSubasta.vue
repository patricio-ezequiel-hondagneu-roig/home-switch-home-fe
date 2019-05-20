<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<v-card class="pa-3" width="40rem">
				<v-card-title>
					<h5 class="headline">Ofertar por subasta</h5>
				</v-card-title>
				<v-card-text>
					<v-form v-model="formularioEsValido" ref="formulario">
						<v-text-field
							v-model="modelo.email"
							label="Email"
							:rules="validadores.email"
							required
						></v-text-field>
						<v-text-field
							v-model="modelo.tarjeta"
							label="Número de tarjeta de crédito"
							:rules="validadores.tarjeta"
							required
						></v-text-field>
						<v-text-field
							v-model="modelo.monto"
							label="Monto"
							:rules="validadores.monto"
							required
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn flat @click.stop="cancelarOferta( )">
						Cancelar
					</v-btn>
					<v-btn class="success" :disabled="!formularioEsValido" @click.stop="crearOferta( )">
						Ofertar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-layout>
	</v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import axios from 'axios';
import { Subasta } from '@/interfaces/subasta.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { Oferta } from '@/interfaces/oferta.interface';
import { requerido } from '@/helpers/validadores/requerido';
import { noMenorQue } from '@/helpers/validadores/noMenorQue';
import { server } from '@/utils/helper';
import router from '@/router';
import { Route } from 'vue-router';
import { VuetifyThemeOptionName } from '@/typings/vuetify-theme-option-name';
import { VuetifyFormRef } from '@/typings/vuetify-form-ref';

@Component
export default class OfertarSubasta extends Vue{
	@Prop()
	public readonly subasta!: Subasta;

	public formulario: VuetifyFormRef | null = null;
	public formularioEsValido: boolean = false;
	public modelo: Oferta = {
		idOferta: '',
		email: '',
		tarjeta: '',
		monto: ''
	};

	public validadores = {
		email:      [ requerido( 'Email' ) ],
		tarjeta:        [ requerido( 'Tarjeta' ) ],
		monto:   [ requerido( 'Monto' ) , noMenorQue('Monto', this.subasta.montoInicial ) ]
	};

	public beforeMount( ): void {
		this.restablecerFormulario( );
	}
	public beforeUpdate( ): void {
		if ( this.formulario === null ) {
			this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
		}
	}

	@Emit( 'cancelacion' )
	public emitirEventoCancelacion( ): void { }

	@Emit( 'ofertaCreada' )
	public emitirEventoOfertaCreada( ) { }

	public cancelarOferta( ): void {
		this.restablecerFormulario( );
		this.emitirEventoCancelacion( );
	}

	public async crearOferta( ): Promise<void> {
		// TODO: Agregar un bloque try para el caso en el que la solicitud falle.

		const url: string = `${ server.baseURL }/subastas/ofertas/${this.subasta.idSubasta}`;
		const respuesta = await axios.post<Oferta>( url, this.modelo );
		const ofertaCreada = respuesta.data;

		this.restablecerFormulario( );
		this.emitirEventoOfertaCreada( );
	}


	public restablecerFormulario( ): void {
		if ( this.formulario !== null ) {
			this.formulario.resetValidation( );
		}

		this.modelo.idOferta = '';
		this.modelo.email = '';
		this.modelo.tarjeta = '';
		this.modelo.monto = '';
		this.formularioEsValido = false;
	}
}
</script>