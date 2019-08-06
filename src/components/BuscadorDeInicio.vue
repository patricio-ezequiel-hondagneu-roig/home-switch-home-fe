<template>
	<v-layout column align-center>
		<v-flex mb-4>
			<h1>Encuentre su semana ideal para vacacionar</h1>
		</v-flex>
		<v-form>
			<v-container>
				<v-layout>
					<v-flex xs12 md4>
						<v-text-field
							v-model="camposBusqueda.ubicacion"
							:rules="validadores.ubicacion"
							:counter="40"
							label="Ubicación"
							hint="Ej. Argentina, Buenos Aires, La Plata"
						></v-text-field>
					</v-flex>
					<v-flex xs12 md4>
						<v-text-field
							v-model="camposBusqueda.desde"
							label="Desde"
							:rules="validadores.fechaDesde"
							hint="DD/MM/AAAA"
							type="date"
						></v-text-field>
					</v-flex>
					<v-flex xs12 md4>
						<v-text-field
							v-model="camposBusqueda.hasta"
							label="Hasta"
							:rules="validadores.fechaHasta"
							required
							hint="DD/MM/AAAA"
							type="date"
						></v-text-field>
					</v-flex>
					<v-flex xs12 md4>
						<v-btn
							class="primary"
							:loading="esperandoPublicaciones"
							@click.stop="buscarPublicaciones( camposBusqueda )"
						>
							Buscar
						</v-btn>
					</v-flex>
				</v-layout>
			</v-container>
		</v-form>
		<v-container class="pa-3" v-if="mostrarPublicaciones && publicaciones !== null">
			<ReservasDirectasActivas :reservasDirectas="separarReservasDirectas( publicaciones )"/>
			<br>
			<SubastasActivas :subastasActivas="separarSubastas( publicaciones )"/>
		</v-container>
	</v-layout>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Busqueda } from '@/interfaces/busqueda.interface';
import { fechaEsFutura } from '@/helpers/validadores/fecha-es-futura';
import { fechaEsPosteriorQue } from '@/helpers/validadores/fecha-es-posterior-que';
import moment from 'moment';
import { Publicacion } from '@/interfaces/publicacion.interface';
import { Residencia } from '@/interfaces/residencia.interface';
import ReservasDirectasActivas from '@/components/ReservasDirectasActivas.vue';
import SubastasActivas from '@/components/SubastasActivas.vue';
import HotsalesActivas from '@/components/HotsalesActivas.vue';
import { Adquisicion } from '../interfaces/adquisicion.interface';

@Component({
	components: {
		SubastasActivas,
		ReservasDirectasActivas,
		HotsalesActivas
	},
})
export default class BuscadorDeInicio extends Vue {
	public esperandoPublicaciones: boolean = false;
	public publicaciones: Publicacion[ ] = [ ];
	public subastas: Publicacion[ ] = [ ];
	public mostrarPublicaciones: boolean = false;

	public camposBusqueda: Busqueda = {
		ubicacion: '',
		desde: `${ moment().format('YYYY-MM-DD') }`,
		hasta: ''
	};

	public validadores = {
		ubicacion: [ ],
		fechaDesde: [
			fechaEsFutura( 'Fecha de comienzo de la semana' ),
		],
		fechaHasta: [
			fechaEsFutura( 'Fecha de fin de la semana' ),
			fechaEsPosteriorQue( 'Fecha de fin de la semana' , this.camposBusqueda.desde ),
		],
	};

	public async created( ) {
		await this.$store.dispatch( 'obtenerPublicaciones' );
		await this.$store.dispatch( 'obtenerAdquisiciones' );
	}

