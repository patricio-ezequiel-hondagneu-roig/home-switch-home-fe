<template>
	<div class="pa-5 text-xs-center">
		<h1 class="display-2 mb-4">¿Hola? ¿Hay alguien aquí?</h1>
		<p class="body-1 mb-3">
			Parece que el lugar al que buscabas acceder no existe o no se encuentra disponible.
		</p>
		<p class="body-1 mb-4">
			¿No preferirías buscar en nuestro catálogo de hoteles un lugar para tus próximas vacaciones?
		</p>
		<v-btn :to="{ name: 'Home' }" color="primary">Volver al inicio</v-btn>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component({ })
	export default class PaginaNoEncontrada extends Vue { }
</script>

<style lang="stylus" scoped></style>