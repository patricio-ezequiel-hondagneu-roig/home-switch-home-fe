<template>
	<div>
		<v-container>
			<v-layout>
				<v-expansion-panel light focusable>
					<v-expansion-panel-content lazy ripple>
						<template v-slot:header>
							<span class="font-weight-bold headline sombra-texto">Subastas</span>
						</template>
						<v-container wrap>
							<v-layout
								v-for="(subasta , index) in obtenerSubastas"
								:key="index"
								class="my-2"
							>
								<v-card
								v-if="obtenerResidenciaConId(subasta.idResidencia) !== null"
								height="200"
								width="600"
								elevation-5
								>
									<v-layout row nowrap>
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
										<v-layout column class="pa-2">
											<h1 class="font-weight-bold headline sombra-texto">
												{{obtenerResidenciaConId(subasta.idResidencia).titulo}}
											</h1>
											<p
												style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
												:title="ubicacionDeResidenciaDeSubasta( subasta )"
											>
												{{ ubicacionDeResidenciaDeSubasta( subasta ) }}
											</p>
											<p class="subheading ml-3 red--text">
												Finaliza: {{subasta.fechaDeFin}}
											</p>
											<v-layout row>
												<v-flex font-weight-bold display-1 align-self-end mt-1 mr-2>
													<span class="green--text">$ {{subasta.montoInicial}}</span>
												</v-flex>
												<v-flex align-self-end>

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
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

													<v-tooltip left open-delay="100" close-delay="0" v-if="perfil !== null">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
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

													<v-tooltip left open-delay="100" close-delay="0">
														<template v-slot:activator="{ on }">
															<v-btn
																color="#E0E0E0"
																icon
																class="secondary--text"
																:to="generarRuta( subasta.idResidencia) "
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
import { Cliente } from '@/interfaces/cliente.interface';
@Component({
	components: {
		CargaDeOfertaDeSubasta,
		DetalleDeResidencia
	}
})
export default class SubastasActivas extends Vue{
	public detalleDeResidenciaEsVisible: boolean = false;
	public ofertarDeSubastaEsVisible: boolean = false;
	public subastaParam: Subasta = {
		_id: '',
		idResidencia: '',
		montoInicial: 0,
		fechaDeInicio: '',
		fechaDeFin: '',
	};
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

	public generarRuta( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}

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
		return this.$store.getters.residenciaConId( _id );
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
	// me traigo perfil para saber si esta logeado un cliente
	public get perfil(): Cliente | null {
		return this.$store.getters.perfil;
	}

	public ubicacionDeResidenciaDeSubasta( subasta: Subasta ): string {
		const residencia = this.obtenerResidenciaConId( subasta.idResidencia );

		if ( residencia === undefined ) {
			throw new Error( 'No existe una residencia con el id');
		}

		return `${ residencia.pais }, ${ residencia.provincia }, ${ residencia.localidad }, ${ residencia.domicilio }`;
	}
}
</script>

<style lang="stylus">
	.sombra-texto {
		text-shadow: 0 0.025em 0.1em hsla(0, 0%, 25%, 0.25)
	}
</style>