	public async buscarPublicaciones( busqueda: Busqueda ) {
		await this.$store.dispatch( 'obtenerPublicaciones' );
		await this.$store.dispatch( 'obtenerAdquisiciones' );

		this.esperandoPublicaciones = true;
		this.mostrarPublicaciones = false;

		let publicacionesBuscadas: Publicacion[ ] = this.$store.getters.publicaciones;
		let residenciasBuscadas: Residencia[ ] = this.$store.getters.residencias;

		if ( busqueda.ubicacion !== '' ) {
			residenciasBuscadas = residenciasBuscadas.filter(( _residencia ) => {
				const _ubicacion = `${ _residencia.pais }, ${ _residencia.provincia }, ${ _residencia.localidad }`;
				return _ubicacion.toLowerCase( ).includes( busqueda.ubicacion.toLowerCase( ) );
			});
			publicacionesBuscadas = publicacionesBuscadas.filter( ( _publicacion ) => {
				const residencia = residenciasBuscadas.find( ( _residencia ) => {
					return _publicacion.idResidencia === _residencia._id;
				});
				return residencia !== undefined;
			});
		}

		if ( busqueda.desde !== '' ) {
			publicacionesBuscadas = publicacionesBuscadas.filter( ( _publicacion ) => {
				const fechaDesde = moment(busqueda.desde).subtract( 1, 'day' );
				return ( moment( _publicacion.fechaDeInicioDeSemana ).isAfter( fechaDesde ) );
			});
		}

		if ( busqueda.hasta !== '' ) {
			publicacionesBuscadas = publicacionesBuscadas.filter( ( _publicacion ) => {
				const fechaHasta = moment(busqueda.hasta).add( 1, 'day' );
				return ( moment( _publicacion.fechaDeInicioDeSemana ).isBefore( fechaHasta ) );
			});
		}

		this.publicaciones = publicacionesBuscadas;

		this.esperandoPublicaciones = false;
		this.mostrarPublicaciones = true;
	}

	// verifica que sea una subasta activa
	public esUnaSubastaActiva( publicacion: Publicacion ): boolean {
		// 1° No esta cerrada
		const noCerroSubasta: boolean = !( publicacion.cerroSubasta );

		// 2° Me fijo el intervalo de fechas de una subasta
		const dias: number = 3;
		const meses: number = 6;

		const comienzoDeSubasta = moment( publicacion.fechaDeInicioDeSemana ).subtract( meses, 'M' );
		const finDeSubasta = moment( publicacion.fechaDeInicioDeSemana ).subtract( meses, 'M' ).add( dias, 'days' );

		const fechaDeSubastaValida = moment( ).isBetween( comienzoDeSubasta, finDeSubasta );

		// 3° No hay ganador, pero supongo que si hay ganador no esta cerrada
		// ?????

		return noCerroSubasta && fechaDeSubastaValida;
	}

	// verifica que sea una reserva directa
	public esUnaReservaDirectaActiva( publicacion: Publicacion ): boolean {
		// número de meses antes de que termine la reserva directa
		const meses: number = 6;

		const finDeReservaDirecta = moment( publicacion.fechaDeInicioDeSemana ).subtract( meses, 'M' );

		const aunNoEsSubasta: boolean = moment( ).isBefore( finDeReservaDirecta );

		// verifico que no este adquirida
		const adquisiciones: Adquisicion[ ] = this.$store.getters.adquisiciones;
		const noEsAdquirida = !adquisiciones.some( ( _adquisicion ) => {
			return _adquisicion.idPublicacion === publicacion._id;
		});
		return aunNoEsSubasta && noEsAdquirida;
	}

	// separa las subastas de las publicaciones
	public separarSubastas( publicaciones: Publicacion[ ] ): Publicacion[ ] {
		const subastas = publicaciones.filter( (_publicacion) => {
			return this.esUnaSubastaActiva( _publicacion );
		});
		return subastas;
	}

	public separarReservasDirectas( publicaciones: Publicacion[ ] ): Publicacion[ ] {
		const reservasDirectas = publicaciones.filter( (_publicacion) => {
			return this.esUnaReservaDirectaActiva( _publicacion );
		});
		return reservasDirectas;
	}
}
</script>
