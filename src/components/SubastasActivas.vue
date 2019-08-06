<template>
	<div v-if="subastasActivas !== undefined">
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:header>
					<div class="font-weight-bold headline sombra-texto">Subastas activas</div>
				</template>

				<!-- Contenido del panel de subastas -->
				<v-card>

					<!-- Elementos con una estructura de control FOR -->
						<v-container wrap>
							<p v-if="subastasActivas.length === 0">
								No hay publicaciones disponibles para subasta actualmente
							</p>
							<v-layout
								v-for="(subastaActiva, index) in subastasActivas"
								:key="index"
								class="my-2"
							>
								<!-- Asigno un tamaño fijo a la v-card -->
								<v-card
									v-if="obtenerResidenciaConId(subastaActiva.idResidencia) !== null"
									height="200"
									width="600"
									elevation-5
								>
									<v-layout row nowrap>

										<!-- Imagen a mostrar de la residencia (que referencia la subasta) -->
										<v-flex shrink>
											<!-- Muestro la primera imagen del arreglo de fotos de la residencia en cuestion -->
											<v-img
												v-if="obtenerResidenciaConId(subastaActiva.idResidencia).fotos.length > 0"
												:src="obtenerResidenciaConId(subastaActiva.idResidencia).fotos[0]"
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

										<!-- Datos/Informacion de la subasta a mostrar en la v-card -->
										<v-layout column class="pa-2">
											<!-- Nombre de la residencia -->
											<h1 class="font-weight-bold headline sombra-texto">
												{{obtenerResidenciaConId(subastaActiva.idResidencia).titulo}}
											</h1>

											<!-- Ubicacion de la residencia -->
											<p
												style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
												:title="ubicacionDeResidencia( subastaActiva )"
											>
												{{ ubicacionDeResidencia( subastaActiva ) }}
											</p>

											<!-- Comienzo de semana de la subasta -->
											<p class="subheading ml-3 green--text font-weight-bold">
												Comienzo de semana: {{ formatearFecha(subastaActiva.fechaDeInicioDeSemana) }}
											</p>

											<!-- Botones para interactuar con la subasta -->
											<v-layout row>
												<!-- Texto antes de los botones -->
												<v-flex font-weight-bold align-self-end mt-1 mr-2>
													<span>Precio minimo: ${{ subastaActiva.montoInicialDeSubasta }}</span>
												</v-flex>

												<v-flex align-self-end>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																@click.stop="mostrarDetallesResidencia( obtenerResidenciaConId(subastaActiva.idResidencia) )"
																v-on="on"
															>
															<v-icon>info</v-icon>
															</v-btn>
														</template>
														<span>Detalles</span>
													</v-tooltip>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																:to="generarRutaDeResidencia( subastaActiva.idResidencia) "
																v-on="on"
															>
															<v-icon>home</v-icon>
															</v-btn>
														</template>
														<span>Informacion completa</span>
													</v-tooltip>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																:to="generarRutaDePublicacion( subastaActiva._id)"
																v-on="on"
															>
															<v-icon>forward</v-icon>
															</v-btn>
														</template>
														<span>Detalles de subasta</span>
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

@Component({
	components: {
		DetalleDeResidencia
	}
})
export default class SubastasActivas extends Vue {
	@Prop( )
	public readonly subastasActivas!: Publicacion[ ];

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

	public ubicacionDeResidencia( subastaActiva: Publicacion ): string {
		const residencia = this.obtenerResidenciaConId( subastaActiva.idResidencia );

		if ( residencia === undefined ) {
			throw new Error( 'No existe una residencia con el id');
		}

		return `${ residencia.pais }, ${ residencia.provincia }, ${ residencia.localidad }, ${ residencia.domicilio }`;
	}

	public get perfil(): Cliente | null {
		return this.$store.getters.perfil;
	}

	public generarRutaDeResidencia( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}

	public generarRutaDePublicacion( idPublicacion: string ): object {
		return {
			name: 'publicacion con id',
			params: {
				idPublicacion
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

}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
