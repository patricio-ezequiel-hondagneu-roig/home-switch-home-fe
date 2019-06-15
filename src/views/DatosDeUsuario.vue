<template>
	<content>
		<v-layout column align-center>
			<v-card
			width="500"
			class="mt-5"
			>
				<v-layout column align-center>
					<v-flex title mt-2>
						Datos Personales - {{idDeUsuario}}
					</v-flex>
				</v-layout>
				<v-layout column align-start ml-2>
					<v-flex subheading font-weight-bold ml-1>
						Info de Cliente
					</v-flex>
					<v-flex class="body-1" ml-2 mt-1>
						Nombre completo: {{	}} {{cliente.apellido}}<br>
						Email: {{cliente.email}}<br>
						F.nac: {{cliente.fechaDeNacimiento}}<br>
						Calular: {{cliente.celular}}<br>
						País: {{cliente.pais}}<br>
						Nro. T.Credito: ****-****-****-{{cliente.tarjetaDeCredito.substr(-4)}}
					</v-flex>
				</v-layout>
				<v-layout column align-end>
					<v-flex ma-1>
						<v-btn
							color="primary"
							@click.stop="mostrarFormularioDeModificacion()"
						>
						Modificar
						</v-btn>
					</v-flex>
				</v-layout>
			</v-card>
		</v-layout>
		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDeDatosDeCliente
				:cliente="cliente"
				@infoModificada="modificarInfo( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
	</content>
</template>
<script lang="ts">
import { Component, Vue , Prop , Emit } from 'vue-property-decorator';
import ModificacionDeDatosDeCliente from '@/components/ModificacionDeDatosDeCliente.vue';
import { Cliente } from '../interfaces/cliente.interface';
@Component({
	components: {
		ModificacionDeDatosDeCliente,
	}
})
export default class DatosDeUsuario extends Vue {
	/* parametro que le llega a DatosDeUsuario por prop */
	@Prop({ default: undefined })
		public readonly idDeUsuario!: string;
	/* pseudo interfaz de usuario con sus atributos */
	public cliente: Cliente = {
		_id: this.idDeUsuario,
		idSuscripcion: '0',
		nombre: 'Juan',
		apellido: 'Perez',
		email: 'juanperez@gmail.com',
		contraseña: '12345',
		fechaDeNacimiento: '1994/01/03',
		celular: '2215628189',
		pais: 'Argentina',
		tarjetaDeCredito: '0000000000001234',
		codigoDeSeguridad: '0012',
		fechaDeExpiracion: '2020/01/05',
		creditos: []
	};
	/* variable que ayuda a que se muestre o no ventana dialog de modificación */
	public formularioDeModificacionEsVisible = false;
	/* Cuando se crea instancia de DatosDeUsuario se va a buscar usuario segun su id */

	/* Muestra formulario de modificación de datos de usuario*/
	public mostrarFormularioDeModificacion( ): void {
		this.formularioDeModificacionEsVisible = true;
	}
	/* Oculta formulario de modificación de datos de usuario*/
	public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
	}
	/* Eventos
	 * Emitidos por ModificacionDeDatosDeUsuario
	 * El siguiente es emitido al modificar info de usuario
	 */
	@Emit( 'infoModificada' )
		public emitirEventoInfoModificada( ): void { }
	/* El siguiente es emitido al tener algun tipo de error, luego se muestra */
	@Emit( 'error' )
		public emitirEventoError( error: Error ): Error {
			return error;
		}
	/* metodo que modifica info de Usuario */
	public modificarInfo( usuario: Cliente ): void {
		this.emitirEventoInfoModificada( );
		this.ocultarFormularioDeModificacion( );
	}

	public get perfil( ): Cliente {
		return this.$store.getters.perfil;
	}
}
</script>
