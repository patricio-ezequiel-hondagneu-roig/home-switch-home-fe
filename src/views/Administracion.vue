<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center row wrap>
			<h1>Acciones</h1>
				<v-btn flat class="success" :to="{ name: 'administracion de residencias' }">
					Admin. Residencias
				</v-btn>
				<v-btn flat class="success" :to="{ name: 'administracion de subastas' }">
					Admin. Subastas
				</v-btn>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Administracion extends Vue {

}
</script>