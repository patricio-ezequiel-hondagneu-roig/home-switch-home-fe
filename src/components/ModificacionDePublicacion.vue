 <template>
	<v-card class="pa-3">

		<v-card-title>
			<h5 class="headline">Modificar publicación</h5>
		</v-card-title>

		<v-card-text>
			<v-form v-model="formularioEsValido" ref="formulario">
				<v-text-field
					v-model="modelo.montoInicialDeSubasta"
					label="Monto inicial de subasta"
					required
				></v-text-field>

				<v-text-field
					v-model="modelo.fechaDeInicioDeSemana"
					label="Fecha de inicio de semana"
					:rules="validadores.fechaDeInicioDeSemana"
					required
					type="date"
				></v-text-field>

			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn flat @click.stop="cancelarModificacion( )">
				Cancelar
			</v-btn>
			<v-btn
				class="success"
				:loading="esperandoModificacionDePublicacion"
				:disabled="!formularioEsValido"
				@click.stop="modificarPublicacion( )"
			>
				Modificar
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import axios from 'axios';
	import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
	import { requerido } from '@/helpers/validadores/requerido';
	import { textoNoVacio } from '@/helpers/validadores/texto-no-vacio';
	import { numeroNoNegativo } from '@/helpers/validadores/numero-no-negativo';
	import router from '@/router';
	import { VuetifyFormRef } from '@/typings/vuetify-form-ref.d';
	import { server } from '@/utils/helper';
	import { Publicacion, PublicacionParaModificar } from '../interfaces/publicacion.interface';
	import moment from 'moment';
import { fechaEsPosteriorQue } from '../helpers/validadores/fecha-es-posterior-que';
import { fechaEsFutura } from '../helpers/validadores/fecha-es-futura';

	@Component
	export default class ModificacionDePublicacion extends Vue {
		public formulario: VuetifyFormRef | null = null;
		public formularioEsValido: boolean = false;

		/**
		 * Publicacion para modificar.
		 */
		@Prop( )
		public readonly publicacion!: Publicacion;

		/**
		 * Flag que se activa mientras se espera la respuesta a una solicitud de modificación de publicacion.
		 */
		public esperandoModificacionDePublicacion: boolean = false;

		/**
		 * Objeto que almacena el estado de la publicacion para modificar de acuerdo al estado del formulario.
		 */
		public modelo: PublicacionParaModificar = {
			montoInicialDeSubasta: this.publicacion.montoInicialDeSubasta,
			fechaDeInicioDeSemana: moment( this.publicacion.fechaDeInicioDeSemana ).format( 'YYYY-MM-DD' ),
			cerroSubasta: this.publicacion.cerroSubasta,
		};

		// TODO -> Validadores
		public validadores = {
			fechaDeInicioDeSemana: [
				fechaEsFutura( 'Fecha de inicio de semana' )
			]
		};

		/**
		 * Hook de ciclo de vida. Restablece el formulario antes de que el componente se monte en el DOM.
		 */
		public beforeMount( ): void {
			this.restablecerFormulario( );
		}

		/**
		 * Hook de ciclo de vida. Guarda la referencia al formulario de modificación.
		 */
		public beforeUpdate( ): void {
			if ( this.formulario === null ) {
				this.formulario = this.$refs.formulario as unknown as VuetifyFormRef;
			}
		}

		/**
		 * Emite el evento _cancelacion_.
		 */
		@Emit( 'cancelacion' )
		public emitirEventoCancelacion( ): void { }

		/**
		 * Emite el evento _publicacionModificada_.
		 */
		@Emit( 'publicacionModificada' )
		public emitirEventoPublicacionModificada( ): void { }

		/**
		 * Restablece el formulario y emite el evento _cancelacion_.
		 */
		public cancelarModificacion( ): void {
			this.restablecerFormulario( );
			this.emitirEventoCancelacion( );
		}

		/**
		 * Solicita la modificación de una publicacion de acuerdo al estado actual del modelo.
		 *
		 * Al recibir la respuesta de éxito restablece el formulario y emite el evento _publicacionModificada_.
		 */
		public async modificarPublicacion( ): Promise<void> {
			this.esperandoModificacionDePublicacion = true;

			// Transformo la fecha de comienzo de semana con moment js
			this.modelo.fechaDeInicioDeSemana = moment(this.modelo.fechaDeInicioDeSemana).utc().toISOString();

			await this.$store.dispatch( 'modificarPublicacion', {
				_id: this.publicacion._id,
				publicacionParaModificar: this.modelo,
			});

			this.esperandoModificacionDePublicacion = false;

			this.restablecerFormulario( );
			this.emitirEventoPublicacionModificada( );
		}

		/**
		 * Restablece el formulario a su estado inicial.
		 */
		public restablecerFormulario( ): void {
			if ( this.formulario !== null ) {
				this.formulario.resetValidation( );
			}

			this.modelo.montoInicialDeSubasta = this.publicacion.montoInicialDeSubasta;
			this.modelo.fechaDeInicioDeSemana = moment( this.publicacion.fechaDeInicioDeSemana ).format('YYYY-MM-DD');
			this.modelo.cerroSubasta = this.publicacion.cerroSubasta;

			this.formularioEsValido = false;
		}
	}
</script>
