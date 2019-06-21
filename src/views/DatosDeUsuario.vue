<template>
	<v-container grid-list-{xs through xl}>
		<v-layout row wrap>
			<v-flex>
				<v-card
				v-if="perfil !== null"
				width="500"
				class="ma-1"
				>
					<v-layout column align-center ma-1>
						<v-flex subheading  font-weight-black mt-2 ml-1>
							Info de Cuenta
						</v-flex>
					</v-layout>
					<hr class="ma-1">
					<v-layout column ml-2>
						<v-flex subheading  font-weight-black ml-1>
							Info personal y de contacto
						</v-flex>
						<v-layout row>
							<v-layout column class="body-1 font-weight-medium" ml-2 mt-1>
								<v-flex ma-1>
									Nombre completo:
								</v-flex>
								<v-flex ma-1>
									Fecha de nacimiento:
								</v-flex>
								<v-flex ma-1>
									País:
								</v-flex>
								<v-flex ma-1>
									Calular:
								</v-flex>
								<v-flex ma-1>
									Email:
								</v-flex>
							</v-layout>
							<v-layout column class="body-1" mr-2 mt-1 align-end>
								<v-flex ma-1>
									{{	perfil.nombre }} {{ perfil.apellido }}
								</v-flex>
								<v-flex ma-1>
									{{ fechaNac }}
								</v-flex>
								<v-flex ma-1>
									{{ perfil.pais }}
								</v-flex>
								<v-flex ma-1>
									{{ perfil.celular }}
								</v-flex>
								<v-flex ma-1>
									{{ perfil.email }}
								</v-flex>
							</v-layout>
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
						<hr class="ma-3">
						<v-flex subheading  font-weight-black ml-1>
							Tarjeta de crédito
						</v-flex>
						<v-layout row>
							<v-layout column class="body-1 font-weight-medium" ml-2 mt-1>
								<v-flex ma-1>
									Nro. de tarjeta de Crédito:
								</v-flex>
								<v-flex ma-1>
									Fecha de expiracion:
								</v-flex>
							</v-layout>
							<v-layout column class="body-1" mr-2 mt-1 align-end>
								<v-flex ma-1>
									**** - **** - **** - {{perfil.tarjetaDeCredito.substr(-4)}}
								</v-flex>
								<v-flex ma-1>
									{{fechaExp}}
								</v-flex>
							</v-layout>
						</v-layout>
						<v-layout column align-end>
							<v-flex ma-1>
								<v-btn
									color="primary"
									@click.stop="mostrarFormularioDeModificacionTarjeta()"
								>
								Modificar
								</v-btn>
							</v-flex>
						</v-layout>
					</v-layout>
				</v-card>
			</v-flex>
			<v-flex>
				<v-card
				class="ma-1"
				width="200"
				>
					<v-layout column align-center>
						<v-flex align-center mt-5 class="body-1 font-weight-medium">
							Tipo de cuenta
						</v-flex>

						<v-flex align-center mt-1 class="title font-weight-black">
							<span v-if="suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion === 'Premcium'" color="#FFC21E">
								{{suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion}}
							</span>
							<span v-if="suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion === 'Regular'">
								{{suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion}}
							</span>
						</v-flex>

						<v-flex mt-1 mb-4>
							<v-btn
								v-if="(solicitudPorId(perfil._id) === null) && (suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion !== 'Premium')"
								color="#FFC21E"
								@click.stop=" procesarSolicitud( perfil._id )"
							>
								Solicitar promoción
							</v-btn>
							<v-btn
								v-if="(solicitudPorId(perfil._id) === null) && (suscripcionPorId(perfil.idSuscripcion).tipoDeSuscripcion !== 'Regular')"
								color="red"
								@click.stop="procesarSolicitud( perfil._id )"
							>
								Baja de premium
							</v-btn>
							<v-btn
								v-if="(solicitudPorId(perfil._id) !== null)"
								color="green"
								disabled
							>
								Espere confirmación
							</v-btn>
						</v-flex>
						<v-flex class="body-1 font-weight-medium">
							Actualmente esta pagando:
						</v-flex>
						<v-flex align-center mt-1 class="title font-weight-black">
							$ {{suscripcionPorId(perfil.idSuscripcion).monto}}
						</v-flex>
						<br>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>
		<v-dialog persistent v-model="formularioDeModificacionEsVisible" max-width="40rem">
			<ModificacionDeDatosDeCliente
				:cliente="perfil"
				@infoModificada="modificarInfo( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacion( )"
			/>
		</v-dialog>
		<v-dialog persistent v-model="formularioDeModificacionTarjetaEsVisible" max-width="40rem">
			<ModificarDeTarjetaDeCreditoDeCliente
				:cliente="perfil"
				@infoModificada="modificarInfo( $event )"
				@error="emitirEventoError( $event )"
				@cancelacion="ocultarFormularioDeModificacionTarjeta( )"
			/>
		</v-dialog>
	</v-container>
