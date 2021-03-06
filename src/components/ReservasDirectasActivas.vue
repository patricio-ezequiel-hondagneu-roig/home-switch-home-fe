<template>
	<div v-if="reservasDirectas !== undefined">
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:header>
					<div class="font-weight-bold headline sombra-texto">Reservas directas</div>
				</template>

				<!-- Contenido del panel de reservas directas -->
				<v-card>

					<!-- Elementos con una estructura de control FOR -->
						<v-container wrap>
							<p v-if="reservasDirectas.length === 0">
								No hay publicaciones disponibles para reserva directa actualmente
							</p>
							<v-layout
								v-for="(reservaDirecta , index) in reservasDirectas"
								:key="index"
								class="my-2"
							>
								<!-- Asigno un tamaño fijo a la v-card -->
								<v-card
									v-if="obtenerResidenciaConId(reservaDirecta.idResidencia) !== null"
									height="200"
									width="600"
									elevation-5
								>
									<v-layout row nowrap>

										<!-- Imagen a mostrar de la residencia (que referencia la reserva directa) -->
										<v-flex shrink>
											<!-- Muestro la primera imagen del arreglo de fotos de la residencia en cuestion -->
											<v-img
												v-if="obtenerResidenciaConId(reservaDirecta.idResidencia).fotos.length > 0"
												:src="obtenerResidenciaConId(reservaDirecta.idResidencia).fotos[0]"
												height="200"
												width="200"
											/>

											<!-- Si la residencia no tiene imagenes entonces muestro la imagen estandar -->
											<div v-else>
												<img src="@/assets/images/residenciaSinFotoIndex.jpg"
												height="200"
												width="200"
												>
											</div>
										</v-flex>

										<!-- Datos/Informacion de la reserva directa a mostrar en la v-card -->
										<v-layout column class="pa-2">
											<!-- Nombre de la residencia -->
											<h1 class="font-weight-bold headline sombra-texto">
												{{obtenerResidenciaConId(reservaDirecta.idResidencia).titulo}}
											</h1>

											<!-- Ubicacion de la residencia -->
											<p
												style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
												:title="ubicacionDeResidencia( reservaDirecta )"
											>
												{{ ubicacionDeResidencia( reservaDirecta ) }}
											</p>

											<!-- Comienzo de semana de la reserva directa -->
											<p class="subheading ml-3 green--text font-weight-bold">
												Comienzo de semana: {{ formatearFecha(reservaDirecta.fechaDeInicioDeSemana) }}
											</p>

											<!-- Botones para interactuar con la reserva directa -->
											<v-layout row>
												<v-flex align-self-end>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																@click.stop="mostrarDetallesResidencia( obtenerResidenciaConId(reservaDirecta.idResidencia) )"
																v-on="on"
															>
															<v-icon>info</v-icon>
															</v-btn>
														</template>
														<span>Detalles</span>
													</v-tooltip>

													<v-tooltip left open-delay="100" close-delay="0" v-if="perfilPremiumValido">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																@click.stop="mostrarConfirmacion( reservaDirecta._id )"
																v-on="on"
															>
															<v-icon color="darken-2">monetization_on</v-icon>
															</v-btn>
														</template>
														<span>Comprar</span>
													</v-tooltip>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																:to="generarRuta( reservaDirecta.idResidencia) "
																v-on="on"
															>
															<v-icon>home</v-icon>
															</v-btn>
														</template>
														<span>Informacion completa</span>
													</v-tooltip>

												</v-flex>
											</v-layout>
										</v-layout>
									</v-layout>
								</v-card>
							</v-layout>
						</v-container>
				</v-card>
			</v-expansion-panel-content>
		</v-expansion-panel>

		<!-- Dialogo que se muestra al ver el detalle de una residencia -->
		<v-dialog persistent v-model="detalleDeResidenciaEsVisible" max-width="40rem">
			<DetalleDeResidencia
				v-if="residenciaParam !== null"
				:residencia="residenciaParam"
				@ok="ocultarDetalleDeResidencia( )"
			/>
		</v-dialog>
		<v-dialog persistent v-model="verConfirmacion" width="300">
			<v-card class="pa-4">
				<v-layout column align-center pt-2>
					<span class="title" mt-2>
						¿Desea confirmar su compra?
					</span>
					<v-layout row mt-2>
						<v-btn @click.stop="cancelar()" color="grey">
							Cancelar
						</v-btn>
						<v-btn @click.stop="confirmar()" color="primary">
							Confirmar
						</v-btn>
					</v-layout>
				</v-layout>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Publicacion } from '@/interfaces/publicacion.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { Cliente } from '@/interfaces/cliente.interface';
