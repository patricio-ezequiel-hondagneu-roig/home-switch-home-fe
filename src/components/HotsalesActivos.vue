<template>
	<div v-if="hotsalesActivos !== undefined">
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:header>
					<div class="font-weight-bold headline sombra-texto">Hotsales Activos</div>
				</template>

				<!-- Contenido del panel de hotsales -->
				<v-card>

					<!-- Elementos con una estructura de control FOR -->
						<v-container wrap>
							<p v-if="hotsalesActivos.length === 0">
								No hay hot sales disponibles actualmente
							</p>
							<v-layout
								v-for="(hotsale , index) in hotsalesActivos"
								:key="index"
								class="my-2"
							>
								<!-- Asigno un tamaño fijo a la v-card -->
								<v-card
									v-if="obtenerResidenciaConId(hotsale.idResidencia) !== null"
									height="200"
									width="600"
									elevation-5
								>
									<v-layout row nowrap>

										<!-- Imagen a mostrar de la residencia (que referencia al hotsale) -->
										<v-flex shrink>
											<!-- Muestro la primera imagen del arreglo de fotos de la residencia en cuestion -->
											<v-img
												v-if="obtenerResidenciaConId(hotsale.idResidencia).fotos.length > 0"
												:src="obtenerResidenciaConId(hotsale.idResidencia).fotos[0]"
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

										<!-- Datos/Informacion del hotsale a mostrar en la v-card -->
										<v-layout column class="pa-2">
											<!-- Nombre de la residencia -->
											<h1 class="font-weight-bold headline sombra-texto">
												{{obtenerResidenciaConId(hotsale.idResidencia).titulo}}
											</h1>

											<!-- Ubicacion de la residencia -->
											<p
												style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
												:title="ubicacionDeResidencia( hotsale )"
											>
												{{ ubicacionDeResidencia( hotsale ) }}
											</p>

											<!-- Comienzo de semana de la reserva directa -->
											<p class="subheading ml-3 green--text font-weight-bold">
												Comienzo de semana: {{ formatearFecha(hotsale.fechaDeInicioDeSemana) }}
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
																@click.stop="mostrarDetallesResidencia( obtenerResidenciaConId(hotsale.idResidencia) )"
																v-on="on"
															>
															<v-icon>info</v-icon>
															</v-btn>
														</template>
														<span>Detalles</span>
													</v-tooltip>

													<v-tooltip left open-delay="100" close-delay="0" v-if="perfilValido">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																@click.stop="adquirirHotsale( hotsale._id )"
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
																:to="generarRuta( hotsale.idResidencia) "
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
export default class HotsalesActivo extends Vue {
	@Prop( )
	public readonly hotsalesActivos!: Publicacion[ ];

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

	public ubicacionDeResidencia( hotsale: Publicacion ): string {
		const residencia = this.obtenerResidenciaConId( hotsale.idResidencia );

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

	public get perfilValido( ): boolean {
		return this.$store.getters.perfil !== null;
	}

	public async adquirirHotsale( _idPublicacion: string ) {
		// adquiero la semana en hotsale
		await this.$store.dispatch( 'crearAdquisicion',
		{
			idCliente: this.$store.getters.perfil._id,
			idPublicacion: _idPublicacion,
			monto: 0,
			fechaDeCreacion: moment( ).utc( ),
			tipoDeAdquisicion: TipoDeAdquisicion.HotSale,
		});
		// muestro notificación en pantalla
		await this.$store.dispatch( 'mostrarAlerta', {
			tipo: 'success',
			texto: '¡Gracias por su compra! Puede ver su semana recien adquirida en su seccion de cuenta'
		});

	}

}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
