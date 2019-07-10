<template>
	<div>
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:header>
					<div class="font-weight-bold headline sombra-texto">Reservas Directas</div>
				</template>

				<!-- Contenido del panel de reservas directas -->
				<v-card>

					<!-- Elementos con una estructura de control FOR -->
						<v-container wrap>
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

													<v-tooltip left open-delay="100" close-delay="0" v-if="perfil !== null">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
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
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Publicacion } from '@/interfaces/publicacion.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import { Cliente } from '@/interfaces/cliente.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';
import moment from 'moment';
import DetalleDeResidencia from './DetalleDeResidencia.vue';

@Component({
	components: {
		DetalleDeResidencia
	}
})
export default class ReservasDirectasActivas extends Vue {

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

	public get reservasDirectas( ): Publicacion[ ] {
		return this.$store.getters.reservasDirectas;
	}

	public created( ): void {
		this.actualizarReservasDirectas( );
	}

	public async actualizarReservasDirectas( ): Promise<void> {
		// Actualizo las publicaciones, ya que son reservas directas
		await this.$store.dispatch( 'obtenerPublicaciones' );
	}

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

}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