import { Credito } from '@/interfaces/credito.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import moment from 'moment';
import DetalleDeResidencia from './DetalleDeResidencia.vue';
import { TipoDeAdquisicion } from '@/utils/tipoDeAdquisicion.enum';

@Component({
	components: {
		DetalleDeResidencia
	}
})
export default class ReservasDirectasActivas extends Vue {
	@Prop( )
	public readonly reservasDirectas!: Publicacion[ ];

	public idSeleccionada: string = '';
	public verConfirmacion = false;
	public detalleDeResidenciaEsVisible: boolean = false;
	public residenciaParam: Residencia = {
		_id: '',
		titulo: '',
		pais: '',
		provincia: '',
		localidad: '',
		domicilio: '',
		descripcion: '',
		fotos: [ ],
		montoInicialDeSubasta: 0,
	};

	public obtenerResidenciaConId(_id: String): Residencia | undefined {
		return this.$store.getters.residenciaConId( _id );
	}

	public ubicacionDeResidencia( reservaDirecta: Publicacion ): string {
		const residencia = this.obtenerResidenciaConId( reservaDirecta.idResidencia );

		if ( residencia === undefined ) {
			throw new Error( 'No existe una residencia con el id');
		}

		return `${ residencia.pais }, ${ residencia.provincia }, ${ residencia.localidad }, ${ residencia.domicilio }`;
	}

	public get perfil(): Cliente | null {
		return this.$store.getters.perfil;
	}

	public generarRuta( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}

	public formatearFecha(fecha: string): string {
		return moment(fecha).format('DD/MM/YYYY');
	}

	public mostrarDetallesResidencia( res: Residencia ): void {
		this.residenciaParam = res;
		this.mostrarDetalleDeResidencia();
	}

	public mostrarDetalleDeResidencia( ): void {
		this.detalleDeResidenciaEsVisible = true;
	}

	public ocultarDetalleDeResidencia( ): void {
		this.detalleDeResidenciaEsVisible = false;
	}

	public get perfilPremiumValido( ): boolean {
		if (this.$store.getters.perfil !== null) {
			const idSuscripcion: string = this.$store.getters.perfil.idSuscripcion;
			const suscripcion = this.$store.getters.suscripcionConId(idSuscripcion);

			if ( (suscripcion !== null) && (suscripcion.tipoDeSuscripcion === 'Premium')) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public async adquirirReservaDirecta( _idPublicacion: string ) {
		if (this.$store.getters.perfil.creditos.length > 0) {

			const creditos: Credito[ ] = this.$store.getters.perfil.creditos;
			const cantidadDeCreditosVigentes: number = creditos.filter( (_credito) => {
				const expiracion: boolean = moment( moment(_credito.fechaDeCreacion).add(1, 'years') ).isAfter( moment() );
				return _credito.activo && expiracion;
			}).length;

			if (cantidadDeCreditosVigentes > 0) {
				// se me descuenta un crédito
				await this.$store.dispatch('pagarConCredito',
					{
						idCliente: this.$store.getters.perfil._id,
						clienteParaModificar: this.$store.getters.perfil
					}
				);
				// adquiero la semana en reserva directa
				await this.$store.dispatch( 'crearAdquisicion',
				{
					idCliente: this.$store.getters.perfil._id,
					idPublicacion: _idPublicacion,
					monto: 0,
					fechaDeCreacion: moment( ).utc( ),
					tipoDeAdquisicion: TipoDeAdquisicion.ReservaDirecta,
				});
				// muestro notificación en pantalla
				await this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'success',
					texto: '¡Gracias por su compra! Puede ver su semana recien adquirida en su seccion de cuenta'
				});
			} else {
				await this.$store.dispatch( 'mostrarAlerta', {
					tipo: 'error',
					texto: 'No posee créditos suficientes para realizar esta acción'
				});
			}
		} else {
			await this.$store.dispatch( 'mostrarAlerta', {
				tipo: 'error',
				texto: 'No posee créditos suficientes para realizar esta acción'
			});
		}
	}
	public mostrarConfirmacion( idPublicacion: string ) {
		this.idSeleccionada = idPublicacion;
		this.verConfirmacion = true;
	}
	public confirmar(){
		this.verConfirmacion = false;
		this.adquirirReservaDirecta( this.idSeleccionada )
	}
	public cancelar(){
		this.verConfirmacion = false;
		this.idSeleccionada = '';
	}
}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
