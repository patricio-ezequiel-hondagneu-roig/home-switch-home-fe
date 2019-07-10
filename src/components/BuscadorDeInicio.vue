<template>
	<v-layout column align-center>
		<v-flex mb-4>
			<h1>
				Encuentre su semana ideal para vacacionar
			</h1>
		</v-flex>
		<v-form>
			<v-container>
				<v-layout>
					<v-flex
					xs12
					md4
					>
						<v-text-field
							v-model="camposBusqueda.ubicacion"
							:rules="validadores.ubicacion"
							:counter="40"
							label="Ubicación"
							hint="Ej. Argentina, Buenos Aires, La Plata"
						></v-text-field>
					</v-flex>
					<v-flex
					xs12
					md4
					>
						<v-text-field
							v-model="camposBusqueda.desde"
							label="Desde"
							:rules="validadores.fechaA"
							hint="DD/MM/AAAA"
							type="date"
						></v-text-field>
					</v-flex>
					<v-flex
					xs12
					md4
					>
						<v-text-field
							v-model="camposBusqueda.hasta"
							label="Hasta"
							:rules="validadores.fechaB"
							required
							hint="DD/MM/AAAA"
							type="date"
						></v-text-field>
					</v-flex>
					<v-flex
					xs12
					md4
					>
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
		<v-container class="pa-3"
		v-if="mostrarPublicaciones && publicaciones !== null"
		>
			<v-data-table
			:items="publicaciones"
			:rows-per-page-items="[5]"
			no-data-text="No hay publicaciones para mostrar, vuelve más tarde!"
			>
				<template #items="props">
					<td>{{ props.item }}</td>
				</template>
			</v-data-table>
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

@Component
export default class BuscadorDeInicio extends Vue {
	public esperandoPublicaciones: boolean = false;
	public publicaciones: Publicacion[ ] = [ ];
	public mostrarPublicaciones: boolean = false;
	public camposBusqueda: Busqueda = {
		ubicacion: '',
		desde: `${ moment().add( 1 , 'day').format('YYYY-MM-DD') }`,
		hasta: ''
	};

	public validadores = {
			ubicacion: [ ],
			fechaA: [
				fechaEsFutura( 'Fecha de comienzo de la semana' ),
			],
			fechaB: [
				fechaEsFutura( 'Fecha de fin de la semana' ),
				fechaEsPosteriorQue( 'Fecha de fin de la semana' , this.camposBusqueda.desde ),
			],
	};

	public buscarPublicaciones( busqueda: Busqueda ) {
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
					return ( moment( _publicacion.fechaDeInicioDeSemana ).isAfter( busqueda.desde ) );
			});
		}
		if ( busqueda.hasta !== '' ) {
			publicacionesBuscadas = publicacionesBuscadas.filter( ( _publicacion ) => {
					return ( moment( _publicacion.fechaDeInicioDeSemana ).isBefore( busqueda.hasta ) );
			});
		}
		this.publicaciones = publicacionesBuscadas;
		this.esperandoPublicaciones = false;
		this.mostrarPublicaciones = true;
	}
}
</script>

