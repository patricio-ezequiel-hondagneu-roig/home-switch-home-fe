<template>
	<div>
		<v-container v-if="obtenerSubastas.length !== 0">
			<v-layout>
				<v-expansion-panel expand light popout toggle disabled>
					<v-expansion-panel-content>
						<template v-slot:header>
							<span class="font-weight-bold headline sombra-texto">Hotsales</span>
						</template>
						<v-container wrap>
							<v-layout
								v-for="(subasta , index) in obtenerSubastas"
								:key="index"
								class="my-2"
							>
								<v-card
								height="200"
								width="500"
								elevation-5
								>
									<v-layout row wrap>
										<v-flex shrink>
											<v-img
												v-if="obtenerResidenciaConId(subasta.idResidencia).fotos.length > 0"
												:src="obtenerResidenciaConId(subasta.idResidencia).fotos[0]"
												height="200"
												width="200"
											/>
											<div v-if="(obtenerResidenciaConId(subasta.idResidencia).fotos.length  === 0)">
												<img src="@/assets/images/residenciaSinFotoIndex.jpg"
												height="200"
												width="200"
												>
											</div>
										</v-flex>
										<v-flex>
											<v-layout row>
												<v-flex class="mt-2 ml-4">
													<v-layout column align-start>
														<v-flex class="font-weight-bold headline sombra-texto">
															{{obtenerResidenciaConId(subasta.idResidencia).titulo}}
														</v-flex>
														<v-flex class="subheading ml-4 sombra-texto">
															{{obtenerResidenciaConId(subasta.idResidencia).pais}}, {{obtenerResidenciaConId(subasta.idResidencia).provincia}},
															{{obtenerResidenciaConId(subasta.idResidencia).localidad}}, {{obtenerResidenciaConId(subasta.idResidencia).domicilio}}.
														</v-flex>
														<v-flex font-weight-bold display-1 align-self-end mt-5 mr-2>
															<span class="green--text">$ {{subasta.montoInicial}}</span>
														</v-flex>
														<v-flex align-self-end>
															<v-tooltip left open-delay="100" close-delay="0">
																<template v-slot:activator="{ on }">
																	<v-btn
																		icon
																		class="secondary--text"
																		@click.stop="mostrarDetallesResidencia( obtenerResidenciaConId(subasta.idResidencia) )"
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
																		icon
																		class="secondary--text"
																		@click.stop="mostrarOfertar( subasta )"
																		v-on="on"
																	>
																	<v-icon color="green darken-2">attach_money</v-icon>
																	</v-btn>
																</template>
																<span>Ofertar</span>
															</v-tooltip>
														</v-flex>
													</v-layout>
												</v-flex>
											</v-layout>
										</v-flex>
									</v-layout>
								</v-card>
							</v-layout>
						</v-container>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-layout>
		</v-container>
		<v-dialog persistent v-model="detalleDeResidenciaEsVisible" max-width="40rem">
			<DetalleDeResidencia
				v-if="residenciaParam !== null"
				:residencia="residenciaParam"
				@ok="ocultarDetalleDeResidencia( )"
			/>
		</v-dialog>
		<v-dialog persistent v-model="ofertarDeSubastaEsVisible" max-width="40rem">
			<CargaDeOfertaDeSubasta
				v-if="ofertarDeSubastaEsVisible"
				:subasta="subastaParam"
				@ofertaCreada="ocultarOfertarSubasta()"
				@cancelacion="ocultarOfertarSubasta()"
			/>
		</v-dialog>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CargaDeOfertaDeSubasta from '@/components/CargaDeOfertaDeSubasta.vue';
import DetalleDeResidencia from './DetalleDeResidencia.vue';
import { Subasta } from '@/interfaces/subasta.interface';
import { Residencia } from '@/interfaces/residencia.interface';
@Component({
	components: {
		CargaDeOfertaDeSubasta,
		DetalleDeResidencia
	}
})
export default class HotsalesActivas extends Vue{
	public detalleDeResidenciaEsVisible: boolean = false;
	public ofertarDeSubastaEsVisible: boolean = false;
	public subastaParam!: Subasta;
	public residenciaParam!: Residencia;
	/* ------Al crearse este componente se actualizan los datos que va a actualizar y los obtengo--------*/
	public created( ): void {
		this.actualizarSubastas( );
		this.actualizarResidencias( );
	}
	/* -------Solicita al store que actualice la lista local de residencias------*/
	public async actualizarResidencias( ): Promise<void> {
		await this.$store.dispatch( 'obtenerResidencias' );
	}
	/* -------Solicita al store que actualice la lista local de subastas------*/
	public async actualizarSubastas( ): Promise<void> {
			await this.$store.dispatch( 'obtenerSubastas' );
	}
	/**
	 * Lista de todas las residencias actualmente en el sistema.
	 */
	public get obtenerResidencias( ): Residencia[ ] {
		return this.$store.getters.residencias;
	}
	/**
	 * Lista de todas las subastas actualmente en el sistema.
	 */
	public get obtenerSubastas( ): Subasta[ ] {
		return this.$store.getters.subastas;
	}
	public obtenerResidenciaConId(_id: String): Residencia | undefined {
		const residencia = this.$store.getters.residenciaConId( _id );
		if ( residencia === null ) {
				throw new Error( `No existe ninguna residencia con ID "${ _id }"` );
		}
		return residencia;
	}
	// -----------------------------------------------------Comportamiento de ventana emergente
	public mostrarDetallesResidencia( res: Residencia ): void {
		this.residenciaParam = res;
		this.mostrarDetalleDeResidencia();
	}
	public mostrarOfertar( subastaParaOfertar: Subasta ): void {
		this.subastaParam = subastaParaOfertar;
		this.mostrarOfertarSubasta();
	}
	public mostrarDetalleDeResidencia( ): void {
		this.detalleDeResidenciaEsVisible = true;
	}
	public ocultarDetalleDeResidencia( ): void {
		this.detalleDeResidenciaEsVisible = false;
	}
	public mostrarOfertarSubasta( ): void {
		this.ofertarDeSubastaEsVisible = true;
	}
	public ocultarOfertarSubasta( ): void {
		this.ofertarDeSubastaEsVisible = false;
	}
}
</script>
<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
