<template>
	<!-- Pregunta si la publicacion no es null, solucionando el problema de renderizado -->
	<div v-if="publicacion !== null">
		<!-- Contenido a mostrar si la subasta no cerro -->
		<div
			v-if="esUnaSubastaActiva"
    		style="max-width: 800px; margin: auto;"
		>

			<br>

			<v-card>
				<!-- Cabecera de la v-card -->
				<v-toolbar
					color="primary"
					height="45px"
				>
					<v-layout justify-center>
						<v-toolbar-title class="font-weight-black display-1">
							<span class="white--text">
								Residencia en subasta:
							</span>
						</v-toolbar-title>
					</v-layout>
				</v-toolbar>

				<span class="headline font-weight-medium">
					<!-- Imagenes/fotos acerca de la residencia -->
					<v-carousel
						style="height: 200px"
						v-if="residencia.fotos.length > 0"
					>
						<v-carousel-item
							v-for="(foto,i) in fotos"
							:key="i"
							style="background-color: #111111; max-height=100vh"
						>
							<v-layout row justify-center>
								<img
									:src="foto"
									style="height: 200px"
								>
							</v-layout>
						</v-carousel-item>
					</v-carousel>

					<!-- Caso de que la residencia referencia no tenga fotos -->
					<v-carousel
						style="height: 200px"
						v-else
					>
						<v-carousel-item
							v-for="(number,i) in 1"
							:key="i"
							style="background-color: #111111; max-height=100vh"
						>
							<v-layout row justify-center>
								<img
									style="height: 200px"
									src="@/assets/images/residenciaSinFoto.jpg"
								>
							</v-layout>
						</v-carousel-item>
					</v-carousel>

					<br>

					<!-- Nombre/titulo de la residencia -->
					<h1 class="font-weight-bold headline sombra-texto text-xs-center" style="padding-left: 20px">
						{{ obtenerResidenciaConId(publicacion.idResidencia).titulo }}
					</h1>
					<v-flex text-xs-right>
						<v-btn
							color="primary"
							:to="generarRutaDeResidencia( publicacion.idResidencia)"
							outline
						>
							Más información
						</v-btn>
					</v-flex>
				</span>

				<v-spacer></v-spacer>
				<br>
         		<v-divider></v-divider>
				<br>

				<!-- Contenido de la v-card -->
				<h1 class="font-weight-bold headline sombra-texto" style="padding-left: 20px">
					Precio minimo de oferta:

					<!-- Tengo que llamar a un metodo que junte todas las ofertas y agarre la mayor -->
					${{ publicacion.montoInicialDeSubasta }}
					<br>
					<v-btn color="primary">Ofertar</v-btn>
				</h1>

				<v-spacer></v-spacer>
				<br>

         		<v-divider></v-divider>
				<br>

				<!-- Tabla que contiene el historial de las ofertas -->
				<h1 class="font-weight-bold headline sombra-texto" style="padding-left: 20px">
				Historial:
				</h1>
				<v-data-table
					:headers="encabezadosDeTabla"
					:items="arregloVacio"
					class="elevation-1"
				>
					<template v-slot:items="props">
							<td> {{ props.item }} </td>
					</template>
				</v-data-table>
				<br>


			</v-card>

		</div>

		<!-- Contenido a mostrar si la subasta cerro -->
		<div v-else>
			La publicación en cuestión no se puede visualizar en este momento.
		</div>
	</div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';
import moment from 'moment';
import { Residencia } from '@/interfaces/residencia.interface';
import { VuetifyDataTableHeader } from '@/typings/vuetify-data-table-header.d';

@Component
export default class Publicacion extends Vue {

	public get publicacion( ) {
		return this.$store.getters.publicacionConId(this.idPublicacion);
	}

	public get residencia( ): Residencia | undefined {
		return this.obtenerResidenciaConId(this.publicacion.idResidencia);
	}

	public get esUnaSubastaActiva( ) {
		// 1° No esta cerrada
		const noCerroSubasta: boolean = !(this.publicacion.cerroSubasta);

		// 2° Me fijo el intervalo de fechas de una subasta
		const dias: number = 3;
		const meses: number = 6;

		const comienzoDeSubasta = moment(this.publicacion.fechaDeInicioDeSemana).subtract(meses, 'M');
		const finDeSubasta = moment(this.publicacion.fechaDeInicioDeSemana).subtract(meses, 'M').add(dias, 'days');

		const fechaDeSubastaValida = moment( moment( ) ).isBetween(comienzoDeSubasta, finDeSubasta);

		// 3° No hay ganador, pero supongo que si hay ganador no esta cerrada
		// ?????

		return noCerroSubasta && fechaDeSubastaValida;
	}

	public get fotos( ) {
		if (this.residencia !== undefined) {
			return this.residencia.fotos;
		}
	}
	@Prop({ default: undefined })
	public idPublicacion!: string;

	public encabezadosDeTabla: VuetifyDataTableHeader[ ] = [
		{
			text: 'Monto de oferta',
			value: 'monto',
			align: 'right'
		},
		{
			text: 'Día que se oferto',
			value: 'fechaDeCreacion',
			align: 'right'
		},
	];

	public arregloVacio: number[ ] = [ ];

	public created( ) {
		this.$store.dispatch( 'obtenerResidencias' );
		this.$store.dispatch( 'obtenerPublicaciones' );
	}

	public obtenerResidenciaConId( idResidencia: String ): Residencia | undefined {
		return this.$store.getters.residenciaConId( idResidencia );
	}

	public generarRutaDeResidencia( idResidencia: string ): object {
		return {
			name: 'residencia con id',
			params: {
				idResidencia
			}
		};
	}
}
</script>