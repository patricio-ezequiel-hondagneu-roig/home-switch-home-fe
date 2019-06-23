<template>
	<div>
		<div v-if="residenciaActual !== null">

			<v-carousel
			  	style="height: 400px"
				v-if="residenciaActual.fotos.length > 0">

				<v-carousel-item
					v-for="(foto,i) in fotos"
					:key="i"
					style="background-color: #111111; max-height=100vh"
				>
					<v-layout row justify-center>
						<img :src="foto">
					</v-layout>
				</v-carousel-item>

			</v-carousel>

			<v-carousel
			  	style="height: 400px"
				v-else>

				<v-carousel-item
					v-for="(number,i) in 1"
					:key="i"
					style="background-color: #111111; max-height=100vh"
				>
					<v-layout row justify-center>
						<img
			  				style="height: 400px"
				  			src="@/assets/images/residenciaSinFoto.jpg"
						>
					</v-layout>
				</v-carousel-item>

			</v-carousel>

			<br>
			<hr>

			<!-- {{ residenciaActual._id }} -->


			<p class="display-3 text-xs-center">
				{{ residenciaActual.titulo }}
			</p>
			<hr>
			<br>
			<v-container>
				<v-layout column align-center justify-center class="ma-4">
					<v-card  class="pa-5">
						<p class="display-1">
							<span class="font-weight-black"> País: </span> {{ residenciaActual.pais }}
						</p>

						<br>
						<hr>
						<br>

						<p class="display-1">
							<span class="font-weight-black"> Provincia: </span> {{ residenciaActual.provincia }}
						</p>

						<br>
						<hr>
						<br>

						<p class="display-1">
							<span class="font-weight-black"> Localidad: </span> {{ residenciaActual.localidad }}
						</p>

						<br>
						<hr>
						<br>

						<p class="display-1">
							<span class="font-weight-black"> Domicilio: </span> {{ residenciaActual.domicilio }}
						</p>

						<br>
						<hr>
						<br>

						<p class="display-1">
							<span class="font-weight-black"> Monto inicial de subasta: </span> $ {{ residenciaActual.montoInicialDeSubasta }}
						</p>

						<br>
						<hr>
						<br>

						<p class="display-1 font-weight-black">
							Descripcion:
							<br>
							<p class="subheading">
								{{ residenciaActual.descripcion }}
							</p>
						</p>
					</v-card>
				</v-layout>
			</v-container>

			Reservas Directas: <br>
			Subastas: <br>
			Hot Sales:

		</div>
		<div v-else>
			No existe la residenca con la id {{ idResidencia }}
		</div>
	</div>
</template>


<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator';
	import VueRouter, { Route } from 'vue-router';

	@Component
	export default class Residencia extends Vue {
		@Prop({ default: undefined })
		public idResidencia!: string;

		public created( ) {
			this.$store.dispatch( 'obtenerResidencias' );
		}

		public get residenciaActual( ) {
			return this.$store.getters.residenciaConId(this.idResidencia);
		}

		public get fotos( ) {
			return this.residenciaActual.fotos;
		}

	}
</script>