</template>
<script lang="ts">
import { Component, Vue , Emit } from 'vue-property-decorator';
import ModificacionDeDatosDeCliente from '@/components/ModificacionDeDatosDeCliente.vue';
import ModificarDeTarjetaDeCreditoDeCliente from '@/components/ModificarDeTarjetaDeCreditoDeCliente.vue';
import { Cliente } from '../interfaces/cliente.interface';
import moment from 'moment';
import { Suscripcion } from '../interfaces/suscripcion.interface';
import { SolicitudParaCrear, Solicitud } from '@/interfaces/solicitud.interface';
@Component({
	components: {
		ModificacionDeDatosDeCliente,
		ModificarDeTarjetaDeCreditoDeCliente
	}
})
export default class DatosDeUsuario extends Vue {
	/* fechas a mostrar */
	public fechaNac!: String;
	public fechaExp!: String;
	/* variable que ayuda a que se muestre o no ventana dialog de modificación */
	public formularioDeModificacionEsVisible = false;
	public formularioDeModificacionTarjetaEsVisible = false;

	public created( ) {
		this.$store.dispatch('obtenerSolicitudes');
	}
	/* Muestra formulario de modificación de datos de usuario*/
	public mostrarFormularioDeModificacion( ): void {
		this.formularioDeModificacionEsVisible = true;
	}
	public mostrarFormularioDeModificacionTarjeta( ): void {
		this.formularioDeModificacionTarjetaEsVisible = true;
	}
	/* Oculta formulario de modificación de datos de usuario*/
	public ocultarFormularioDeModificacion( ): void {
			this.formularioDeModificacionEsVisible = false;
	}
	public ocultarFormularioDeModificacionTarjeta( ): void {
			this.formularioDeModificacionTarjetaEsVisible = false;
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
		this.ocultarFormularioDeModificacionTarjeta( );
	}

	public get perfil( ): Cliente {
		const perfil = this.$store.getters.perfil;
		this.fechaNac = moment(perfil.fechaDeNacimiento).utc().format('DD-MM-YYYY');
		this.fechaExp = moment(perfil.fechaDeExpiracion).utc().format('DD-MM-YYYY');
		return perfil;
	}
	public suscripcionPorId(id: String): Suscripcion {
		return this.$store.getters.suscripcionConId(id);
	}
	public  solicitudPorId(idCliente: String): Solicitud | null {
		return this.$store.getters.solicitudConId(idCliente);
	}
	public async procesarSolicitud( _idCliente: string) {
		const solicitudParaCrear: SolicitudParaCrear = {
			idCliente: _idCliente,
		};
		await this.$store.dispatch( 'crearSolicitud', solicitudParaCrear );
	}
	public get obtenerSolicitudes(): Solicitud[ ] {
		return this.$store.getters.solicitudes;
	}
}
</script>
